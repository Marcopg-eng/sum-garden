// =====================================================
// SUM GARDEN — the botany log
//
// A record of every species you've planted and every creature you've
// attracted. It reads two things from the save:
//   save.log   plants you've planted at least once, e.g. { daisy: true }
//   save.seen  creatures and homes you've seen,     e.g. { bee: true }
// =====================================================

const logEl = document.getElementById("log-content");
let openLogId = null;   // the entry whose details are showing

function renderLog() {
  logEl.innerHTML = "";

  // --- Plants, one section per biome ---
  BIOMES.forEach(function (biome, i) {
    const species = ITEMS.filter(function (item) {
      return item.biome === biome.id && item.latin;
    });

    const heading = document.createElement("p");
    heading.className = "label";
    logEl.appendChild(heading);

    if (!biomeUnlocked(i)) {
      const before = BIOMES[i - 1];
      heading.textContent = biome.name + " · locked";
      addLogNote("Log " + before.need + " species in the " + before.name + " to open it.");
      return;
    }
    heading.textContent = biome.name + " · " + speciesLogged(biome.id) + " of " + species.length;

    const grid = document.createElement("div");
    grid.className = "log-grid";
    species.forEach(function (item) {
      const found = save.log[item.id] === true;
      const card = makeLogCard(item.id, found, item.rare);
      grid.appendChild(card);
    });
    logEl.appendChild(grid);

    // The details panel sits under the biome its plant belongs to
    const open = species.find(function (item) { return item.id === openLogId; });
    if (open) {
      const found = save.log[open.id] === true;
      addLogDetails(
        found ? open.name : "Not found yet",
        found ? open.latin : "",
        found ? open.fact : (open.rare
          ? "A rare plant. It is not sold: it can only grow from a sprout planted in the " + biome.name + "."
          : "Buy it in the shop while you're in the " + biome.name + ", then plant it."),
        open.rare
      );
    }
  });

  // --- Wildlife ---
  const wildHeading = document.createElement("p");
  wildHeading.className = "label";
  const creatures = VISITORS.concat(HOMES);
  const seenCount = creatures.filter(function (c) { return save.seen[c.id]; }).length;
  wildHeading.textContent = "Wildlife · " + seenCount + " of " + creatures.length;
  logEl.appendChild(wildHeading);

  const grid = document.createElement("div");
  grid.className = "log-grid";
  creatures.forEach(function (creature) {
    grid.appendChild(makeLogCard(creature.id, save.seen[creature.id] === true, false));
  });
  logEl.appendChild(grid);

  const open = creatures.find(function (c) { return c.id === openLogId; });
  if (open) {
    const found = save.seen[open.id] === true;
    addLogDetails(found ? open.name : "Not seen yet", "",
      found ? (open.fact || WILDLIFE_FACTS[open.id]) : "Hint: " + wildlifeHint(open), false);
  }
}

// One square in the grid: the picture if you've found it, a "?" if not
function makeLogCard(id, found, rare) {
  const card = document.createElement("button");
  card.className = "log-card";
  if (id === openLogId) card.classList.add("selected");
  if (rare) card.classList.add("rare");
  if (found) {
    card.appendChild(makeSpriteElement({ id: id }));
  } else {
    card.textContent = "?";
  }
  card.addEventListener("click", function () {
    openLogId = (openLogId === id) ? null : id;   // tap again to close
    renderLog();
  });
  return card;
}

function addLogNote(text) {
  const note = document.createElement("p");
  note.className = "small";
  note.textContent = text;
  logEl.appendChild(note);
}

function addLogDetails(name, latin, fact, rare) {
  const panel = document.createElement("div");
  panel.className = "panel log-details";

  const nameEl = document.createElement("p");
  nameEl.className = "shop-name";
  nameEl.textContent = name + (rare ? "  (rare)" : "");
  panel.appendChild(nameEl);

  if (latin) {
    const latinEl = document.createElement("p");
    latinEl.className = "small latin";
    latinEl.textContent = latin;
    panel.appendChild(latinEl);
  }

  const factEl = document.createElement("p");
  factEl.className = "small";
  factEl.textContent = fact;
  panel.appendChild(factEl);

  logEl.appendChild(panel);
}

// Turn a visitor's rule into a hint, e.g. "Plant 3 different flowers in the Meadow."
function wildlifeHint(creature) {
  if (creature.hint) return creature.hint;   // homes come with their own hint
  const words = { flower: "flowers", mushroom: "mushrooms", leafy: "leafy plants",
                  tree: "trees", water: "water features", any: "things" };
  let hint = creature.kinds === 1
    ? "Plant or place any of the " + words[creature.type]
    : "Plant or place " + creature.kinds + " different " + words[creature.type];
  if (creature.biome) {
    const biome = BIOMES.find(function (b) { return b.id === creature.biome; });
    hint = hint + " in the " + biome.name;
  }
  return hint + ".";
}
