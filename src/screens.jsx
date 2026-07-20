import React from "react";
import { C } from "./theme.js";
import { todayKey } from "./storage.js";

// Every screen is a top-level component. This is the permanent fix
// for the focus-loss bug from the prototype: components defined
// inside a parent component get remounted on every state change,
// which makes text inputs drop focus after each keystroke.

const MOODS = [
  { label: "Good", emoji: "😊" },
  { label: "Okay", emoji: "😐" },
  { label: "Not great", emoji: "😔" },
];

const SLEEP = [
  { label: "Well", emoji: "🌙" },
  { label: "So-so", emoji: "🌤️" },
  { label: "Poorly", emoji: "☁️" },
];

export function Welcome({ S, greeting, doneToday, onStart, onProgress, onSettings }) {
  return (
    <div style={S.card}>
      <h1 style={S.h1}>{greeting}.</h1>
      <p style={S.body}>
        {doneToday
          ? "You've already completed today's session — wonderful. You're welcome to do another round, or look back at your progress."
          : "Ready for today's session? It takes about five minutes, and you can go at your own pace."}
      </p>
      <button style={S.bigButton()} onClick={onStart}>
        {doneToday ? "Do another session" : "Start today's session"}
      </button>
      <button style={S.quietButton} onClick={onProgress}>
        See my progress
      </button>
      <button style={S.quietButton} onClick={onSettings}>
        Settings
      </button>
    </div>
  );
}

export function CheckIn({ S, title, options, value, onSelect, onNext }) {
  return (
    <div style={S.card}>
      <h1 style={S.h1}>{title}</h1>
      <div style={{ display: "flex", gap: "12px", marginTop: "18px" }}>
        {options.map((o) => (
          <button
            key={o.label}
            style={S.choiceButton(value === o.label)}
            onClick={() => onSelect(o.label)}
            aria-pressed={value === o.label}
          >
            <span style={{ fontSize: S.fs(34) }}>{o.emoji}</span>
            {o.label}
          </button>
        ))}
      </div>
      <button
        style={{ ...S.bigButton(), opacity: value ? 1 : 0.4 }}
        disabled={!value}
        onClick={onNext}
      >
        Next
      </button>
    </div>
  );
}

CheckIn.MOODS = MOODS;
CheckIn.SLEEP = SLEEP;

export function WordsShow({ S, words, onNext }) {
  return (
    <div style={S.card}>
      <h1 style={S.h1}>Five words to remember</h1>
      <p style={S.body}>
        Take your time reading these. We'll come back to them in a little
        while — no need to rush.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "18px 0" }}>
        {words.map((w) => (
          <div
            key={w}
            style={{
              background: "#fff",
              border: `2px solid ${C.sage}`,
              borderRadius: "14px",
              padding: "16px",
              textAlign: "center",
              fontSize: S.fs(26),
              fontWeight: 700,
              letterSpacing: "0.5px",
            }}
          >
            {w}
          </div>
        ))}
      </div>
      <button style={S.bigButton()} onClick={onNext}>
        I've read them — continue
      </button>
    </div>
  );
}

export function Fluency({ S, category, count, onIncrement, onDone }) {
  return (
    <div style={S.card}>
      <h1 style={S.h1}>Name some {category}</h1>
      <p style={S.body}>
        Say them out loud — any {category} that come to mind. Tap the big
        button once for each one you name. There's no timer and no wrong
        answers.
      </p>
      <div
        style={{
          textAlign: "center",
          fontSize: S.fs(56),
          fontWeight: 700,
          color: C.terracotta,
          margin: "10px 0",
        }}
        aria-live="polite"
      >
        {count}
      </div>
      <button
        style={{ ...S.bigButton(C.terracotta), minHeight: "84px", fontSize: S.fs(24) }}
        onClick={onIncrement}
      >
        + I named one
      </button>
      <button
        style={{ ...S.bigButton(), opacity: count > 0 ? 1 : 0.4 }}
        disabled={count === 0}
        onClick={onDone}
      >
        I'm done
      </button>
    </div>
  );
}

export function Recall({ S, grid, picked, onToggle, onNext }) {
  return (
    <div style={S.card}>
      <h1 style={S.h1}>Which words were on your list?</h1>
      <p style={S.body}>
        Tap the ones you remember seeing earlier. It's completely fine if
        you're not sure — just go with your best guess.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          margin: "18px 0",
        }}
      >
        {grid.map((w) => {
          const on = picked.includes(w);
          return (
            <button
              key={w}
              onClick={() => onToggle(w)}
              aria-pressed={on}
              style={{
                minHeight: "64px",
                fontSize: S.fs(20),
                fontWeight: 700,
                fontFamily: "inherit",
                background: on ? C.teal : "#fff",
                color: on ? "#fff" : C.forest,
                border: `2px solid ${on ? C.teal : C.line}`,
                borderRadius: "14px",
                cursor: "pointer",
              }}
            >
              {w}
            </button>
          );
        })}
      </div>
      <button
        style={{ ...S.bigButton(), opacity: picked.length > 0 ? 1 : 0.4 }}
        disabled={picked.length === 0}
        onClick={onNext}
      >
        Check my answers
      </button>
    </div>
  );
}

export function Reminisce({ S, prompt, value, onChange, onFinish }) {
  return (
    <div style={S.card}>
      <h1 style={S.h1}>A moment to reflect</h1>
      <p style={S.body}>{prompt}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write a few words here, or simply think about it..."
        style={{
          width: "100%",
          minHeight: "140px",
          fontSize: S.fs(19),
          fontFamily: "inherit",
          lineHeight: 1.5,
          padding: "14px",
          borderRadius: "14px",
          border: `2px solid ${C.line}`,
          background: "#fff",
          color: C.forest,
          marginTop: "12px",
          resize: "vertical",
        }}
      />
      <button style={S.bigButton()} onClick={onFinish}>
        Finish today's session
      </button>
      <button style={S.quietButton} onClick={onFinish}>
        Skip this one today
      </button>
    </div>
  );
}

export function Summary({ S, recallScore, fluencyCount, category, nudge, onProgress }) {
  return (
    <div style={S.card}>
      <h1 style={{ ...S.h1, color: C.terracotta }}>Nice work today.</h1>
      <p style={S.body}>
        You remembered <strong>{recallScore} of 5</strong> words and named{" "}
        <strong>{fluencyCount}</strong> {category}. Showing up is what matters
        most — and you did.
      </p>
      <div
        style={{
          background: "#fff",
          border: `2px solid ${C.sage}`,
          borderRadius: "14px",
          padding: "16px",
          marginTop: "16px",
        }}
      >
        <p style={{ ...S.body, margin: 0, fontSize: S.fs(18) }}>
          <strong>One idea for today:</strong> {nudge}
        </p>
      </div>
      <button style={S.bigButton()} onClick={onProgress}>
        See my progress
      </button>
    </div>
  );
}

export function Progress({ S, history, onHome }) {
  // Last 14 CALENDAR days, with missing days shown as rest-day dots.
  const recent = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = todayKey(d);
    const entry = history.find((e) => e.date === key);
    recent.push(entry || { date: key, recall: null, checkedIn: false });
  }
  const checkins = recent.filter((d) => d.checkedIn).length;

  // Tap-to-reveal day details. Hover tooltips are invisible on touch
  // devices and undiscoverable for many users; tapping a bar shows the
  // day's details in a panel below the chart instead.
  const [selected, setSelected] = React.useState(null);

  const friendly = (key) => {
    const [y, m, d] = key.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const todayIso = todayKey();
  const selectedDay = recent.find((x) => x.date === selected);

  return (
    <div style={S.card}>
      <h1 style={S.h1}>My progress</h1>
      {history.length === 0 ? (
        <p style={S.body}>
          Your progress will appear here after your first session. Today is a
          lovely day to start.
        </p>
      ) : (
        <>
          <p style={S.body}>
            You've checked in <strong>{checkins}</strong> of the last{" "}
            <strong>{recent.length}</strong> days.{" "}
            {checkins >= recent.length * 0.6 ? "Wonderful consistency." : "Every visit counts."}
          </p>
          <p style={{ ...S.body, fontSize: S.fs(16), color: C.teal }}>
            Words remembered each day (out of 5). Tap any day for details:
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "6px",
              height: "140px",
              marginTop: "8px",
              paddingBottom: "6px",
              borderBottom: `2px solid ${C.line}`,
            }}
          >
            {recent.map((d) => {
              const isToday = d.date === todayIso;
              const isSelected = selected === d.date;
              return (
                <button
                  key={d.date}
                  onClick={() => setSelected(isSelected ? null : d.date)}
                  aria-label={`${friendly(d.date)}: ${
                    d.recall === null ? "rest day" : `${d.recall} of 5 words`
                  }`}
                  aria-pressed={isSelected}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    height: "100%",
                    background: isSelected ? "#fff" : "transparent",
                    border: "none",
                    borderRadius: "8px",
                    outline: isSelected ? `3px solid ${C.terracotta}` : "none",
                    outlineOffset: "2px",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  {d.recall !== null ? (
                    <div
                      style={{
                        width: "100%",
                        maxWidth: "26px",
                        height: `${(d.recall / 5) * 100}%`,
                        background: isToday ? C.terracotta : C.teal,
                        borderRadius: "6px 6px 0 0",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: C.sage,
                        marginBottom: "2px",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: S.fs(14),
              color: C.teal,
              marginTop: "6px",
            }}
          >
            <span>{friendly(recent[0].date)}</span>
            <span>Today</span>
          </div>
          <div
            aria-live="polite"
            style={{
              background: "#fff",
              border: `2px solid ${selectedDay ? C.sage : C.line}`,
              borderRadius: "14px",
              padding: "14px",
              marginTop: "14px",
              minHeight: "56px",
            }}
          >
            {selectedDay ? (
              <p style={{ ...S.body, margin: 0, fontSize: S.fs(18) }}>
                <strong>{friendly(selectedDay.date)}:</strong>{" "}
                {selectedDay.recall === null
                  ? "a rest day. Those are okay too."
                  : `you remembered ${selectedDay.recall} of 5 words` +
                    (selectedDay.fluency
                      ? ` and named ${selectedDay.fluency} in the category game.`
                      : ".")}
              </p>
            ) : (
              <p style={{ ...S.body, margin: 0, fontSize: S.fs(16), color: C.teal }}>
                Tap a bar or dot above to see that day's details here.
              </p>
            )}
          </div>
          <p style={{ ...S.body, fontSize: S.fs(15), color: C.teal, marginTop: "14px" }}>
            Small dots are rest days. Scores naturally go up and down; what
            helps most is coming back regularly.
          </p>
        </>
      )}
      <button style={S.quietButton} onClick={onHome}>
        Back to home
      </button>
    </div>
  );
}

export function Settings({ S, apiKey, onApiKeyChange, status, onSave, onHome }) {
  return (
    <div style={S.card}>
      <h1 style={S.h1}>Settings</h1>
      <p style={S.body}>
        The app works fully without any setup. If you'd like fresh exercises
        generated each day by Claude, you can add an Anthropic API key. It is
        stored only on this device.
      </p>
      <label
        style={{ ...S.body, fontSize: S.fs(17), fontWeight: 700, display: "block", marginTop: "10px" }}
        htmlFor="api-key"
      >
        Anthropic API key (optional)
      </label>
      <input
        id="api-key"
        type="password"
        value={apiKey}
        onChange={(e) => onApiKeyChange(e.target.value)}
        placeholder="sk-ant-..."
        style={{
          width: "100%",
          minHeight: "52px",
          fontSize: S.fs(18),
          fontFamily: "inherit",
          padding: "12px 14px",
          borderRadius: "14px",
          border: `2px solid ${C.line}`,
          background: "#fff",
          color: C.forest,
          marginTop: "8px",
        }}
      />
      {status && (
        <p style={{ ...S.body, fontSize: S.fs(16), color: C.teal, marginTop: "10px" }} aria-live="polite">
          {status}
        </p>
      )}
      <button style={S.bigButton()} onClick={onSave}>
        Save settings
      </button>
      <button style={S.quietButton} onClick={onHome}>
        Back to home
      </button>
    </div>
  );
}
