import React, { useEffect, useMemo, useState } from "react";
import { C, makeStyles } from "./theme.js";
import { getFallbackContent } from "./content/fallback.js";
import { generateDailyContent } from "./api/claude.js";
import {
  loadHistory,
  saveEntry,
  hasEntryForToday,
  loadSettings,
  saveSettings,
  loadCachedContent,
  cacheContent,
  todayKey,
} from "./storage.js";
import {
  Welcome,
  CheckIn,
  WordsShow,
  Fluency,
  Recall,
  Reminisce,
  Summary,
  Progress,
  Settings,
} from "./screens.jsx";

const STEPS = ["Check in", "Words", "Name things", "Remember", "Reflect"];

const STEP_INDEX = {
  welcome: -1,
  mood: 0,
  sleep: 0,
  wordsShow: 1,
  fluency: 2,
  recall: 3,
  reminisce: 4,
  summary: 5,
  progress: -1,
  settings: -1,
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function App() {
  const initialSettings = useMemo(() => loadSettings(), []);
  const [big, setBig] = useState(initialSettings.bigText);
  const [apiKey, setApiKey] = useState(initialSettings.apiKey);
  const [settingsStatus, setSettingsStatus] = useState("");

  const [screen, setScreen] = useState("welcome");
  const [content, setContent] = useState(
    () => loadCachedContent() || getFallbackContent()
  );
  const [history, setHistory] = useState(() => loadHistory());

  const [mood, setMood] = useState(null);
  const [sleep, setSleep] = useState(null);
  const [fluencyCount, setFluencyCount] = useState(0);
  const [picked, setPicked] = useState([]);
  const [reflection, setReflection] = useState("");

  // Fetch today's generated content once per day, if a key is set.
  // Any failure quietly falls back to the local bank — the user's
  // session is never blocked by a network or API problem.
  useEffect(() => {
    if (!apiKey || loadCachedContent()) return;
    let cancelled = false;
    generateDailyContent(apiKey)
      .then((payload) => {
        if (cancelled) return;
        cacheContent(payload);
        setContent(payload);
      })
      .catch(() => {
        /* fallback content is already in place */
      });
    return () => {
      cancelled = true;
    };
  }, [apiKey]);

  const S = useMemo(() => makeStyles(big ? 1.18 : 1), [big]);

  const recallGrid = useMemo(
    () => shuffle([...content.words, ...content.decoys]),
    [content]
  );

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const recallScore = picked.filter((w) => content.words.includes(w)).length;
  const stepIndex = STEP_INDEX[screen];

  function startSession() {
    setMood(null);
    setSleep(null);
    setFluencyCount(0);
    setPicked([]);
    setReflection("");
    setScreen("mood");
  }

  function finishSession() {
    const entry = {
      date: todayKey(),
      recall: recallScore,
      fluency: fluencyCount,
      mood,
      sleep,
      checkedIn: true,
    };
    setHistory(saveEntry(entry));
    setScreen("summary");
  }

  function toggleBig() {
    setBig((b) => {
      saveSettings({ bigText: !b, apiKey });
      return !b;
    });
  }

  function handleSaveSettings() {
    saveSettings({ bigText: big, apiKey });
    setSettingsStatus(
      apiKey
        ? "Saved. Fresh exercises will be generated once per day."
        : "Saved. The app will use its built-in exercise bank."
    );
  }

  const screens = {
    welcome: (
      <Welcome
        S={S}
        greeting={greeting}
        doneToday={hasEntryForToday()}
        onStart={startSession}
        onProgress={() => setScreen("progress")}
        onSettings={() => setScreen("settings")}
      />
    ),
    mood: (
      <CheckIn
        S={S}
        title="How are you feeling today?"
        options={CheckIn.MOODS}
        value={mood}
        onSelect={setMood}
        onNext={() => setScreen("sleep")}
      />
    ),
    sleep: (
      <CheckIn
        S={S}
        title="How did you sleep last night?"
        options={CheckIn.SLEEP}
        value={sleep}
        onSelect={setSleep}
        onNext={() => setScreen("wordsShow")}
      />
    ),
    wordsShow: (
      <WordsShow S={S} words={content.words} onNext={() => setScreen("fluency")} />
    ),
    fluency: (
      <Fluency
        S={S}
        category={content.fluencyCategory}
        count={fluencyCount}
        onIncrement={() => setFluencyCount((n) => n + 1)}
        onDone={() => setScreen("recall")}
      />
    ),
    recall: (
      <Recall
        S={S}
        grid={recallGrid}
        picked={picked}
        onToggle={(w) =>
          setPicked((p) => (p.includes(w) ? p.filter((x) => x !== w) : [...p, w]))
        }
        onNext={() => setScreen("reminisce")}
      />
    ),
    reminisce: (
      <Reminisce
        S={S}
        prompt={content.reminiscencePrompt}
        value={reflection}
        onChange={setReflection}
        onFinish={finishSession}
      />
    ),
    summary: (
      <Summary
        S={S}
        recallScore={recallScore}
        fluencyCount={fluencyCount}
        category={content.fluencyCategory}
        nudge={content.nudge}
        onProgress={() => setScreen("progress")}
      />
    ),
    progress: <Progress S={S} history={history} onHome={() => setScreen("welcome")} />,
    settings: (
      <Settings
        S={S}
        apiKey={apiKey}
        onApiKeyChange={setApiKey}
        status={settingsStatus}
        onSave={handleSaveSettings}
        onHome={() => {
          setSettingsStatus("");
          setScreen("welcome");
        }}
      />
    ),
  };

  return (
    <div style={S.page}>
      {/* Top bar: app name + font size toggle */}
      <div
        style={{
          width: "100%",
          maxWidth: "560px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "6px 2px 14px",
        }}
      >
        <span
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: S.fs(20),
            fontWeight: 600,
            color: C.tealDark,
          }}
        >
          Daily Companion
        </span>
        <button
          onClick={toggleBig}
          aria-label="Toggle larger text"
          style={{
            minWidth: "88px",
            minHeight: "48px",
            fontSize: "18px",
            fontWeight: 700,
            fontFamily: "inherit",
            background: "#fff",
            color: C.forest,
            border: `2px solid ${C.line}`,
            borderRadius: "12px",
            cursor: "pointer",
          }}
        >
          {big ? "A−  smaller" : "A+  larger"}
        </button>
      </div>

      {/* Session path indicator */}
      {stepIndex >= 0 && stepIndex < STEPS.length && (
        <div
          style={{
            width: "100%",
            maxWidth: "560px",
            display: "flex",
            gap: "8px",
            marginBottom: "14px",
          }}
          aria-label={`Step ${stepIndex + 1} of ${STEPS.length}: ${STEPS[stepIndex]}`}
        >
          {STEPS.map((s, i) => (
            <div key={s} style={{ flex: 1, textAlign: "center" }}>
              <div
                style={{
                  height: "8px",
                  borderRadius: "4px",
                  background:
                    i < stepIndex ? C.sage : i === stepIndex ? C.terracotta : C.line,
                }}
              />
              <span
                style={{
                  fontSize: S.fs(13),
                  color: i === stepIndex ? C.forest : C.teal,
                  fontWeight: i === stepIndex ? 700 : 400,
                }}
              >
                {s}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="fadeIn" style={{ width: "100%", maxWidth: "560px" }}>
        {screens[screen]}
      </div>

      {/* Wellness framing, always visible */}
      <p
        style={{
          fontSize: S.fs(14),
          color: C.teal,
          maxWidth: "560px",
          textAlign: "center",
          marginTop: "18px",
          lineHeight: 1.5,
        }}
      >
        This is a wellness activity, not a medical test. If you have concerns
        about your memory, please talk with your doctor.
      </p>
    </div>
  );
}
