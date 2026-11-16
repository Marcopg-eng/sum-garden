// =====================================================
// SUM GARDEN — how everything behaves
//
// The file is in numbered parts. LEARN.md walks through
// them in the same order.
//
//   1. Settings you can tweak
//   2. The save (coins, garden, scores) and localStorage
//   3. Finding things on the page
//   4. Small helper functions
//   5. Making questions
//   6. Switching screens
//   7. Playing a round (timer, scoring, coins)
//   8. Sprites (the pixel pictures)
//   9. The shop
//  10. The garden
//  11. The scores screen
//  12. The home screen
//  13. Wiring up the buttons, then starting
//
// The three extra games (Word Sprout, Letter Patch, Number Plot) live in
// puzzles.js, and the word list is in words.js.
// =====================================================


// =====================================================
// 1. SETTINGS YOU CAN TWEAK
// "const" means a value that never changes while the game runs.
// Names in CAPITALS are a habit programmers use for settings.
// =====================================================

const ROUND_SECONDS = 60;   // how long a round lasts
const STREAK_LENGTH = 5;    // every 5 correct answers in a row...
const STREAK_BONUS = 5;     // ...you get this many bonus coins
const GARDEN_COLUMNS = 10;  // how many plots across
const GARDEN_PLOTS = 70;    // 10 columns x 7 rows
const SAVE_KEY = "sumGardenSave1";  // the name our save is stored under
const SPROUT_ROUNDS = 3;    // a planted sprout grows up after this many rounds
const BONUS_COIN_CHANCE = 0.04; // each second, the chance a bonus coin appears (0.04 = 4%)
const BONUS_COIN_SECONDS = 6;   // how long it waits before vanishing

// The number ranges for each difficulty.
// This is an "object": a labelled box of values. You read one with a dot,
// e.g. DIFFICULTIES.easy.addMax is 20.
const DIFFICULTIES = {
  easy:   { label: "Easy",   addMax: 20,  timesSmallMax: 9,  timesBigMax: 12,  coinMultiplier: 1 },
  normal: { label: "Normal", addMax: 100, timesSmallMax: 12, timesBigMax: 100, coinMultiplier: 2 },
  hard:   { label: "Hard",   addMax: 500, timesSmallMax: 25, timesBigMax: 100, coinMultiplier: 3 },
};

// Typing the answer is harder than picking it, so it pays double.
const MODES = {
  typed:  { label: "Typed",           coins: 2 },
  choice: { label: "Multiple choice", coins: 1 },
};

// Everything the shop sells. This is an "array" (a list) of objects.
// "sprite" is the picture: 8 rows of 8 letters, one letter per pixel.
// The letters are colours, listed in PALETTE further down. A dot is see-through.
const ITEMS = [
  { id: "sprout", name: "Sprout", price: 30, sway: true, note: "Grows into a surprise after 3 rounds", sprite: [
    "........",
    "...l.l..",
    "..ll.ll.",
    "...lgl..",
    "....g...",
    "....g...",
    "...bbb..",
    "..bbbbb.",
  ]},
  { id: "daisy", name: "Daisy", price: 40, sway: true, sprite: [
    "...ww...",
    "..wyyw..",
    "..wyyw..",
    "...ww...",
    "....g...",
    "..g.g...",
    "...gg...",
    "....g...",
  ]},
  { id: "tulip", name: "Tulip", price: 70, sway: true, sprite: [
    "..p.p...",
    "..ppp...",
    "..ppp...",
    "...g....",
    "...g.g..",
    "...gg...",
    "...g....",
    "...g....",
  ]},
  { id: "mushroom", name: "Mushroom", price: 110, sway: false, sprite: [
    "..rrrr..",
    ".rwrrwr.",
    "rrrrwrrr",
    "rwrrrrrr",
    "..wwww..",
    "..wwww..",
    "..wwww..",
    "........",
  ]},
  { id: "bush", name: "Berry bush", price: 160, sway: true, sprite: [
    "........",
    "..ggg...",
    ".gglggg.",
    "ggpgglgg",
    "glggggpg",
    "gggpgggd",
    ".dgggdd.",
    "........",
  ]},
  { id: "pond", name: "Pond", price: 260, sway: false, water: true, sprite: [
    "........",
    "..ssss..",
    ".suuuus.",
    "suuwuuus",
    "suuuunus",
    ".sunuus.",
    "..ssss..",
    "........",
  ]},
  { id: "bench", name: "Bench", price: 380, sway: false, sprite: [
    "........",
    "........",
    "bbbbbbbb",
    "b......b",
    "bbbbbbbb",
    "oooooooo",
    "b......b",
    "b......b",
  ]},
  { id: "tree", name: "Tree", price: 550, sway: true, sprite: [
    "..gggg..",
    ".gglggg.",
    "gggggglg",
    "glgggggg",
    ".gggggd.",
    "...bb...",
    "...bb...",
    "..bbbb..",
  ]},
  { id: "frog", name: "Frog", price: 800, sway: false, sprite: [
    "........",
    ".ll..ll.",
    "lkllllkl",
    "llllllll",
    "lllddlll",
    ".llllll.",
    "ll.ll.ll",
    "........",
  ]},
  // ----- more plants -----
  { id: "fern", name: "Fern", price: 55, sway: true, sprite: [
    "........","g..d..g.",".g.d.g..","g.gdg.g.",".ggdgg..","..gdg...","...d....","...d....",
  ]},
  { id: "lavender", name: "Lavender", price: 90, sway: true, sprite: [
    "..v..v..",".vv.vv..","..v..v.v",".vv.vvvv","..g..g.v","..g.g.g.","..ggggg.","...ggg..",
  ]},
  { id: "sunflower", name: "Sunflower", price: 130, sway: true, sprite: [
    "..yyyy..",".yybbyy.",".yybbyy.","..yyyy..","...g....","..gg.g..","...ggg..","...g....",
  ]},
  { id: "rose", name: "Rose", price: 190, sway: true, sprite: [
    "..rrr...",".rrprr..",".rprrr..","..rrr...","...d....","..dd.d..","...ddd..","...d....",
  ]},
  { id: "cactus", name: "Cactus", price: 220, sway: false, sprite: [
    "...gg...","...gl.g.",".g.gg.g.",".g.glgg.",".ggggg..","...gl...","...gg...","..oooo..",
  ]},
  { id: "pumpkin", name: "Pumpkin", price: 300, sway: false, sprite: [
    "........","....d...","...dd...",".oooooo.","oaooooao","oooooooo","oooooooo",".oooooo.",
  ]},
  // ----- water features ("water: true" makes them shimmer) -----
  // "connect" items have no fixed picture. The game draws them so they join
  // up with neighbours of the same kind: main colour, detail colour, how wide.
  { id: "stream", name: "Stream", price: 60, sway: false, water: true, note: "Joins up with its neighbours",
    connect: { main: "u", detail: "c", width: 4 } },
  { id: "lilypond", name: "Lily pond", price: 320, sway: false, water: true, sprite: [
    "........","..ssss..",".suuuus.","sullupus","sulluuus",".suuuls.","..ssss..","........",
  ]},
  { id: "well", name: "Wishing well", price: 450, sway: false, water: true, sprite: [
    ".bbbbbb.",".b....b.",".b.kk.b.",".b....b.",".ssssss.",".suuuus.",".ssssss.",".ssssss.",
  ]},
  { id: "fountain", name: "Fountain", price: 650, sway: false, water: true, sprite: [
    "...cc...","..c..c..",".c.uu.c.","...ss...","..uuuu..",".ssssss.","suuuuuus","ssssssss",
  ]},
  // ----- decoration -----
  { id: "stones", name: "Stone path", price: 15, sway: false, note: "Joins up with its neighbours",
    connect: { main: "e", detail: "s", width: 4 } },
  { id: "fence", name: "Fence", price: 25, sway: false, note: "Joins up with its neighbours",
    connect: { main: "b", detail: "o", width: 2 } },
  // ----- big pieces: "size: 2" means 2 plots wide and 2 tall. Their pictures are 16 x 16. -----
  { id: "meadow", name: "Flower meadow", price: 700, sway: false, size: 2, note: "Takes a 2 x 2 space", sprite: [
    "................","..p.....w.....y.",".pyp...wyw...yay","..p..g..w..g..y.",
    "..g..g..g..g..g.","........v.......","...r...vvv...p..","..rrr...v...pyp.",
    "...r....g....p..","...g....g....g..",".w.....y.....v..","wyw...yay...vvv.",
    ".w.....y.....v..",".g.....g.....g..",".g..g..g..g..g..","................",
  ]},
  { id: "lake", name: "Lake", price: 900, sway: false, size: 2, water: true, note: "Takes a 2 x 2 space", sprite: [
    "................","....ssssssss....","..sssuuuuuusss..",".ssuuuuuuuuuuss.",
    ".suuucuuuuuuuus.","ssuuccuuuuulluss","suuuuuuuuuullpus","suuuuuuuuuuuluus",
    "suuuuunnuuuuuuus","suulluuuuuuuuuus","sulluuuuuucuuuss",".suuuuuuuccuuus.",
    ".ssuuuuuuuuuuss.","..sssuuuuuusss..","....ssssssss....","................",
  ]},
  { id: "shed", name: "Garden shed", price: 1100, sway: false, size: 2, note: "Takes a 2 x 2 space", sprite: [
    "................",".......rr.......",".....rrrrrr.....","...rrrrrrrrrr...",
    ".rrrrrrrrrrrrrr.","rrrrrrrrrrrrrrrr","..bbbbbbbbbbbb..","..bbbbbbbbbbbb..",
    "..byybbbbbbyyb..","..byybboobbyyb..","..bbbbboobbbbb..","..bbbbboobbbbb..",
    "..bbbbboobbbbb..","..bbbbboobbbbb..","..ssssssssssss..","................",
  ]},
  { id: "oak", name: "Great oak", price: 1200, sway: false, size: 2, note: "Takes a 2 x 2 space", sprite: [
    "....dggggggd....","..dggglggggggd..",".dgglggggglgggd.",".ggggggglggggggd",
    "dgglgggggggglggd","dggggglgggggggdd","dgggggggggglggdd",".dgglgggggggggd.",
    ".ddggggglgggddd.","..dddggggggddd..","....dddbbddd....","......bbbb......",
    "......bbbb......","......bbbb......",".....bbbbbb.....","....bbbbbbbb....",
  ]},
  { id: "greenhouse", name: "Greenhouse", price: 1500, sway: false, size: 2, note: "Takes a 2 x 2 space", sprite: [
    "......wwww......","....wwccccww....","..wwccccccccww..","wwccccccccccccww",
    "wwwwwwwwwwwwwwww","wccwccwccwccwccw","wccwccwccwccwccw","wglwcgwccwgcwclw",
    "wggwggwccwggwggw","wwwwwwwbbwwwwwww","wccwccwbbwccwccw","wgcwcgwbbwgcwcgw",
    "wggwggwbbwggwggw","wggwggwbbwggwggw","ssssssssssssssss","ssssssssssssssss",
  ]},
  // ----- secret plants: "shop: false" means you can't buy them.
  //       The only way to get one is a lucky sprout. -----
  { id: "goldtulip", name: "Golden tulip", price: 0, sway: true, shop: false, sprite: [
    "..a.a...","..aaa...","..aya...","...g....","...g.g..","...gg...","...g....","...g....",
  ]},
  { id: "moonshroom", name: "Moon mushroom", price: 0, sway: false, shop: false, sprite: [
    "..vvvv..",".vcvvcv.","vvvvcvvv","vcvvvvvv","..wwww..","..wwww..","..wwww..","........",
  ]},
];

// What a sprout can grow into. A bigger "weight" means more likely.
// The weights add up to 100, so each one is a percentage chance.
const SPROUT_TABLE = [
  { id: "daisy", weight: 18 }, { id: "fern", weight: 16 }, { id: "tulip", weight: 14 },
  { id: "lavender", weight: 12 }, { id: "mushroom", weight: 10 }, { id: "sunflower", weight: 9 },
  { id: "bush", weight: 6 }, { id: "rose", weight: 5 }, { id: "tree", weight: 4 },
  { id: "goldtulip", weight: 4 }, { id: "moonshroom", weight: 2 },
];

// What kind of thing each item is. Visitors care about this.
const ITEM_TYPES = {
  daisy: "flower", tulip: "flower", lavender: "flower", sunflower: "flower", rose: "flower", goldtulip: "flower", meadow: "flower",
  mushroom: "mushroom", moonshroom: "mushroom",
  sprout: "leafy", fern: "leafy", bush: "leafy", cactus: "leafy", pumpkin: "leafy",
  tree: "tree", oak: "tree",
  pond: "water", lake: "water", stream: "water", lilypond: "water", well: "water", fountain: "water",
  bench: "decor", frog: "decor", stones: "decor", fence: "decor", shed: "decor", greenhouse: "decor",
};

// Creatures that turn up in your garden, and what attracts them.
// "kinds" is how many DIFFERENT items of that type must be planted.
// e.g. a butterfly needs 3 different kinds of flower. "any" counts everything.
const VISITORS = [
  { id: "bee",       name: "Bee",       type: "flower",   kinds: 1, flier: true },
  { id: "butterfly", name: "Butterfly", type: "flower",   kinds: 3, flier: true },
  { id: "worm",      name: "Worm",      type: "mushroom", kinds: 1 },
  { id: "ladybird",  name: "Ladybird",  type: "leafy",    kinds: 2 },
  { id: "bird",      name: "Bluebird",  type: "tree",     kinds: 1, flier: true },
  { id: "dragonfly", name: "Dragonfly", type: "water",    kinds: 1, flier: true },
  { id: "duck",      name: "Duck",      type: "water",    kinds: 2 },
  { id: "snail",     name: "Snail",     type: "any",      kinds: 6 },
];

// Pictures that aren't shop items: the critters that wander about.
const EXTRA_SPRITES = {
  snail:    ["........","........","..bbb...",".boobb.k",".bobob.y",".bbbbbyy","yyyyyyy.","........"],
  chick:    ["........","..yyy...",".yykyo..",".yyyy...","yyyyyy..","yyyyyy..",".yyyy...","..o.o..."],
  ladybird: ["........","........","..rrrr..",".rkrrkrk",".rrrrrrk",".rkrrkr.","..k..k..","........"],
  bee:      ["........","..c..c..","..cccc..",".yykyky.",".yykyky.","........","........","........"],
  butterfly:["........","pp...pp.","ppp.ppp.","pvpkpvp.",".ppkpp..","pp.k.pp.","p.....p.","........"],
  worm:     ["........","........","........","..pp....",".p..p..k","p....pp.","........","........"],
  dragonfly:["........","cc...cc.",".cc.cc..","nnnnnnnk",".cc.cc..","cc...cc.","........","........"],
  duck:     ["........","....ww..","...wwkw.","...wwwoo","w.wwww..","wwwwwww.",".wwwww..","........"],
  bird:     ["........","....uu..","...uuku.","u..uuuuo",".uuuuuu.","..uuuu..","..k.k...","........"],
  wormup:   ["...pp...","..pkpk..","..pppp..","...pp...","...pp...","...pp...","...pp...","...pp..."],
  fish:     ["........","........",".o..oo..",".oooooo.",".ooooko.",".o..oo..","........","........"],
  hive:     ["..aaaa..",".aaaaaa.","abbbbbba",".aaaaaa.","abbbbbba",".aakkaa.",".aakkaa.","..aaaa.."],
  wormhouse:["........","...bb...","..bbbb..",".bbbbbb.","bbbkkbbb","bbbkkbbb","dbbkkbbd","dddddddd"],
  // The lawn: a 16x16 tile of grass tufts, repeated across the garden
  meadow: [
    "................","..d.............",".d.d.......l....","...........l....",
    "................","............d...","...........d.d..","................",
    "..l.............","..l......d......","........d.d.....","................",
    "..............l.","....d.........l.","...d.d..........","................",
  ],
};

// Which colour each sprite letter means.
const PALETTE = {
  g: "#5fb65a",  // green
  d: "#2f7d4a",  // dark green
  l: "#a6e36b",  // light green
  p: "#ff8fb8",  // pink
  w: "#ffffff",  // white
  y: "#ffd84d",  // yellow
  r: "#e8504f",  // red
  b: "#8a5a3c",  // brown
  o: "#ff9d3c",  // orange
  u: "#5cc3f0",  // blue
  n: "#2f86c9",  // deeper blue
  s: "#b9b4c7",  // stone grey
  k: "#2b2640",  // nearly black
  v: "#b48cf2",  // violet
  a: "#f5b301",  // gold
  c: "#bdeeff",  // pale icy blue
  e: "#e6d3a3",  // sand
};


// =====================================================
// 2. THE SAVE
// One object holds everything worth remembering between visits.
// localStorage is a small notebook the browser keeps for each website.
// It can only store text, so we turn the object into text (JSON) to save
// it, and back into an object to load it.
// =====================================================

// A brand new save, for first-time players.
function makeFreshSave() {
  return {
    coins: 0,
    inventory: {},                             // e.g. { daisy: 2, tree: 1 }
    garden: new Array(GARDEN_PLOTS).fill(null), // 24 plots, all empty (null = nothing)
    history: [],                               // one entry per finished round
    best: {},                                  // e.g. { "normal-typed": 31 }
    roundsPlayed: 0,                           // counts every finished round
    sproutPlanted: {},                         // plot number -> roundsPlayed when the sprout went in
    settings: { mode: "typed", difficulty: "normal" },
  };
}

function loadSave() {
  const fresh = makeFreshSave();
  // "try" means: attempt this, and if anything goes wrong jump to "catch"
  // instead of crashing. Storage can be switched off in some browsers.
  try {
    const text = localStorage.getItem(SAVE_KEY);
    if (text) {
      const saved = JSON.parse(text);  // text -> object
      // Copy the saved values over the fresh ones. Starting from "fresh"
      // means anything missing from an old save still gets a sensible value.
      Object.assign(fresh, saved);
      fresh.settings = Object.assign({ mode: "typed", difficulty: "normal" }, saved.settings);
      // Safety checks in case the saved data is damaged
      if (Array.isArray(fresh.garden) && fresh.garden.length === 24) {
        // An old save from when the garden was 6 x 4. Move everything into
        // the middle of the new, bigger garden so nothing is lost.
        const bigger = new Array(GARDEN_PLOTS).fill(null);
        const movedSprouts = {};
        fresh.garden.forEach(function (itemId, oldIndex) {
          const row = Math.floor(oldIndex / 6) + 1;
          const column = (oldIndex % 6) + 2;
          const newIndex = row * GARDEN_COLUMNS + column;
          bigger[newIndex] = itemId;
          if (fresh.sproutPlanted[oldIndex] !== undefined) {
            movedSprouts[newIndex] = fresh.sproutPlanted[oldIndex];
          }
        });
        fresh.garden = bigger;
        fresh.sproutPlanted = movedSprouts;
      } else if (!Array.isArray(fresh.garden) || fresh.garden.length !== GARDEN_PLOTS) {
        fresh.garden = new Array(GARDEN_PLOTS).fill(null);
      }
      if (!DIFFICULTIES[fresh.settings.difficulty]) fresh.settings.difficulty = "normal";
      if (!MODES[fresh.settings.mode]) fresh.settings.mode = "typed";
    }
  } catch (error) {
    // Nothing to do: we just carry on with a fresh save.
  }
  return fresh;
}

function writeSave() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));  // object -> text
  } catch (error) {
    // Saving failed. The game still works, it just won't remember.
  }
}

// "let" means a value that CAN change. This is the live save used everywhere.
let save = loadSave();


// =====================================================
// 3. FINDING THINGS ON THE PAGE
// document.getElementById("x") finds the HTML element with id="x".
// We do it once here and keep each one in a variable.
// =====================================================

const coinCountEl = document.getElementById("coin-count");
const earnLineEl = document.getElementById("earn-line");
const bestLineEl = document.getElementById("best-line");
const startBtn = document.getElementById("start-btn");

const timeLeftEl = document.getElementById("time-left");
const timeFillEl = document.getElementById("time-fill");
const scoreEl = document.getElementById("score");
const streakEl = document.getElementById("streak");
const questionCardEl = document.getElementById("question-card");
const questionEl = document.getElementById("question");
const coinPopEl = document.getElementById("coin-pop");
const answerInput = document.getElementById("answer-input");
const choicesEl = document.getElementById("choices");
const quitBtn = document.getElementById("quit-btn");
const bonusCoinBtn = document.getElementById("bonus-coin");
const growLineEl = document.getElementById("grow-line");
const crittersEl = document.getElementById("critters");

const finalScoreEl = document.getElementById("final-score");
const newBestEl = document.getElementById("new-best");
const resultsBestEl = document.getElementById("results-best");
const resultsCoinsEl = document.getElementById("results-coins");
const againBtn = document.getElementById("again-btn");
const toShopBtn = document.getElementById("to-shop-btn");

const gardenGridEl = document.getElementById("garden-grid");
const gardenHintEl = document.getElementById("garden-hint");
const trayEl = document.getElementById("tray");
const visitorLineEl = document.getElementById("visitor-line");
const shopListEl = document.getElementById("shop-list");
const chartEl = document.getElementById("chart");
const bestListEl = document.getElementById("best-list");
const resetBtn = document.getElementById("reset-btn");


// =====================================================
// 4. SMALL HELPER FUNCTIONS
// A function is a named set of steps you can reuse.
// =====================================================

// A whole number from min to max, both included. randomInt(2, 5) -> 2, 3, 4 or 5
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// One random thing out of a list. pickRandom(["a", "b", "c"]) -> "b"
function pickRandom(list) {
  return list[randomInt(0, list.length - 1)];
}

// Mix a list into a random order (like shuffling cards).
// It walks backwards through the list, swapping each card with a random earlier one.
function shuffle(list) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    const temp = list[i];
    list[i] = list[j];
    list[j] = temp;
  }
  return list;
}

// Pick from a list where some things are more likely than others.
// Imagine a raffle: an entry with weight 18 holds 18 tickets. We draw one
// ticket number, then walk along the list until we reach whoever holds it.
function pickWeighted(table) {
  let total = 0;
  table.forEach(function (entry) { total = total + entry.weight; });
  let ticket = Math.random() * total;
  for (let i = 0; i < table.length; i++) {
    ticket = ticket - table[i].weight;
    if (ticket < 0) return table[i].id;
  }
  return table[table.length - 1].id;
}

// Find a shop item by its id. findItem("daisy") -> the daisy object
function findItem(id) {
  return ITEMS.find(function (item) {
    return item.id === id;
  });
}

// Restart a CSS animation. Removing and re-adding the class isn't enough on
// its own; reading offsetWidth in between forces the browser to notice.
function replayAnimation(element, className) {
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
}

// The label we store personal bests under, e.g. "normal-typed"
function bestKey() {
  return save.settings.difficulty + "-" + save.settings.mode;
}

// How many coins one correct answer is worth with the current settings
function coinsPerCorrect() {
  return MODES[save.settings.mode].coins * DIFFICULTIES[save.settings.difficulty].coinMultiplier;
}

function updateCoinDisplay() {
  coinCountEl.textContent = save.coins;
}


// =====================================================
// 5. MAKING QUESTIONS
// Each question is an object like { text: "37 + 58", answer: 95 }.
// =====================================================

function makeQuestion() {
  const level = DIFFICULTIES[save.settings.difficulty];

  // Hard mode: about 1 question in 4 is a fraction question
  if (save.settings.difficulty === "hard" && Math.random() < 0.25) {
    return makeFractionQuestion();
  }

  const operation = pickRandom(["+", "-", "x", "/"]);

  if (operation === "+" || operation === "-") {
    const a = randomInt(2, level.addMax);
    const b = randomInt(2, level.addMax);
    if (operation === "+") {
      return { text: a + " + " + b, answer: a + b };
    }
    // Subtraction is addition backwards: if a + b = total, then total − a = b.
    // Building it this way means the answer is never negative.
    return { text: (a + b) + " − " + a, answer: b };
  }

  const small = randomInt(2, level.timesSmallMax);
  const big = randomInt(2, level.timesBigMax);
  if (operation === "x") {
    return { text: small + " × " + big, answer: small * big };
  }
  // Division is multiplication backwards, so the answer is always a whole number.
  return { text: (small * big) + " ÷ " + small, answer: big };
}

// ----- Fractions (hard mode only) -----

// Greatest common divisor: the biggest number that divides both.
// gcd(6, 8) is 2. We use it to simplify fractions: 6/8 -> 3/4.
function gcd(a, b) {
  while (b !== 0) {
    const leftover = a % b;
    a = b;
    b = leftover;
  }
  return a;
}

// Write a fraction in its simplest form. fractionText(6, 8) -> "3/4", fractionText(4, 2) -> "2"
function fractionText(top, bottom) {
  const g = gcd(top, bottom);
  top = top / g;
  bottom = bottom / g;
  return bottom === 1 ? String(top) : top + "/" + bottom;
}

// Fraction questions carry two extra things:
//   answerText: how the right answer is written, e.g. "5/6"
//   choices:    the four multiple choice labels, already shuffled
function makeFractionQuestion() {
  const kind = pickRandom(["of", "add", "decimal"]);

  // e.g. "3/4 of 48" -> 36. The whole number is a multiple of the bottom,
  // so the answer always comes out whole. No extras needed.
  if (kind === "of") {
    const bottom = pickRandom([2, 3, 4, 5, 6, 8]);
    const top = randomInt(1, bottom - 1);
    const whole = bottom * randomInt(2, 12);
    return { text: top + "/" + bottom + " of " + whole, answer: top * whole / bottom };
  }

  // e.g. "1/2 + 1/3" -> "5/6"
  if (kind === "add") {
    const b1 = pickRandom([2, 3, 4, 5, 6, 8]);
    const b2 = pickRandom([2, 3, 4, 5, 6, 8]);
    const t1 = randomInt(1, b1 - 1);
    const t2 = randomInt(1, b2 - 1);
    // a/b + c/d = (a*d + c*b) / (b*d)
    let top = t1 * b2 + t2 * b1;
    let bottom = b1 * b2;
    const g = gcd(top, bottom);
    top = top / g;
    bottom = bottom / g;

    // Wrong answers. The first is the classic mistake: adding tops and bottoms.
    const wrongs = [[t1 + t2, b1 + b2]].concat(shuffle([
      [top + 1, bottom], [top - 1, bottom], [top, bottom + 1], [top + 1, bottom + 1], [top + 2, bottom],
    ]));
    return {
      text: t1 + "/" + b1 + " + " + t2 + "/" + b2,
      answer: top / bottom,
      answerText: fractionText(top, bottom),
      choices: pickWrongLabels(top / bottom, fractionText(top, bottom), wrongs.map(function (w) {
        return { value: w[0] / w[1], label: fractionText(w[0], w[1]) };
      })),
    };
  }

  // e.g. "3/8 as a decimal" -> 0.375. These bottoms always give short decimals.
  const bottom = pickRandom([4, 5, 8, 10, 20]);
  const top = randomInt(1, bottom - 1);
  const value = top / bottom;
  const wrongs = shuffle([0.05, -0.05, 0.1, -0.1, 0.025, -0.025]).map(function (nudge) {
    const wrong = Number((value + nudge).toFixed(3));   // toFixed tidies tiny rounding errors
    return { value: wrong, label: String(wrong) };
  });
  return {
    text: top + "/" + bottom + " as a decimal",
    answer: value,
    answerText: String(value),
    choices: pickWrongLabels(value, String(value), wrongs),
  };
}

// Take the right answer plus the first three wrong ones that are positive
// and all different in value, then shuffle the four labels.
function pickWrongLabels(rightValue, rightLabel, wrongs) {
  const usedValues = [rightValue];
  const labels = [rightLabel];
  wrongs.forEach(function (wrong) {
    const isNew = usedValues.every(function (used) {
      return Math.abs(used - wrong.value) > 0.000001;
    });
    if (labels.length < 4 && wrong.value > 0 && isNew) {
      usedValues.push(wrong.value);
      labels.push(wrong.label);
    }
  });
  return shuffle(labels);
}

// Turn what was typed into a number. "3/4" -> 0.75, "0.375" -> 0.375, "95" -> 95.
// Gives NaN ("not a number") for anything unfinished like "3/".
function parseTyped(text) {
  if (text.includes("/")) {
    const parts = text.split("/");
    if (parts.length !== 2 || parts[0] === "" || parts[1] === "") return NaN;
    return Number(parts[0]) / Number(parts[1]);
  }
  return Number(text);
}

// For multiple choice: the right answer plus three believable wrong ones.
function makeChoices(answer) {
  const choices = [answer];
  // Wrong answers are near misses (off by 1, 2, 10...) because those are the
  // slips people actually make. Far-off numbers would be too easy to rule out.
  const nudges = [1, 2, 3, 10, 20, -1, -2, -3, -10, -20, 9, -9, 11, -11];

  // "while" repeats until we have 4 choices
  while (choices.length < 4) {
    const wrong = answer + pickRandom(nudges);
    // Only keep it if it's positive and not already in the list
    if (wrong > 0 && !choices.includes(wrong)) {
      choices.push(wrong);
    }
  }
  return shuffle(choices);
}


// =====================================================
// 6. SWITCHING SCREENS
// All screens are always in the page. We hide every one, then show one.
// =====================================================

function showScreen(name) {
  // Hide them all...
  document.querySelectorAll(".screen").forEach(function (screen) {
    screen.classList.add("hidden");
  });
  // ...then show the one we want. "screen-" + "shop" -> "screen-shop"
  document.getElementById("screen-" + name).classList.remove("hidden");

  // Highlight the matching button in the bottom nav
  document.querySelectorAll(".nav-btn").forEach(function (button) {
    button.classList.toggle("selected", button.dataset.screen === name);
  });

  // The nav hides during a round (see "body.playing" in style.css)
  document.body.classList.toggle("playing", name === "game");
  if (name === "game") {            // no bonus coins during a round
    bonusCoinLeft = 0;
    bonusCoinBtn.classList.add("hidden");
  }

  // Redraw the screen so it shows the latest coins, items and scores
  if (name === "home") renderHome();
  if (name === "garden") renderGarden();
  if (name === "shop") renderShop();
  if (name === "scores") renderScores();

  window.scrollTo(0, 0);
}


// =====================================================
// 7. PLAYING A ROUND
// "round" holds everything that changes during one 60-second game.
// =====================================================

const round = {
  score: 0,
  streak: 0,
  timeLeft: ROUND_SECONDS,
  coinsEarned: 0,
  question: null,
  timerId: null,     // lets us stop the timer later
  running: false,
};

function startRound() {
  // Reset everything for a new round
  round.score = 0;
  round.streak = 0;
  round.timeLeft = ROUND_SECONDS;
  round.coinsEarned = 0;
  round.running = true;

  // Show the typing box OR the choice buttons, depending on the setting
  const typed = save.settings.mode === "typed";
  answerInput.classList.toggle("hidden", !typed);
  choicesEl.classList.toggle("hidden", typed);

  // Phones show a numbers-only keyboard, except on hard where you need "/" and "."
  answerInput.inputMode = save.settings.difficulty === "hard" ? "text" : "numeric";

  showScreen("game");
  updateHud();
  nextQuestion();

  // setInterval runs a function again and again. 1000 milliseconds = 1 second.
  clearInterval(round.timerId);
  round.timerId = setInterval(tick, 1000);
}

// Runs once a second while a round is on
function tick() {
  round.timeLeft = round.timeLeft - 1;
  updateHud();
  if (round.timeLeft <= 0) {
    endRound();
  }
}

// HUD = "heads-up display": the time, score and streak at the top
function updateHud() {
  timeLeftEl.textContent = round.timeLeft;
  scoreEl.textContent = round.score;
  streakEl.textContent = round.streak;
  // Time bar width as a percentage, e.g. 30 of 60 seconds -> 50%
  timeFillEl.style.width = (round.timeLeft / ROUND_SECONDS * 100) + "%";
}

function nextQuestion() {
  round.question = makeQuestion();
  questionEl.textContent = round.question.text;
  // Longer questions (fractions) get smaller letters so they fit on one line
  questionEl.classList.toggle("long", round.question.text.length > 10);

  if (save.settings.mode === "typed") {
    answerInput.value = "";
    answerInput.focus();   // puts the cursor in the box so you can just type
  } else {
    showChoices();
  }
}

// Build the four answer buttons for multiple choice
function showChoices() {
  choicesEl.innerHTML = "";  // clear the old buttons
  // Fraction questions bring their own labels. For the rest we make number
  // choices and turn them into text with String(), so both kinds match.
  const labels = round.question.choices || makeChoices(round.question.answer).map(String);
  const rightLabel = round.question.answerText || String(round.question.answer);

  labels.forEach(function (label) {
    const button = document.createElement("button");
    button.className = "btn";
    button.textContent = label;
    button.addEventListener("click", function () {
      if (!round.running) return;
      if (label === rightLabel) {
        handleCorrect();
      } else {
        handleWrong();
      }
    });
    choicesEl.appendChild(button);
  });
}

function handleCorrect() {
  round.score = round.score + 1;
  round.streak = round.streak + 1;

  let earned = coinsPerCorrect();
  // % gives the remainder after dividing. streak % 5 is 0 at 5, 10, 15...
  if (round.streak % STREAK_LENGTH === 0) {
    earned = earned + STREAK_BONUS;
  }
  round.coinsEarned = round.coinsEarned + earned;

  // Little celebrations
  coinPopEl.textContent = "+" + earned;
  replayAnimation(coinPopEl, "float-up");
  replayAnimation(questionCardEl, "pop");

  updateHud();
  nextQuestion();
}

// Only multiple choice can be "wrong" (in typed mode you just keep typing).
// A wrong pick costs a point, so guessing at random doesn't pay.
function handleWrong() {
  round.score = Math.max(0, round.score - 1);  // never below 0
  round.streak = 0;
  replayAnimation(questionCardEl, "shake");
  updateHud();
  nextQuestion();
}

// ----- Sprouts -----

// Any sprout that has been planted for enough rounds turns into something
// random. Returns the names of what grew, for the results screen.
function growSprouts() {
  const grown = [];
  save.garden.forEach(function (itemId, index) {
    if (itemId !== "sprout") return;
    const plantedAt = save.sproutPlanted[index] || 0;
    if (save.roundsPlayed - plantedAt >= SPROUT_ROUNDS) {
      const newId = pickWeighted(SPROUT_TABLE);
      save.garden[index] = newId;
      delete save.sproutPlanted[index];
      grown.push(findItem(newId).name);
    }
  });
  return grown;
}

function endRound() {
  clearInterval(round.timerId);  // stop the timer
  round.running = false;

  // Count the round, then see if any sprouts are ready
  save.roundsPlayed = (save.roundsPlayed || 0) + 1;
  const grown = growSprouts();
  growLineEl.textContent = grown.length > 0 ? "A sprout grew into: " + grown.join(", ") + "!" : "";
  answerInput.blur();            // closes the phone keyboard

  // Bank the coins
  save.coins = save.coins + round.coinsEarned;

  // Add this round to the history (Date.now() is the current time as a number)
  save.history.push({
    date: Date.now(),
    score: round.score,
    difficulty: save.settings.difficulty,
    mode: save.settings.mode,
  });
  // Keep the history from growing forever: only the newest 200 rounds
  if (save.history.length > 200) {
    save.history = save.history.slice(-200);
  }

  // Is this a new personal best for these settings?
  const key = bestKey();
  const oldBest = save.best[key] || 0;   // "|| 0" means: use 0 if there's no best yet
  const isNewBest = round.score > oldBest;
  if (isNewBest) {
    save.best[key] = round.score;
  }

  writeSave();
  updateCoinDisplay();

  // Fill in the results screen
  finalScoreEl.textContent = round.score;
  newBestEl.classList.toggle("hidden", !isNewBest);
  resultsBestEl.textContent = "Personal best (" + DIFFICULTIES[save.settings.difficulty].label +
    " / " + MODES[save.settings.mode].label + "): " + (save.best[key] || 0);
  resultsCoinsEl.textContent = round.coinsEarned;
  showScreen("results");
}

// Leaving a round early: nothing is saved.
function quitRound() {
  clearInterval(round.timerId);
  round.running = false;
  showScreen("home");
}


// =====================================================
// 8. SPRITES (THE PIXEL PICTURES)
// We turn each item's 8 rows of letters into a real image, once, at the start.
// =====================================================

const spriteImages = {};  // filled in below, e.g. spriteImages.daisy = "data:image/png..."

function makeSpriteImage(rows) {
  // A canvas is an invisible drawing board. Ours is 8 pixels by 8 pixels.
  const canvas = document.createElement("canvas");
  canvas.width = rows[0].length;   // usually 8, but the lawn tile is 16
  canvas.height = rows.length;
  const pen = canvas.getContext("2d");

  // Go through every row (y) and every letter in the row (x)
  rows.forEach(function (row, y) {
    for (let x = 0; x < row.length; x++) {
      const colour = PALETTE[row[x]];
      if (colour) {              // a "." has no colour, so it's skipped
        pen.fillStyle = colour;
        pen.fillRect(x, y, 1, 1); // paint one pixel
      }
    }
  });

  // Turn the drawing into an image address we can use in CSS
  return canvas.toDataURL();
}

// Draw one version of a connecting item (stream, path, fence).
// "mask" says which sides to reach out to: up = 1, right = 2, down = 4, left = 8.
// There's always a blob in the middle, plus an arm towards each joined side.
function makeConnectedRows(connect, mask) {
  const low = (8 - connect.width) / 2;       // where the band starts...
  const high = low + connect.width - 1;      // ...and ends
  const rows = [];
  for (let y = 0; y < 8; y++) {
    let row = "";
    for (let x = 0; x < 8; x++) {
      const inX = x >= low && x <= high;
      const inY = y >= low && y <= high;
      // "&" checks whether one of the four yes/no answers inside mask is a yes
      const filled = (inX && inY) ||
        (inX && y < low && (mask & 1)) || (inY && x > high && (mask & 2)) ||
        (inX && y > high && (mask & 4)) || (inY && x < low && (mask & 8));
      // Sprinkle the detail colour on some pixels for texture
      row = row + (filled ? ((x * 3 + y * 5) % 7 === 0 ? connect.detail : connect.main) : ".");
    }
    rows.push(row);
  }
  return rows;
}

ITEMS.forEach(function (item) {
  try {
    if (item.connect) {
      // All 16 combinations of neighbours, stored as e.g. spriteImages["stream-5"]
      for (let mask = 0; mask < 16; mask++) {
        spriteImages[item.id + "-" + mask] = makeSpriteImage(makeConnectedRows(item.connect, mask));
      }
      spriteImages[item.id] = spriteImages[item.id + "-10"];   // left + right, for the shop
    } else {
      spriteImages[item.id] = makeSpriteImage(item.sprite);
    }
  } catch (error) {
    spriteImages[item.id] = "";
  }
});

// The same for the power-up and critter pictures
Object.keys(EXTRA_SPRITES).forEach(function (name) {
  try {
    spriteImages[name] = makeSpriteImage(EXTRA_SPRITES[name]);
  } catch (error) {
    spriteImages[name] = "";
  }
});

// The garden lawn uses the meadow tile as its background
gardenGridEl.style.backgroundImage = "url(" + spriteImages.meadow + ")";

// Make a <div> that shows an item's picture
function makeSpriteElement(item) {
  const sprite = document.createElement("div");
  sprite.className = "sprite";
  sprite.style.backgroundImage = "url(" + spriteImages[item.id] + ")";
  return sprite;
}


// =====================================================
// 9. THE SHOP
// "render" means: build what's on screen from the current data.
// We rebuild the whole list each time something changes. Simple and reliable.
// =====================================================

function renderShop() {
  shopListEl.innerHTML = "";

  // filter() keeps only the buyable items; sort() puts the cheapest first
  const forSale = ITEMS.filter(function (item) {
    return item.shop !== false;
  }).sort(function (a, b) {
    return a.price - b.price;
  });

  forSale.forEach(function (item) {
    const card = document.createElement("div");
    card.className = "shop-card";
    card.appendChild(makeSpriteElement(item));

    const name = document.createElement("p");
    name.className = "shop-name";
    name.textContent = item.name;
    card.appendChild(name);

    if (item.note) {
      const note = document.createElement("p");
      note.className = "small shop-note";
      note.textContent = item.note;
      card.appendChild(note);
    }

    const owned = document.createElement("p");
    owned.className = "small";
    owned.textContent = "In bag: " + (save.inventory[item.id] || 0);
    card.appendChild(owned);

    const button = document.createElement("button");
    button.className = "btn";
    button.textContent = "Buy " + item.price;
    button.disabled = save.coins < item.price;   // greyed out if you can't afford it
    button.addEventListener("click", function () {
      buyItem(item.id);
    });
    card.appendChild(button);

    shopListEl.appendChild(card);
  });
}

function buyItem(id) {
  const item = findItem(id);
  if (save.coins < item.price) return;   // not enough coins: stop here

  save.coins = save.coins - item.price;
  save.inventory[id] = (save.inventory[id] || 0) + 1;
  writeSave();
  updateCoinDisplay();
  renderShop();
}


// =====================================================
// 10. THE GARDEN
// save.garden is a list of 70 plots, row by row. Each one holds:
//   null         an empty plot
//   "daisy"      an item id: the item sits here
//   "@12"        this plot is covered by the big item planted at plot 12
// Tap something in your bag, then tap an empty plot to plant it.
// Tap a planted item to put it back in your bag.
// =====================================================

const GARDEN_ROWS = GARDEN_PLOTS / GARDEN_COLUMNS;
let selectedItemId = null;   // what you're currently holding from the bag

// Turning a plot number into a row and column, and back
function plotRow(index) { return Math.floor(index / GARDEN_COLUMNS); }
function plotColumn(index) { return index % GARDEN_COLUMNS; }

// Big items are 2 plots wide and tall. Most items don't say, so they're 1.
function itemSize(item) { return item.size || 1; }

// The item planted at a plot, or null if it's empty or only "covered"
function itemAt(index) {
  const value = save.garden[index];
  if (!value || value[0] === "@") return null;
  return findItem(value) || null;
}

// Every plot an item would cover if planted at "index".
// Returns null if it would stick out over the edge.
function plotsCovered(index, size) {
  if (plotColumn(index) + size > GARDEN_COLUMNS || plotRow(index) + size > GARDEN_ROWS) return null;
  const plots = [];
  for (let down = 0; down < size; down++) {
    for (let across = 0; across < size; across++) {
      plots.push(index + down * GARDEN_COLUMNS + across);
    }
  }
  return plots;
}

// Which sides have a neighbour of the same kind? Used by streams, paths and
// fences so they join up. The answer is one number built from four yes/no
// questions: up = 1, right = 2, down = 4, left = 8. Up and left = 9.
function neighbourMask(index, id) {
  let mask = 0;
  if (plotRow(index) > 0 && save.garden[index - GARDEN_COLUMNS] === id) mask = mask + 1;
  if (plotColumn(index) < GARDEN_COLUMNS - 1 && save.garden[index + 1] === id) mask = mask + 2;
  if (plotRow(index) < GARDEN_ROWS - 1 && save.garden[index + GARDEN_COLUMNS] === id) mask = mask + 4;
  if (plotColumn(index) > 0 && save.garden[index - 1] === id) mask = mask + 8;
  return mask;
}

function renderGarden() {
  // If you no longer own the selected item, let go of it
  if (selectedItemId && !save.inventory[selectedItemId]) {
    selectedItemId = null;
  }

  // --- The plots ---
  gardenGridEl.innerHTML = "";
  // While you're holding something, empty plots get a dotted outline (see style.css)
  gardenGridEl.classList.toggle("placing", selectedItemId !== null);

  save.garden.forEach(function (value, index) {
    if (value && value[0] === "@") return;   // covered by a big item: nothing to draw

    const item = itemAt(index);
    const size = item ? itemSize(item) : 1;
    const plot = document.createElement("button");
    plot.className = "plot";
    // Tell the grid exactly where this plot goes and how many plots it spans
    plot.style.gridColumn = (plotColumn(index) + 1) + " / span " + size;
    plot.style.gridRow = (plotRow(index) + 1) + " / span " + size;

    if (item) {
      const sprite = makeSpriteElement(item);
      if (item.connect) {
        // Pick the picture that matches which neighbours it has
        sprite.style.backgroundImage = "url(" + spriteImages[item.id + "-" + neighbourMask(index, item.id)] + ")";
        plot.classList.add("joined");
      }
      if (item.sway) {
        sprite.classList.add("sway");
        // A different start time for each plot so they don't all sway together
        sprite.style.animationDelay = (-(index % 5) * 0.4) + "s";
      }
      if (item.water) sprite.classList.add("shimmer");
      plot.appendChild(sprite);
      plot.setAttribute("aria-label", item.name + ", tap to pick up");
    } else {
      plot.setAttribute("aria-label", "Empty plot");
    }

    plot.addEventListener("click", function () {
      tapPlot(index);
    });
    gardenGridEl.appendChild(plot);
  });

  addWildlife();

  // --- The bag ---
  trayEl.innerHTML = "";
  let bagIsEmpty = true;
  ITEMS.forEach(function (item) {
    const count = save.inventory[item.id] || 0;
    if (count === 0) return;   // skip things you don't own
    bagIsEmpty = false;

    const button = document.createElement("button");
    button.className = "tray-item";
    if (item.id === selectedItemId) button.classList.add("selected");
    button.setAttribute("aria-label", item.name + ", " + count + " in bag");
    button.appendChild(makeSpriteElement(item));

    const badge = document.createElement("span");
    badge.className = "tray-count";
    badge.textContent = count;
    button.appendChild(badge);

    button.addEventListener("click", function () {
      // Tapping the selected item again lets go of it
      selectedItemId = (selectedItemId === item.id) ? null : item.id;
      renderGarden();
    });
    trayEl.appendChild(button);
  });

  // --- The hint line ---
  if (selectedItemId) {
    const held = findItem(selectedItemId);
    gardenHintEl.textContent = "Tap an empty plot to place your " + held.name.toLowerCase() +
      (itemSize(held) > 1 ? ". It needs a 2 x 2 space." : ".");
  } else if (bagIsEmpty) {
    gardenHintEl.textContent = "Your bag is empty. Earn coins and visit the shop.";
  } else {
    gardenHintEl.textContent = "Tap something in your bag, then tap a plot.";
  }
}

function tapPlot(index) {
  const planted = itemAt(index);

  if (planted) {
    // Pick it up: clear every plot it covers, and back into the bag it goes
    plotsCovered(index, itemSize(planted)).forEach(function (plot) {
      save.garden[plot] = null;
    });
    save.inventory[planted.id] = (save.inventory[planted.id] || 0) + 1;
    delete save.sproutPlanted[index];   // a dug-up sprout starts again
  } else if (selectedItemId && save.inventory[selectedItemId] > 0) {
    const held = findItem(selectedItemId);
    const plots = plotsCovered(index, itemSize(held));
    // Every plot it would cover has to be on the lawn and empty
    const fits = plots !== null && plots.every(function (plot) {
      return save.garden[plot] === null;
    });
    if (!fits) {
      gardenHintEl.textContent = "Not enough room there. It needs a 2 x 2 space.";
      return;
    }
    plots.forEach(function (plot) {
      save.garden[plot] = "@" + index;   // mark them all as covered...
    });
    save.garden[index] = held.id;        // ...then put the item itself in the first one
    save.inventory[held.id] = save.inventory[held.id] - 1;
    if (held.id === "sprout") {
      save.sproutPlanted[index] = save.roundsPlayed || 0;   // remember when it went in
    }
  } else {
    return;   // empty plot and nothing selected: nothing to do
  }

  writeSave();
  renderGarden();
}

// ----- Wildlife -----

// The plot numbers of everything planted that is of one type, e.g. "flower"
function plotsOfType(type) {
  const plots = [];
  save.garden.forEach(function (value, index) {
    const item = itemAt(index);
    if (item && ITEM_TYPES[item.id] === type) plots.push(index);
  });
  return plots;
}

// Which visitors does the garden attract right now?
function currentVisitors() {
  // A Set is a list with no repeats: three daisies still count as one kind
  const plantedKinds = new Set();
  save.garden.forEach(function (value, index) {
    const item = itemAt(index);
    if (item) plantedKinds.add(item.id);
  });

  return VISITORS.filter(function (visitor) {
    let count = 0;
    plantedKinds.forEach(function (itemId) {
      if (visitor.type === "any" || ITEM_TYPES[itemId] === visitor.type) count = count + 1;
    });
    return count >= visitor.kinds;
  });
}

// Draw a small picture on top of the garden, positioned relative to a plot.
// across/down are measured in plots (0.5 = half a plot), size too.
function addOverlay(index, spriteId, className, across, down, size) {
  const overlay = document.createElement("div");
  overlay.className = "overlay " + className;
  overlay.style.left = ((plotColumn(index) + across) / GARDEN_COLUMNS * 100) + "%";
  overlay.style.top = ((plotRow(index) + down) / GARDEN_ROWS * 100) + "%";
  overlay.style.width = (size / GARDEN_COLUMNS * 100) + "%";
  overlay.appendChild(makeSpriteElement({ id: spriteId }));
  gardenGridEl.appendChild(overlay);
  return overlay;
}

function addWildlife() {
  const visitors = currentVisitors();
  const flowers = plotsOfType("flower");
  const mushrooms = plotsOfType("mushroom");
  const trees = plotsOfType("tree");
  const waters = plotsOfType("water");
  // Water you could swim in (not wells or fountains)
  const swimmable = waters.filter(function (index) {
    return ["pond", "lilypond", "lake", "stream"].includes(save.garden[index]);
  });
  const homes = [];
  let wanderers = 0;

  visitors.forEach(function (visitor) {
    // Worms don't wander: one pokes in and out of the soil by each mushroom
    if (visitor.id === "worm") {
      mushrooms.slice(0, 3).forEach(function (index, n) {
        const burrow = addOverlay(index, "wormup", "burrow", 0.62, 0.42, 0.4);
        burrow.firstChild.style.animationDelay = (-n * 1.7) + "s";
      });
      return;
    }
    // The duck paddles on a pond or lake if there is one
    const ponds = swimmable.filter(function (index) { return save.garden[index] !== "stream"; });
    if (visitor.id === "duck" && ponds.length > 0) {
      const size = itemSize(itemAt(ponds[0]));
      addOverlay(ponds[0], "duck", "floating", 0.25 * size, 0.12 * size, 0.55);
      return;
    }

    // Everyone else wanders from side to side
    const creature = document.createElement("div");
    creature.className = "visitor visitor-" + visitor.id;
    if (visitor.flier) creature.classList.add("flier");
    // Spread them out: each gets its own height, speed and starting point
    creature.style.top = [8, 30, 52, 72, 18, 62, 42, 84][wanderers % 8] + "%";
    creature.style.animationDuration = [28, 40, 22, 60, 34, 26, 46, 90][wanderers % 8] + "s";
    creature.style.animationDelay = (-wanderers * 7) + "s";
    if (visitor.id === "snail") creature.style.animationDuration = "120s";
    creature.appendChild(makeSpriteElement(visitor));
    gardenGridEl.appendChild(creature);
    wanderers = wanderers + 1;
  });

  // --- Homes: enough of one thing and the visitors move in ---

  // 5 flowers: a beehive, hung in a tree if you have one, with bees circling it
  if (flowers.length >= 5) {
    const inTree = trees.length > 0;
    const spot = inTree ? trees[0] : flowers[0];
    const size = inTree ? itemSize(itemAt(spot)) : 1;
    const across = inTree ? 0.55 * size : 0.62;
    const down = inTree ? 0.3 * size : 0.5;
    addOverlay(spot, "hive", "", across, down, 0.4);
    addOverlay(spot, "bee", "orbit", across + 0.05, down + 0.05, 0.3);
    addOverlay(spot, "bee", "orbit", across + 0.05, down + 0.05, 0.3).style.animationDelay = "-1.5s";
    homes.push("Beehive");
  }

  // 3 mushrooms: the worms build a little house
  if (mushrooms.length >= 3) {
    addOverlay(mushrooms[1], "wormhouse", "", 0, 0.55, 0.45);
    homes.push("Worm house");
  }

  // Fish jump in streams, ponds and lakes. More water, more fish.
  swimmable.slice(0, waters.length >= 4 ? 4 : 2).forEach(function (index, n) {
    const size = itemSize(itemAt(index));
    const fish = addOverlay(index, "fish", "fish", 0.28 * size, 0.25 * size, 0.45);
    fish.firstChild.style.animationDelay = (-n * 1.3) + "s";
  });
  if (waters.length >= 4) homes.push("Fish shoal");

  // Fireflies. They are always here, but only glow at night (see style.css).
  [[12, 20], [34, 70], [55, 35], [71, 80], [88, 25], [45, 55]].forEach(function (place, n) {
    const firefly = document.createElement("div");
    firefly.className = "firefly";
    firefly.style.left = place[0] + "%";
    firefly.style.top = place[1] + "%";
    firefly.style.animationDelay = (-n * 0.7) + "s";
    gardenGridEl.appendChild(firefly);
  });

  // --- The line under the garden ---
  let line = "No visitors yet. Different plants attract different creatures.";
  if (visitors.length > 0) {
    const names = visitors.map(function (visitor) { return visitor.name; });
    line = "Visitors: " + names.join(", ") + " (" + visitors.length + " of " + VISITORS.length + ")";
  }
  if (homes.length > 0) line = line + ". Homes: " + homes.join(", ");
  visitorLineEl.textContent = line;
}


// =====================================================
// 11. THE SCORES SCREEN
// =====================================================

let resetArmed = false;   // true after the first tap on "reset everything"

function renderScores() {
  // --- Bar chart of the last 20 rounds ---
  chartEl.innerHTML = "";
  const recent = save.history.slice(-20);   // the newest 20

  if (recent.length === 0) {
    chartEl.textContent = "Play a round to see your progress here.";
  } else {
    // Find the tallest score so we can size every bar against it
    let highest = 1;
    recent.forEach(function (entry) {
      if (entry.score > highest) highest = entry.score;
    });

    recent.forEach(function (entry, index) {
      const bar = document.createElement("div");
      bar.className = "bar";
      if (index === recent.length - 1) bar.classList.add("latest");
      bar.style.height = (entry.score / highest * 100) + "%";

      const label = document.createElement("span");
      label.className = "bar-label";
      label.textContent = entry.score;
      bar.appendChild(label);

      chartEl.appendChild(bar);
    });
  }

  // --- Personal bests, one line per difficulty and mode you've played ---
  bestListEl.innerHTML = "";
  let anyBest = false;
  Object.keys(DIFFICULTIES).forEach(function (difficulty) {
    Object.keys(MODES).forEach(function (mode) {
      const best = save.best[difficulty + "-" + mode];
      if (!best) return;
      anyBest = true;

      const rowEl = document.createElement("div");
      rowEl.className = "best-row";
      const nameEl = document.createElement("span");
      nameEl.textContent = DIFFICULTIES[difficulty].label + " / " + MODES[mode].label;
      const scoreEl2 = document.createElement("strong");
      scoreEl2.textContent = best;
      rowEl.appendChild(nameEl);
      rowEl.appendChild(scoreEl2);
      bestListEl.appendChild(rowEl);
    });
  });
  if (!anyBest) {
    bestListEl.textContent = "No bests yet.";
  }

  resetArmed = false;
  resetBtn.textContent = "reset everything";
}

// Wiping your save needs two taps, so you can't do it by accident.
function tapReset() {
  if (!resetArmed) {
    resetArmed = true;
    resetBtn.textContent = "tap again to wipe coins, garden and scores";
    return;
  }
  save = makeFreshSave();
  selectedItemId = null;
  writeSave();
  updateCoinDisplay();
  renderScores();
}


// =====================================================
// 12. THE HOME SCREEN
// =====================================================

function renderHome() {
  // Highlight the chips that match the current settings
  document.querySelectorAll(".chip").forEach(function (chip) {
    const setting = chip.dataset.setting;   // "mode" or "difficulty"
    chip.classList.toggle("selected", save.settings[setting] === chip.dataset.value);
  });

  earnLineEl.textContent = "Each correct answer: " + coinsPerCorrect() +
    " coins. " + STREAK_LENGTH + " in a row: +" + STREAK_BONUS + " bonus.";
  if (save.settings.difficulty === "hard") {
    earnLineEl.textContent = earnLineEl.textContent + " Hard includes fractions: type answers like 3/4 or 0.375.";
  }
  bestLineEl.textContent = "Personal best: " + (save.best[bestKey()] || 0);
}


// =====================================================
// 13. WIRING UP THE BUTTONS, THEN STARTING
// addEventListener("click", ...) means: when this is clicked, run that.
// =====================================================

startBtn.addEventListener("click", startRound);
againBtn.addEventListener("click", startRound);
quitBtn.addEventListener("click", quitRound);
resetBtn.addEventListener("click", tapReset);
toShopBtn.addEventListener("click", function () {
  showScreen("shop");
});

// The bottom nav: each button says where it goes in its data-screen attribute
document.querySelectorAll(".nav-btn").forEach(function (button) {
  button.addEventListener("click", function () {
    showScreen(button.dataset.screen);
  });
});

// The settings chips on the home screen
document.querySelectorAll(".chip").forEach(function (chip) {
  chip.addEventListener("click", function () {
    save.settings[chip.dataset.setting] = chip.dataset.value;
    writeSave();
    renderHome();
  });
});

// Typed mode: check the answer after every key press. No Enter key needed.
answerInput.addEventListener("input", function () {
  if (!round.running) return;
  const typed = answerInput.value.trim();   // trim() removes stray spaces
  // parseTyped("95") turns the text "95" into the number 95 so we can compare.
  // We check "very nearly equal" instead of ===, because decimals like 1/3
  // can't be stored exactly. This also means 6/8 is accepted for 3/4.
  if (typed !== "" && Math.abs(parseTyped(typed) - round.question.answer) < 0.000001) {
    handleCorrect();
  }
});

// Bonus coins: now and then a coin appears somewhere on screen (never during
// a round). Click it for a few free coins. This check runs once a second.
let bonusCoinLeft = 0;   // seconds before the current coin vanishes (0 = none showing)

setInterval(function () {
  if (round.running) return;

  if (bonusCoinLeft > 0) {
    bonusCoinLeft = bonusCoinLeft - 1;
    if (bonusCoinLeft === 0) bonusCoinBtn.classList.add("hidden");
    return;
  }
  // Math.random() gives a number from 0 to 1, so this is true 4% of the time
  if (Math.random() < BONUS_COIN_CHANCE) {
    bonusCoinBtn.style.left = randomInt(8, 82) + "%";
    bonusCoinBtn.style.top = randomInt(18, 70) + "%";
    bonusCoinBtn.textContent = "";
    bonusCoinBtn.classList.remove("hidden", "collected");
    bonusCoinLeft = BONUS_COIN_SECONDS;
  }
}, 1000);

bonusCoinBtn.addEventListener("click", function () {
  if (bonusCoinBtn.classList.contains("collected")) return;   // already grabbed
  const value = randomInt(3, 10);
  save.coins = save.coins + value;
  writeSave();
  updateCoinDisplay();
  // If the shop is open, redraw it: you might now afford something new
  if (!document.getElementById("screen-shop").classList.contains("hidden")) renderShop();

  // Show "+7" for a second, then hide
  bonusCoinBtn.textContent = "+" + value;
  bonusCoinBtn.classList.add("collected");
  bonusCoinLeft = 1;
});

// Day and night: 4 minutes of day, then 2 of night, round and round.
// Adding the class "night" to <body> is all it takes; style.css does the rest.
const DAY_SECONDS = 240;
const NIGHT_SECONDS = 120;
let skyClock = 0;

setInterval(function () {
  skyClock = (skyClock + 1) % (DAY_SECONDS + NIGHT_SECONDS);   // % wraps back to 0
  document.body.classList.toggle("night", skyClock >= DAY_SECONDS);
}, 1000);

// Critters that wander along the grass. Each gets its own speed and start time.
["snail", "chick", "ladybird", "bee"].forEach(function (name, index) {
  const critter = document.createElement("div");
  critter.className = "critter critter-" + name;
  critter.style.animationDuration = [90, 34, 55, 26][index] + "s";
  critter.style.animationDelay = [-10, -20, -40, -5][index] + "s";
  critter.appendChild(makeSpriteElement({ id: name }));
  crittersEl.appendChild(critter);
});

// Finally: show the coins and open the home screen.
updateCoinDisplay();
showScreen("home");
