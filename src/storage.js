// Simple localStorage persistence. All data stays on the user's own
// device — nothing is sent anywhere except the optional daily content
// request to the Anthropic API.

const HISTORY_KEY = "cc-history-v1";
const SETTINGS_KEY = "cc-settings-v1";
const CONTENT_KEY = "cc-daily-content-v1";

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable — the session still works in memory.
  }
}

export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

// ---- history ----
export function loadHistory() {
  return read(HISTORY_KEY, []);
}

export function saveEntry(entry) {
  const history = loadHistory().filter((e) => e.date !== entry.date);
  history.push(entry);
  history.sort((a, b) => (a.date < b.date ? -1 : 1));
  write(HISTORY_KEY, history);
  return history;
}

export function hasEntryForToday() {
  return loadHistory().some((e) => e.date === todayKey());
}

// ---- settings ----
export function loadSettings() {
  return read(SETTINGS_KEY, { bigText: false, apiKey: "" });
}

export function saveSettings(settings) {
  write(SETTINGS_KEY, settings);
}

// ---- daily content cache (so the API is called at most once per day) ----
export function loadCachedContent() {
  const cached = read(CONTENT_KEY, null);
  return cached && cached.date === todayKey() ? cached.payload : null;
}

export function cacheContent(payload) {
  write(CONTENT_KEY, { date: todayKey(), payload });
}
