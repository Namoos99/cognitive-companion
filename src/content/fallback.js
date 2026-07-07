// Local exercise bank. The app works fully offline with zero API
// calls by rotating through this bank by day of year. When a Claude
// API key is provided, fresh content is generated instead (see
// src/api/claude.js) — but this bank is always the safety net, so a
// failed or missing API call never blocks the user's session.

const BANK = [
  {
    words: ["River", "Candle", "Orange", "Piano", "Garden"],
    decoys: ["Window", "Basket", "Cloud", "Ladder", "Mirror"],
    fluencyCategory: "animals",
    reminiscencePrompt:
      "Think back to the kitchen in your childhood home. What do you remember seeing, smelling, or hearing there?",
    nudge:
      "A 20-minute walk today is one of the best things you can do for your brain. Even better with a friend.",
  },
  {
    words: ["Bridge", "Lemon", "Violin", "Meadow", "Anchor"],
    decoys: ["Pillow", "Stone", "Kettle", "Ribbon", "Harbor"],
    fluencyCategory: "fruits and vegetables",
    reminiscencePrompt:
      "What was your first job? Describe your very first day — who you met, and how it felt.",
    nudge:
      "Calling a friend or family member today counts as brain exercise too. Social connection is powerful.",
  },
  {
    words: ["Feather", "Copper", "Sunset", "Wagon", "Clover"],
    decoys: ["Marble", "Lantern", "Petal", "Timber", "Frost"],
    fluencyCategory: "things found in a kitchen",
    reminiscencePrompt:
      "Think of a song that was popular when you were young. Where were you when you used to hear it?",
    nudge:
      "Good sleep helps the brain file away memories. A calm hour before bed tonight is a gift to tomorrow.",
  },
  {
    words: ["Harbor", "Walnut", "Ribbon", "Thunder", "Maple"],
    decoys: ["Candle", "Prairie", "Copper", "Whistle", "Garnet"],
    fluencyCategory: "cities or towns",
    reminiscencePrompt:
      "Describe a family meal you remember well. Who was around the table, and what was served?",
    nudge:
      "Learning something small and new — a word, a recipe, a name — gives the brain a healthy stretch.",
  },
  {
    words: ["Compass", "Cherry", "Willow", "Trumpet", "Ocean"],
    decoys: ["Saddle", "Ember", "Quilt", "Falcon", "Cedar"],
    fluencyCategory: "things that are round",
    reminiscencePrompt:
      "What games did you play outside as a child? Describe one afternoon you can still picture.",
    nudge:
      "Drinking enough water helps thinking stay clear. A glass with each meal is an easy rhythm.",
  },
  {
    words: ["Lantern", "Peach", "Saddle", "Brook", "Falcon"],
    decoys: ["Violin", "Meadow", "Anchor", "Clover", "Walnut"],
    fluencyCategory: "occupations",
    reminiscencePrompt:
      "Think of a teacher or mentor who made a difference in your life. What did they teach you?",
    nudge:
      "Doing a familiar task with your other hand — stirring, brushing — gives your brain a playful challenge.",
  },
  {
    words: ["Quilt", "Ember", "Prairie", "Whistle", "Garnet"],
    decoys: ["Bridge", "Lemon", "Sunset", "Wagon", "Trumpet"],
    fluencyCategory: "words that start with S",
    reminiscencePrompt:
      "Describe a trip or journey you took that you still think about. What made it memorable?",
    nudge:
      "Green vegetables and fish are friends to the brain. One serving today is a small win.",
  },
];

export function getFallbackContent(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date - start) / 86400000);
  return BANK[dayOfYear % BANK.length];
}
