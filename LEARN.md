# How Sum Garden works

This is your guide to the code. Read it with `game.js` open next to it.

## Running it

1. Open the `sum-garden` folder in VS Code (File → Open Folder).
2. In Finder, double-click `index.html`. It opens in your browser.
3. Change something in a file, save (Cmd+S), then refresh the browser (Cmd+R).

That loop of change, save, refresh is how you'll do everything below.

If something breaks, open the browser console: in Chrome press Cmd+Option+J. Errors show in red with the file and line number. Paste the red text to Claude if you're stuck.

## The three files

- `index.html` is **what's on the page**: the screens, buttons and text boxes.
- `style.css` is **how it looks**: colours, fonts, sizes, animations.
- `game.js` is **how it behaves**: questions, timer, coins, shop, garden.
- `plants.js` is the data for biomes, plants and wildlife, and `logbook.js` is the botany log screen.
- `puzzles.js` is the three extra games, and `words.js` is their word list.

The HTML gives things an `id` (like `id="score"`). The JavaScript finds them by that id and changes them. The CSS styles things by their `class` (like `class="btn"`).

## The big ideas in game.js

The file is in 13 numbered parts. These are the ideas that matter most.

### Screens (part 6)

All six screens are in the page the whole time. Five are hidden, one is shown. `showScreen("shop")` hides them all, then un-hides the shop. Hiding is done by adding the CSS class `hidden`, which is just `display: none`.

### State (parts 2 and 7)

"State" means the things the game has to remember. There are two bundles of it:

- `round` is the state of one 60-second game: score, streak, time left, the current question. It's thrown away when the round ends.
- `save` is the long-term state: coins, your bag, the garden, score history, bests and settings.

A good habit to notice: the code changes the state first, then calls a `render` or `update` function to redraw the screen from it. The screen is always just a picture of the state.

### The timer (part 7)

`setInterval(tick, 1000)` tells the browser "run `tick` every 1000 milliseconds". `tick` takes one second off, redraws the display, and calls `endRound()` when time hits zero. `clearInterval` stops it.

### Questions and scoring (parts 5 and 7)

`makeQuestion()` returns an object like `{ text: "37 + 58", answer: 95 }`. Subtraction and division are built backwards from addition and multiplication, which guarantees no negatives and no decimals.

In typed mode, every key press runs a check: does what's in the box equal the answer? If yes, `handleCorrect()` runs straight away. That's why you never press Enter.

`handleCorrect()` adds a point, adds coins, and asks for the next question.

### Saving (part 2)

`localStorage` is a small notebook your browser keeps for each website. It only stores text, so:

- saving: `JSON.stringify(save)` turns the save object into text
- loading: `JSON.parse(text)` turns it back

Both are wrapped in `try { } catch { }` so that if storage is unavailable the game carries on instead of crashing.

The save lives in your browser on your computer. A different browser or device has its own separate save.

### Sprites (part 8)

Each shop item's picture is 8 rows of 8 letters. Each letter is a colour from `PALETTE`, and a dot is see-through. `makeSpriteImage` paints those 64 pixels onto a tiny canvas and turns it into an image.

### Luck: sprouts and bonus coins (parts 1, 7 and 13)

A planted sprout grows after 3 rounds into a random plant from the biome it's in. `sproutTable` gives each plant a `weight`, and `pickWeighted` works like a raffle where the weight is the number of tickets. Rare plants have `shop: false`, so a sprout is the only way to get them.

Bonus coins use `Math.random() < BONUS_COIN_CHANCE`: each second outside a round there's a 4% chance one appears. Both are the same ideas you'll meet in probability questions.

Try: change the weights in `sproutTable` so rare plants are common, or work out how long you'd expect to wait for a bonus coin.

### Garden visitors (parts 1 and 10)

`ITEM_TYPES` says what kind of thing each item is, and `VISITORS` lists each creature with what attracts it. `currentVisitors()` counts how many different kinds of each type are planted and returns the creatures whose rule is met.

Try: add your own visitor. Draw it in `EXTRA_SPRITES`, then add one line to `VISITORS`.

### Biomes, plants and the botany log (plants.js, logbook.js)

`plants.js` is pure data: five biomes, about 85 plants, and the wildlife. Plants share 18 pixel `SHAPES`, and each plant recolours a shape with its own `colours`, which is why adding one takes a single `P(...)` line.

Each biome has its own garden in `save.gardens`. `save.garden` always points at the one on screen. A biome opens when you've logged 10 species in the one before it.

`logbook.js` draws the log from `save.log` (plants) and `save.seen` (wildlife).

Try: add a plant of your own to a biome with one `P(...)` line. It will appear in the shop, the sprout raffle and the log without any other changes.

### Big pieces and joining tiles (parts 1, 8 and 10)

A big item has `size: 2`. Its first plot holds the item id and the other three hold a marker like `"@12"`, meaning "covered by the item at plot 12".

Streams, paths and fences have `connect` instead of a picture. `neighbourMask` checks the four sides and packs the answers into one number (up 1, right 2, down 4, left 8), and `makeConnectedRows` draws the matching shape.

### Day and night (part 13, and style.css part 17)

A counter ticks once a second and wraps round with `%`. For the last 2 minutes of every 6 it adds the class `night` to the page, and the CSS fades everything.

### The extra games (puzzles.js)

- **Word Sprout** scores a guess in two passes so repeated letters work properly.
- **Letter Patch** uses `canMake`, which crosses letters off a copy of the list.
- **Number Plot** has a small parser that understands brackets and priority, and a solver that tries every combination. These two are the hardest code in the project, so read them last.

`words.js` is only a word list (about 157,000 words) used to check guesses.

### Fractions (part 5)

On Hard, about 1 question in 4 is a fraction: "3/4 of 48", "1/2 + 1/3" or "3/8 as a decimal". `gcd` simplifies fractions, and `parseTyped` turns typed text like `3/4` into a number so it can be compared.

## Five exercises, easy to harder

Do them in order. Each one teaches something you need for the next.

### 1. Change the round length (2 minutes)

In `game.js` part 1, change `ROUND_SECONDS` from 60 to 30. Save, refresh, play.

Then notice: the home screen still says "60 seconds". Find that text in `index.html` and fix it.

*You learn: constants, and that the same fact can live in more than one file.*

### 2. Make it yours with colour (10 minutes)

In `style.css` part 1, change `--pink` and `--sky-top` to colours you like. Search "colour picker" in Google to get codes like `#ff8fb8`.

Then make the title bob faster: find `.title` and change `1.6s`.

*You learn: CSS variables, and how one change flows through the whole page.*

### 3. Add your own shop item (20 minutes)

In `game.js` part 1, copy one whole item in `ITEMS` (from `{` to `]},`) and paste it below the frog. Give it a new `id`, `name` and `price`, then redraw the `sprite` with letters from `PALETTE`. A snail? A watering can? A fungus?

If the page goes blank, you've probably lost a comma, quote or bracket. Check the console.

*You learn: arrays and objects, and reading error messages.*

### 4. Add squares as a fifth question type (30 minutes)

In `makeQuestion()`, add `"sq"` to the list of operations. Then add an `if` for it that picks a number from 2 to 25 and returns a question like `{ text: "17²", answer: 289 }`.

Squares up to 25 are worth knowing by heart for trading interviews.

*You learn: if statements, and how to extend a function without breaking it.*

### 5. Show accuracy on the results screen (45 minutes)

Right now a round only counts correct answers. Track wrong ones too, and show "Accuracy: 87%" at the end.

Steps:

1. Add `wrong: 0` to the `round` object, and reset it in `startRound()`.
2. Add one to it in `handleWrong()`.
3. In `index.html`, add a new `<p>` with a new id on the results screen.
4. In `game.js` part 3, find it with `getElementById`.
5. In `endRound()`, work out `correct / (correct + wrong) * 100`, round it with `Math.round`, and put it in the new element. Careful: what if both are zero?

Note this only makes sense in multiple choice mode. In typed mode, could you count something else, like the number of times the box was cleared?

*You learn: adding a feature across all three layers: state, logic and page.*

## Where to go next

- Put it online for free with GitHub Pages, so you can play on your phone and send friends the link.
- Add a probability and expected value mode (a new set of question makers, mostly multiple choice).
- Add a daily challenge: the same questions for everyone on the same day.
