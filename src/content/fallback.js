// Local exercise bank: 30 days of rotating content, so a keyless user
// sees no repeated material for a full month. Design constraints:
// - All 300 nouns (targets AND decoys) are unique across the entire
//   bank, so no recall grid is ever contaminated by familiarity from a
//   previous day.
// - Decoys match the targets' register (common, concrete, emotionally
//   neutral nouns), so recognition requires genuine recall, not vibes.
// - Categories, prompts, and nudges each vary across the month.
// When a Claude API key is provided, fresh content is generated instead
// (see src/api/claude.js) — this bank is always the safety net, so a
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
    words: ["Walnut", "Thunder", "Maple", "Saddle", "Ember"],
    decoys: ["Prairie", "Whistle", "Garnet", "Quilt", "Cedar"],
    fluencyCategory: "cities or towns",
    reminiscencePrompt:
      "Describe a family meal you remember well. Who was around the table, and what was served?",
    nudge:
      "Learning something small and new — a word, a recipe, a name — gives the brain a healthy stretch.",
  },
  {
    words: ["Compass", "Cherry", "Willow", "Trumpet", "Ocean"],
    decoys: ["Falcon", "Brook", "Peach", "Acorn", "Velvet"],
    fluencyCategory: "things that are round",
    reminiscencePrompt:
      "What games did you play outside as a child? Describe one afternoon you can still picture.",
    nudge:
      "Drinking enough water helps thinking stay clear. A glass with each meal is an easy rhythm.",
  },
  {
    words: ["Barrel", "Tulip", "Granite", "Sparrow", "Honey"],
    decoys: ["Shovel", "Cricket", "Flannel", "Pearl", "Canyon"],
    fluencyCategory: "occupations",
    reminiscencePrompt:
      "Think of a teacher or mentor who made a difference in your life. What did they teach you?",
    nudge:
      "Doing a familiar task with your other hand — stirring, brushing — gives your brain a playful challenge.",
  },
  {
    words: ["Butter", "Eagle", "Cotton", "Valley", "Drum"],
    decoys: ["Pepper", "Turtle", "Silver", "Wheat", "Cabin"],
    fluencyCategory: "words that start with S",
    reminiscencePrompt:
      "Describe a trip or journey you took that you still think about. What made it memorable?",
    nudge:
      "Green vegetables and fish are friends to the brain. One serving today is a small win.",
  },
  {
    words: ["Apple", "Hammer", "Robin", "Castle", "Wool"],
    decoys: ["Onion", "Nickel", "Finch", "Tower", "Linen"],
    fluencyCategory: "flowers",
    reminiscencePrompt:
      "What did Saturday mornings look like in your house growing up? Walk through one from start to finish.",
    nudge:
      "A few minutes of gentle stretching keeps blood flowing to body and brain alike. Slow and easy counts.",
  },
  {
    words: ["Grape", "Chisel", "Heron", "Palace", "Silk"],
    decoys: ["Plum", "Mallet", "Crane", "Temple", "Satin"],
    fluencyCategory: "musical instruments",
    reminiscencePrompt:
      "Think of your childhood best friend. How did you meet, and what did the two of you love to do?",
    nudge:
      "Sunlight in the morning helps set the body's clock — a few minutes by a bright window or outside does it.",
  },
  {
    words: ["Banjo", "Oyster", "Tunnel", "Daisy", "Slate"],
    decoys: ["Fiddle", "Clam", "Subway", "Lily", "Chalk"],
    fluencyCategory: "birds",
    reminiscencePrompt:
      "Describe the neighborhood where you grew up. Which house, shop, or corner do you picture first?",
    nudge:
      "Puzzles, crosswords, or a few pages of a book give the mind a pleasant workout. Ten minutes is plenty.",
  },
  {
    words: ["Radish", "Trolley", "Amber", "Goose", "Muffin"],
    decoys: ["Turnip", "Ferry", "Quartz", "Swan", "Biscuit"],
    fluencyCategory: "types of weather",
    reminiscencePrompt:
      "What was the first car, bicycle, or bus route you ever knew well? Where did it take you?",
    nudge:
      "Music you love wakes up many parts of the brain at once. Put on a favorite album while you tidy or cook.",
  },
  {
    words: ["Carrot", "Dove", "Blanket", "Meteor", "Skillet"],
    decoys: ["Celery", "Wren", "Curtain", "Comet", "Teapot"],
    fluencyCategory: "breakfast foods",
    reminiscencePrompt:
      "Think of a holiday or celebration from years ago that went especially well. What made it special?",
    nudge:
      "Laughing is genuinely good for you. A funny show, a comic strip, or a silly story with a friend all count.",
  },
  {
    words: ["Otter", "Bugle", "Denim", "Orchard", "Bucket"],
    decoys: ["Beaver", "Oboe", "Canvas", "Pasture", "Broom"],
    fluencyCategory: "things found at a beach",
    reminiscencePrompt:
      "Was there a radio program, TV show, or film everyone talked about when you were young? What did you think of it?",
    nudge:
      "Cooking something from scratch — even something simple — exercises planning, memory, and the senses together.",
  },
  {
    words: ["Pretzel", "Owl", "Village", "Ivory", "Rake"],
    decoys: ["Noodle", "Hawk", "Island", "Bronze", "Trowel"],
    fluencyCategory: "items of clothing",
    reminiscencePrompt:
      "Describe a garden, park, or green place you have loved. What grew there, and what did you do there?",
    nudge:
      "Standing up and moving for a minute or two each hour keeps energy and focus steadier through the day.",
  },
  {
    words: ["Salmon", "Harp", "Lilac", "Cottage", "Spoon"],
    decoys: ["Trout", "Cello", "Poppy", "Chimney", "Ladle"],
    fluencyCategory: "sports and games",
    reminiscencePrompt:
      "Think of a pet or animal you have known well — yours or a neighbor's. What was it like?",
    nudge:
      "A short nap can refresh the mind, but keeping it under half an hour protects tonight's sleep.",
  },
  {
    words: ["Fern", "Raisin", "Glacier", "Domino", "Apron"],
    decoys: ["Moss", "Almond", "Lagoon", "Puzzle", "Mitten"],
    fluencyCategory: "trees",
    reminiscencePrompt:
      "What was school like for you? Describe your classroom, your desk, or the walk to get there.",
    nudge:
      "Dancing — even gently, even in the kitchen — pairs movement with music and memory. A song or two is enough.",
  },
  {
    words: ["Pecan", "Windmill", "Beetle", "Satchel", "Cocoa"],
    decoys: ["Cashew", "Lighthouse", "Ladybug", "Wallet", "Cider"],
    fluencyCategory: "things that are blue",
    reminiscencePrompt:
      "Think of a skill you learned by hand — sewing, carpentry, baking, fixing things. Who showed you how?",
    nudge:
      "Volunteering or helping a neighbor, even in a small way, is linked with a healthier, happier mind.",
  },
  {
    words: ["Kite", "Rabbit", "Flute", "Syrup", "Dune"],
    decoys: ["Balloon", "Pony", "Organ", "Waffle", "Cliff"],
    fluencyCategory: "words that start with B",
    reminiscencePrompt:
      "Think of a grandparent's or older relative's home. What did it smell like, and where did you like to sit?",
    nudge:
      "Taking the stairs when you comfortably can, or a few sit-to-stands from a chair, keeps legs and brain supplied.",
  },
  {
    words: ["Deer", "Pickle", "Sled", "Birch", "Saucer"],
    decoys: ["Moose", "Olive", "Canoe", "Aspen", "Platter"],
    fluencyCategory: "farm animals",
    reminiscencePrompt:
      "What meal do you make — or did you once make — better than anyone? How did you learn it?",
    nudge:
      "Hearing well helps the brain stay engaged. If conversations have felt muffled lately, a hearing check is a kind step.",
  },
  {
    words: ["Fox", "Melon", "Kayak", "Spruce", "Button"],
    decoys: ["Lamb", "Mango", "Raft", "Pine", "Zipper"],
    fluencyCategory: "things found in a garden",
    reminiscencePrompt:
      "Describe a library, bookshop, or a particular book that mattered to you at some point in your life.",
    nudge:
      "Practicing balance — standing tall while holding the counter, shifting weight foot to foot — is quiet, useful exercise.",
  },
  {
    words: ["Camel", "Fig", "Glider", "Bamboo", "Thimble"],
    decoys: ["Zebra", "Pear", "Buggy", "Palm", "Needle"],
    fluencyCategory: "desserts and sweet treats",
    reminiscencePrompt:
      "Think of a very snowy day or a very hot summer day from years past. What did you do that day?",
    nudge:
      "Writing down one good thing from today — a sentence is enough — gently trains attention toward the positive.",
  },
  {
    words: ["Seal", "Pancake", "Anvil", "Elm", "Yarn"],
    decoys: ["Whale", "Bagel", "Wrench", "Oak", "Thread"],
    fluencyCategory: "countries",
    reminiscencePrompt:
      "What errands did you run as a young person — the market, the bakery, the hardware store? Describe one of those trips.",
    nudge:
      "Card games, dominoes, or board games with someone else combine thinking and company — a double benefit.",
  },
  {
    words: ["Dolphin", "Jam", "Pliers", "Rose", "Scarf"],
    decoys: ["Minnow", "Jelly", "Drill", "Ivy", "Glove"],
    fluencyCategory: "things that fly",
    reminiscencePrompt:
      "Think of a letter, card, or phone call you once received that made your day. Who was it from?",
    nudge:
      "Taking a slightly different route on today's walk — a new block, a new direction — gives the brain fresh scenery to map.",
  },
  {
    words: ["Tiger", "Cabbage", "Vase", "Dawn", "Boot"],
    decoys: ["Lion", "Lettuce", "Jug", "Dusk", "Sandal"],
    fluencyCategory: "herbs and spices",
    reminiscencePrompt:
      "Describe a birthday you remember well — yours or someone else's. What made it stick in your memory?",
    nudge:
      "A handful of berries or nuts is a brain-friendly snack. Easy to keep nearby, easy to enjoy.",
  },
  {
    words: ["Bear", "Potato", "Stool", "Breeze", "Crayon"],
    decoys: ["Wolf", "Tomato", "Bench", "Rainbow", "Pencil"],
    fluencyCategory: "words that start with M",
    reminiscencePrompt:
      "Which season did you most look forward to when you were younger, and what did it bring with it?",
    nudge:
      "Long sitting makes everything sluggish. A stroll to the window or mailbox every hour or so keeps things moving.",
  },
  {
    words: ["Horse", "Peanut", "Hinge", "Mist", "Banner"],
    decoys: ["Goat", "Coconut", "Bolt", "Dew", "Flag"],
    fluencyCategory: "things found in a living room",
    reminiscencePrompt:
      "Think of people you worked alongside over the years. Who do you remember most fondly, and why?",
    nudge:
      "A few slow, deep breaths — in through the nose, out longer than in — settles the body and clears the head.",
  },
  {
    words: ["Panda", "Ginger", "Easel", "Pond", "Sweater"],
    decoys: ["Koala", "Garlic", "Palette", "Creek", "Cardigan"],
    fluencyCategory: "ocean and sea creatures",
    reminiscencePrompt:
      "Do you remember learning to drive, or to ride a bicycle? Who taught you, and how did it go?",
    nudge:
      "Waking up around the same time each day, even on slow days, keeps sleep deeper and mornings clearer.",
  },
  {
    words: ["Squirrel", "Apricot", "Faucet", "Grove", "Helmet"],
    decoys: ["Chipmunk", "Berry", "Sink", "Thicket", "Visor"],
    fluencyCategory: "hobbies and pastimes",
    reminiscencePrompt:
      "Think of a time there was music and dancing — a wedding, a dance hall, a family party. What do you picture?",
    nudge:
      "Tidying one small drawer or shelf gives a tidy dose of decision-making, movement, and satisfaction.",
  },
  {
    words: ["Penguin", "Basil", "Tractor", "Reef", "Locket"],
    decoys: ["Pelican", "Thyme", "Plow", "Coral", "Bracelet"],
    fluencyCategory: "things that are green",
    reminiscencePrompt:
      "Think of a kindness someone once showed you that you never forgot. What happened?",
    nudge:
      "Reading a few lines aloud — a poem, a headline, a recipe — engages voice, hearing, and memory together.",
  },
  {
    words: ["Hedgehog", "Pumpkin", "Rowboat", "Summit", "Necklace"],
    decoys: ["Badger", "Squash", "Paddle", "Peak", "Earring"],
    fluencyCategory: "first names of people you have known",
    reminiscencePrompt:
      "Describe a place where you have felt truly peaceful — indoors or out. What made it feel that way?",
    nudge:
      "Planning tomorrow's one small outing or task tonight gives the mind a pleasant thread to pick up in the morning.",
  },
];

export function getFallbackContent(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date - start) / 86400000);
  return BANK[dayOfYear % BANK.length];
}
