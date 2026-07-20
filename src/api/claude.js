// One small API call per day. Claude generates the day's content as a
// JSON payload (~400-500 tokens); everything else runs locally.
//
// Variety strategy: (1) the prompt requires the five words to come from
// five DIFFERENT semantic domains, so days don't share an aesthetic;
// (2) a rolling list of recently used words is kept in localStorage and
// sent as an avoid-list, since the model has no memory between days.

const RECENT_WORDS_KEY = "cc-recent-words-v1";
const RECENT_WORDS_MAX = 80; // ~8 days of words+decoys

function loadRecentWords() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_WORDS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveRecentWords(newWords) {
  try {
    const merged = [...loadRecentWords(), ...newWords].slice(-RECENT_WORDS_MAX);
    localStorage.setItem(RECENT_WORDS_KEY, JSON.stringify(merged));
  } catch {
    /* non-essential */
  }
}

const SYSTEM_PROMPT = `You generate daily content for a gentle cognitive wellness app used by older adults.

Respond with ONLY a JSON object — no markdown fences, no preamble — in exactly this shape:
{
  "words": [five common, concrete, emotionally neutral English nouns],
  "decoys": [five different nouns of similar style, none overlapping with words],
  "fluencyCategory": "a simple verbal fluency category",
  "reminiscencePrompt": "one warm, open question inviting a positive autobiographical memory, 1-2 sentences",
  "nudge": "one gentle, evidence-informed lifestyle suggestion for brain health, 1-2 sentences, plain language"
}

WORD VARIETY RULES (important):
- The five words must come from five DIFFERENT domains, chosen from: household objects, food and drink, nature and outdoors, tools and workshop, music and art, clothing and fabric, transport and travel, buildings and places, animals, materials and metals, sports and play, kitchen items.
- Never use more than one word from the same domain in a single day.
- Apply the same domain-spread rule to the decoys.
- Prefer everyday modern vocabulary at least as often as rustic or old-fashioned vocabulary.
- Words should be 1-3 syllables and instantly picturable.

OTHER RULES: never reference illness, loss, or medical topics. Keep language warm and plain. Vary the fluency category style across letters, semantic groups, and attribute groups (color, shape, size).`;

function isValidPayload(p) {
  return (
    p &&
    Array.isArray(p.words) &&
    p.words.length === 5 &&
    Array.isArray(p.decoys) &&
    p.decoys.length === 5 &&
    typeof p.fluencyCategory === "string" &&
    typeof p.reminiscencePrompt === "string" &&
    typeof p.nudge === "string" &&
    !p.words.some((w) => p.decoys.includes(w))
  );
}

export async function generateDailyContent(apiKey) {
  const recent = loadRecentWords();
  const avoidClause = recent.length
    ? ` Do NOT use any of these recently used words (as words or decoys): ${recent.join(", ")}.`
    : "";

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Generate today's session content. Today is ${new Date().toDateString()}.${avoidClause}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`API request failed (${response.status})`);
  }

  const data = await response.json();
  const text = (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  const clean = text.replace(/```json|```/g, "").trim();
  const payload = JSON.parse(clean);

  if (!isValidPayload(payload)) {
    throw new Error("Generated content failed validation");
  }

  saveRecentWords([...payload.words, ...payload.decoys]);
  return payload;
}
