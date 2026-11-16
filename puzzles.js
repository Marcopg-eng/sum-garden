// =====================================================
// SUM GARDEN — the three extra games
//
//   A. Shared helpers
//   B. Word Sprout   (guess a 5-letter word in 6 tries)
//   C. Letter Patch  (longest word from 9 letters, 30 seconds)
//   D. Number Plot   (reach a target with 6 numbers, 60 seconds)
//
// This file loads after game.js, so it can use things from there:
// save, writeSave, showScreen, pickRandom, randomInt, shuffle...
// The word list (WORD_LIST) comes from words.js.
// =====================================================


// =====================================================
// A. SHARED HELPERS
// =====================================================

// A Set answers "is this word in the list?" instantly, even with 150,000 words.
const WORD_SET = new Set(WORD_LIST);

// Pay out coins at the end of a puzzle. Puzzles count as rounds for sprouts too.
function finishPuzzle(coins) {
  save.coins = save.coins + coins;
  save.roundsPlayed = (save.roundsPlayed || 0) + 1;
  growSprouts();
  writeSave();
  updateCoinDisplay();
}

function screenIsOpen(name) {
  return !document.getElementById("screen-" + name).classList.contains("hidden");
}


// =====================================================
// B. WORD SPROUT
// Green = right letter, right place. Yellow = right letter, wrong place.
// =====================================================

// The possible answers: everyday words, many from the garden.
const WG_ANSWERS = ("apple beach bloom berry brook bench birds bread brick brush cabin candy chalk charm " +
  "cloud clove coral crane cream creek daisy dance dream earth fairy feast fence ferns field flame flock " +
  "flora flour frost fruit glade glass grape grass green grove heart hedge honey house jelly juice lemon " +
  "light lilac lunch maple marsh melon misty moist money month mossy mouse music night ocean olive onion " +
  "orbit paint peach pearl petal piano plant plums poppy pride quiet quilt rainy river robin roots roses " +
  "seeds shade sheep shell shine skies sleep smile snail soils spade spice spore stalk stars stems stone " +
  "storm sugar sunny swans sweet thorn tiger toast trail trees tulip vines water wheat world worms").split(" ");

const wg = { answer: "", guesses: [], current: "", done: false };

const wgBoardEl = document.getElementById("wg-board");
const wgMessageEl = document.getElementById("wg-message");
const wgKeyboardEl = document.getElementById("wg-keyboard");

function startWordGuess() {
  wg.answer = pickRandom(WG_ANSWERS);
  wg.guesses = [];
  wg.current = "";
  wg.done = false;
  wgMessageEl.textContent = "Guess the 5-letter word. You get 6 tries.";
  showScreen("wordguess");
  renderWordGuess();
}

// Work out the colour of each letter in a guess.
// Two passes, so repeated letters are handled properly:
//   1. mark the greens, and count the answer's letters that are left over
//   2. a letter is yellow only if one of those leftovers matches it
function scoreGuess(guess, answer) {
  const result = ["grey", "grey", "grey", "grey", "grey"];
  const leftover = {};
  for (let i = 0; i < 5; i++) {
    if (guess[i] === answer[i]) {
      result[i] = "green";
    } else {
      leftover[answer[i]] = (leftover[answer[i]] || 0) + 1;
    }
  }
  for (let i = 0; i < 5; i++) {
    if (result[i] !== "green" && leftover[guess[i]] > 0) {
      result[i] = "yellow";
      leftover[guess[i]] = leftover[guess[i]] - 1;
    }
  }
  return result;
}

function renderWordGuess() {
  // --- The board: 6 rows of 5 tiles ---
  wgBoardEl.innerHTML = "";
  const keyColours = {};   // the best colour found so far for each letter

  for (let row = 0; row < 6; row++) {
    const submitted = row < wg.guesses.length;
    // A finished guess, or the one being typed, or an empty row
    const word = submitted ? wg.guesses[row] : (row === wg.guesses.length ? wg.current : "");
    const colours = submitted ? scoreGuess(word, wg.answer) : null;

    for (let i = 0; i < 5; i++) {
      const tile = document.createElement("div");
      tile.className = "wg-tile";
      tile.textContent = word[i] || "";
      if (colours) {
        tile.classList.add(colours[i]);
        // Green beats yellow beats grey on the keyboard
        const old = keyColours[word[i]];
        if (colours[i] === "green" || (colours[i] === "yellow" && old !== "green") || !old) {
          keyColours[word[i]] = colours[i];
        }
      }
      wgBoardEl.appendChild(tile);
    }
  }

  // --- The on-screen keyboard ---
  wgKeyboardEl.innerHTML = "";
  ["qwertyuiop", "asdfghjkl", ">zxcvbnm<"].forEach(function (letters) {
    const rowEl = document.createElement("div");
    rowEl.className = "wg-key-row";
    letters.split("").forEach(function (letter) {
      const key = document.createElement("button");
      key.className = "wg-key";
      if (letter === ">") {
        key.textContent = "enter";
        key.classList.add("wide");
      } else if (letter === "<") {
        key.textContent = "del";
        key.classList.add("wide");
      } else {
        key.textContent = letter;
        if (keyColours[letter]) key.classList.add(keyColours[letter]);
      }
      key.addEventListener("click", function () {
        pressWordKey(letter === ">" ? "enter" : letter === "<" ? "back" : letter);
      });
      rowEl.appendChild(key);
    });
    wgKeyboardEl.appendChild(rowEl);
  });
}

function pressWordKey(key) {
  if (wg.done) return;
  if (key === "enter") {
    submitWordGuess();
  } else if (key === "back") {
    wg.current = wg.current.slice(0, -1);   // drop the last letter
  } else if (wg.current.length < 5) {
    wg.current = wg.current + key;
  }
  renderWordGuess();
}

function submitWordGuess() {
  if (wg.current.length < 5) {
    wgMessageEl.textContent = "Not enough letters.";
    return;
  }
  if (!WORD_SET.has(wg.current)) {
    wgMessageEl.textContent = "That's not in the word list.";
    return;
  }

  wg.guesses.push(wg.current);
  const won = wg.current === wg.answer;
  wg.current = "";

  if (won) {
    wg.done = true;
    const coins = 70 - 10 * wg.guesses.length;   // 60 for 1 try, down to 10 for 6
    finishPuzzle(coins);
    wgMessageEl.textContent = "Got it in " + wg.guesses.length + "! +" + coins + " coins.";
  } else if (wg.guesses.length === 6) {
    wg.done = true;
    finishPuzzle(0);
    wgMessageEl.textContent = "The word was " + wg.answer.toUpperCase() + ".";
  } else {
    wgMessageEl.textContent = (6 - wg.guesses.length) + " tries left.";
  }
}

// A real keyboard works too
document.addEventListener("keydown", function (event) {
  if (!screenIsOpen("wordguess")) return;
  if (event.key === "Enter") pressWordKey("enter");
  else if (event.key === "Backspace") pressWordKey("back");
  else if (/^[a-zA-Z]$/.test(event.key)) pressWordKey(event.key.toLowerCase());
});

document.getElementById("wordguess-btn").addEventListener("click", startWordGuess);
document.getElementById("wg-new-btn").addEventListener("click", startWordGuess);


// =====================================================
// C. LETTER PATCH
// Nine letters. Make the longest word you can before time runs out.
// You can enter as many words as you like: your longest one counts.
// =====================================================

const LETTERS_SECONDS = 30;
// Letters appear as often as they do in real English, so E is common and Q is rare.
const VOWELS = "aaaaaaaaaeeeeeeeeeeeeiiiiiiiiioooooooouuuu";
const CONSONANTS = "bbccddddffggghhjklllllmmnnnnnnppqrrrrrrssssttttttvvwwxyyz";

const lt = { letters: [], best: "", timeLeft: 0, timerId: null, running: false };

const ltLettersEl = document.getElementById("lt-letters");
const ltTimeEl = document.getElementById("lt-time");
const ltInput = document.getElementById("lt-input");
const ltMessageEl = document.getElementById("lt-message");
const ltBestEl = document.getElementById("lt-best");

function startLetters() {
  // 3 to 5 vowels, the rest consonants, then mixed up
  const vowelCount = randomInt(3, 5);
  lt.letters = [];
  for (let i = 0; i < 9; i++) {
    lt.letters.push(pickRandom((i < vowelCount ? VOWELS : CONSONANTS).split("")));
  }
  shuffle(lt.letters);

  lt.best = "";
  lt.timeLeft = LETTERS_SECONDS;
  lt.running = true;

  ltLettersEl.innerHTML = "";
  lt.letters.forEach(function (letter) {
    const tile = document.createElement("div");
    tile.className = "letter-tile";
    tile.textContent = letter;
    ltLettersEl.appendChild(tile);
  });

  ltTimeEl.textContent = lt.timeLeft;
  ltMessageEl.textContent = "Type a word and press Enter.";
  ltBestEl.textContent = "Best so far: none";
  ltInput.value = "";
  ltInput.disabled = false;
  showScreen("letters");
  ltInput.focus();

  clearInterval(lt.timerId);
  lt.timerId = setInterval(function () {
    if (!screenIsOpen("letters")) {   // you wandered off: stop quietly
      clearInterval(lt.timerId);
      lt.running = false;
      return;
    }
    lt.timeLeft = lt.timeLeft - 1;
    ltTimeEl.textContent = lt.timeLeft;
    if (lt.timeLeft <= 0) endLetters();
  }, 1000);
}

// Can this word be spelled with these letters, using each tile once?
// We cross tiles off a copy of the list as we use them.
function canMake(word, letters) {
  const available = letters.slice();   // slice() makes a copy
  for (let i = 0; i < word.length; i++) {
    const position = available.indexOf(word[i]);
    if (position === -1) return false;   // that letter isn't left
    available.splice(position, 1);       // cross it off
  }
  return true;
}

function tryLettersWord() {
  if (!lt.running) return;
  const word = ltInput.value.trim().toLowerCase();
  ltInput.value = "";

  if (word.length < 3) {
    ltMessageEl.textContent = "Words need at least 3 letters.";
  } else if (!canMake(word, lt.letters)) {
    ltMessageEl.textContent = "You can't make " + word.toUpperCase() + " from those letters.";
  } else if (!WORD_SET.has(word)) {
    ltMessageEl.textContent = word.toUpperCase() + " isn't in the word list.";
  } else if (word.length > lt.best.length) {
    lt.best = word;
    ltMessageEl.textContent = "Nice: " + word.length + " letters. Can you beat it?";
    ltBestEl.textContent = "Best so far: " + word.toUpperCase() + " (" + word.length + ")";
  } else {
    ltMessageEl.textContent = "Valid, but no longer than your best.";
  }
}

function endLetters() {
  clearInterval(lt.timerId);
  lt.running = false;
  ltInput.disabled = true;

  // Coins grow fast with length: 4 letters = 16, 7 letters = 49, 9 letters = 81
  const coins = lt.best.length * lt.best.length;
  finishPuzzle(coins);

  // What was the longest word possible? Check every word in the list.
  let longest = 0;
  WORD_LIST.forEach(function (word) {
    if (word.length > longest && canMake(word, lt.letters)) longest = word.length;
  });

  ltMessageEl.textContent = "Time's up! +" + coins + " coins. The longest possible word had " +
    longest + " letters.";
}

ltInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") tryLettersWord();
});
document.getElementById("lt-enter-btn").addEventListener("click", function () {
  tryLettersWord();
  if (lt.running) ltInput.focus();
});
document.getElementById("letters-btn").addEventListener("click", startLetters);
document.getElementById("lt-new-btn").addEventListener("click", startLetters);


// =====================================================
// D. NUMBER PLOT
// Six numbers and a target. Write a sum that gets as close as you can,
// e.g. (100 + 6) x 7 - 3. Each number can be used once.
// =====================================================

const NUMBERS_SECONDS = 60;

const nm = { numbers: [], target: 0, timeLeft: 0, timerId: null, running: false };

const nmTargetEl = document.getElementById("nm-target");
const nmTimeEl = document.getElementById("nm-time");
const nmPadEl = document.getElementById("nm-pad");
const nmInput = document.getElementById("nm-input");
const nmFeedbackEl = document.getElementById("nm-feedback");
const nmMessageEl = document.getElementById("nm-message");
const nmLockBtn = document.getElementById("nm-lock-btn");

function startNumbers() {
  // One or two big numbers, the rest small (two of each of 1 to 10 in the pot)
  const big = shuffle([25, 50, 75, 100]).slice(0, randomInt(1, 2));
  const smallPot = shuffle([1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10]);
  nm.numbers = big.concat(smallPot.slice(0, 6 - big.length));
  nm.target = randomInt(101, 999);
  nm.timeLeft = NUMBERS_SECONDS;
  nm.running = true;

  nmTargetEl.textContent = nm.target;
  nmTimeEl.textContent = nm.timeLeft;
  nmInput.value = "";
  nmInput.disabled = false;
  nmLockBtn.disabled = false;
  nmFeedbackEl.textContent = "";
  nmMessageEl.textContent = "Tap or type. Use each number once at most.";

  // The buttons: six numbers, then the operators
  nmPadEl.innerHTML = "";
  nm.numbers.map(String).concat(["+", "−", "×", "÷", "(", ")", "del", "clear"]).forEach(function (label, i) {
    const button = document.createElement("button");
    button.className = "pad-btn";
    if (i < 6) button.classList.add("number");
    button.textContent = label;
    button.addEventListener("click", function () {
      if (!nm.running) return;
      if (label === "clear") nmInput.value = "";
      else if (label === "del") nmInput.value = nmInput.value.trim().replace(/(\d+|\S)$/, "").trim();
      else nmInput.value = (nmInput.value + " " + label).trim();
      updateNumbersFeedback();
    });
    nmPadEl.appendChild(button);
  });

  showScreen("numbers");

  clearInterval(nm.timerId);
  nm.timerId = setInterval(function () {
    if (!screenIsOpen("numbers")) {
      clearInterval(nm.timerId);
      nm.running = false;
      return;
    }
    nm.timeLeft = nm.timeLeft - 1;
    nmTimeEl.textContent = nm.timeLeft;
    if (nm.timeLeft <= 0) endNumbers();
  }, 1000);
}

// Work out a typed sum like "(100 + 6) x 7".
// Returns { value: 742 } if it's fine, or { error: "why not" } if it isn't.
//
// How it works: first chop the text into "tokens" (numbers and symbols).
// Then three small functions call each other, one per level of priority:
//   readSum      handles + and −          (lowest priority)
//   readProduct  handles × and ÷
//   readPiece    handles a number or a bracket (highest priority)
// This is called a "recursive descent parser". It is how calculators
// know to do multiplication before addition.
function evaluateSum(text, allowedNumbers) {
  const tidy = text.replace(/×|x/g, "*").replace(/÷/g, "/").replace(/−/g, "-").replace(/\s/g, "");
  if (tidy === "") return { error: "" };
  if (/[^0-9+\-*/()]/.test(tidy)) return { error: "Only numbers and + − × ÷ ( )" };

  const tokens = tidy.match(/\d+|[-+*/()]/g);
  let position = 0;
  const used = [];

  function readPiece() {
    const token = tokens[position];
    if (token === "(") {
      position = position + 1;
      const inside = readSum();
      if (tokens[position] !== ")") throw "Missing a closing bracket";
      position = position + 1;
      return inside;
    }
    if (/^\d+$/.test(token)) {
      position = position + 1;
      used.push(Number(token));
      return Number(token);
    }
    throw "Not finished yet";
  }

  function readProduct() {
    let value = readPiece();
    while (tokens[position] === "*" || tokens[position] === "/") {
      const operator = tokens[position];
      position = position + 1;
      const next = readPiece();
      if (operator === "*") {
        value = value * next;
      } else {
        if (next === 0 || value % next !== 0) throw "Division must come out whole";
        value = value / next;
      }
    }
    return value;
  }

  function readSum() {
    let value = readProduct();
    while (tokens[position] === "+" || tokens[position] === "-") {
      const operator = tokens[position];
      position = position + 1;
      const next = readProduct();
      value = operator === "+" ? value + next : value - next;
    }
    return value;
  }

  try {
    const value = readSum();
    if (position < tokens.length) throw "Not finished yet";
    // Check every number used is one of ours, and not used too many times
    const pot = allowedNumbers.slice();
    for (let i = 0; i < used.length; i++) {
      const spot = pot.indexOf(used[i]);
      if (spot === -1) throw "You don't have " + used[i] + " (or used it twice)";
      pot.splice(spot, 1);
    }
    return { value: value };
  } catch (problem) {
    return { error: problem };
  }
}

function updateNumbersFeedback() {
  const result = evaluateSum(nmInput.value, nm.numbers);
  if (result.error !== undefined) {
    nmFeedbackEl.textContent = result.error;
  } else {
    const away = Math.abs(result.value - nm.target);
    nmFeedbackEl.textContent = "= " + result.value + (away === 0 ? "  spot on!" : "  (" + away + " away)");
  }
}

// Find the best answer by trying every way of combining the numbers.
// Take any two, combine them with + − × ÷, put the result back, repeat.
function solveNumbers(numbers, target) {
  let best = { away: Infinity, text: "" };

  function search(pieces) {   // pieces look like { value: 106, text: "(100 + 6)" }
    for (let i = 0; i < pieces.length; i++) {
      const away = Math.abs(pieces[i].value - target);
      if (away < best.away) best = { away: away, text: pieces[i].text };
    }
    if (best.away === 0) return;

    for (let i = 0; i < pieces.length; i++) {
      for (let j = i + 1; j < pieces.length; j++) {
        // Put the bigger one first so subtraction and division stay positive
        const a = pieces[i].value >= pieces[j].value ? pieces[i] : pieces[j];
        const b = pieces[i].value >= pieces[j].value ? pieces[j] : pieces[i];
        const rest = pieces.filter(function (piece, k) { return k !== i && k !== j; });

        const combos = [{ value: a.value + b.value, text: "(" + a.text + " + " + b.text + ")" }];
        if (b.value > 1) combos.push({ value: a.value * b.value, text: "(" + a.text + " × " + b.text + ")" });
        if (a.value > b.value) combos.push({ value: a.value - b.value, text: "(" + a.text + " − " + b.text + ")" });
        if (b.value > 1 && a.value % b.value === 0) combos.push({ value: a.value / b.value, text: "(" + a.text + " ÷ " + b.text + ")" });

        for (let c = 0; c < combos.length; c++) {
          search(rest.concat([combos[c]]));
          if (best.away === 0) return;
        }
      }
    }
  }

  search(numbers.map(function (n) { return { value: n, text: String(n) }; }));
  return best;
}

function endNumbers() {
  clearInterval(nm.timerId);
  nm.running = false;
  nmInput.disabled = true;
  nmLockBtn.disabled = true;

  const result = evaluateSum(nmInput.value, nm.numbers);
  let coins = 0;
  let line = "No valid sum entered.";
  if (result.value !== undefined) {
    const away = Math.abs(result.value - nm.target);
    if (away === 0) coins = 80;
    else if (away <= 5) coins = 40;
    else if (away <= 10) coins = 20;
    line = away === 0 ? "Spot on!" : "You were " + away + " away.";
  }
  finishPuzzle(coins);

  const best = solveNumbers(nm.numbers, nm.target);
  const bestText = best.text.replace(/^\((.*)\)$/, "$1");   // drop the outer brackets
  nmMessageEl.textContent = line + " +" + coins + " coins. " +
    (best.away === 0 ? "One way: " : "Closest possible (" + best.away + " away): ") + bestText;
}

nmInput.addEventListener("input", updateNumbersFeedback);
nmLockBtn.addEventListener("click", function () {
  if (nm.running) endNumbers();
});
document.getElementById("numbers-btn").addEventListener("click", startNumbers);
document.getElementById("nm-new-btn").addEventListener("click", startNumbers);
