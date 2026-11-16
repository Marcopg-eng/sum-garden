// =====================================================
// SUM GARDEN — the plant and wildlife data
//
// This file is all data, no behaviour. It loads first, and game.js
// reads from it. To add a plant, add one P(...) line to a biome below.
//
//   A. Biomes
//   B. Shapes (pixel pictures that get recoloured)
//   C. New plants, biome by biome
//   D. Facts for the plants defined in game.js
//   E. Wildlife: extra sprites, biome visitors, facts, homes
// =====================================================


// =====================================================
// A. BIOMES
// A biome is a kind of habitat. Each one is its own garden.
// "ground" is the lawn colour. "need" is how many of its species you
// must log to open the next biome.
// =====================================================

const BIOMES = [
  { id: "meadow",     name: "Meadow",     ground: "#7ed37a", need: 10 },
  { id: "woodland",   name: "Woodland",   ground: "#5aa864", need: 10 },
  { id: "wetland",    name: "Wetland",    ground: "#6cc4a0", need: 10 },
  { id: "desert",     name: "Desert",     ground: "#e2c88a", need: 10 },
  { id: "rainforest", name: "Rainforest", ground: "#3f9a5c", need: 10 },
];


// =====================================================
// B. SHAPES
// Drawing 80 plants one by one would take forever. Instead there are
// about 60 shapes, and each plant picks a shape and its own colours.
// No two plants in the same biome share a shape.
// In a shape, the digits 1, 2 and 3 are "colour slots". A plant with
// colours "rk" gets slot 1 = r (red) and slot 2 = k (black).
// Other letters (g, b, d) are fixed colours from PALETTE in game.js.
// =====================================================

const SHAPES = {
  flowerA:     ["...11...", "..1221..", "..1221..", "...11...", "....g...", "..g.g...", "...gg...", "....g..."],
  flowerB:     ["..1.1...", "..111...", "..121...", "...g....", "...g.g..", "...gg...", "...g....", "...g...."],
  spike:       ["...1....", "...12...", "..11....", "...12...", "..11g...", "...g..g.", "...g.g..", "...gg..."],
  bigflower:   ["..1111..", ".112211.", ".112211.", "..1111..", "...g....", "..gg.g..", "...ggg..", "...g...."],
  cluster:     ["........", "........", ".2...2..", "121.121.", ".1.2.1..", "1112111.", ".11111..", "........"],
  bush:        ["........", "..111...", ".113111.", "11211311", "13111121", "1112111d", ".d111dd.", "........"],
  tree:        ["..1111..", ".113111.", "11111131", "13111211", ".11111d.", "...bb...", "...bb...", "..bbbb.."],
  conifer:     ["...1....", "..111...", "..131...", ".11111..", ".13111..", "1111111.", "...b....", "...b...."],
  mushroom:    ["..1111..", ".121121.", "11112111", "12111111", "..3333..", "..3333..", "..3333..", "........"],
  shroomsmall: ["........", "........", ".111....", "12121.11", "..33.121", "..33..3.", "..33..3.", "........"],
  reed:        ["...2....", "...2..2.", "...2..2.", "...1..1.", "1..1.1..", ".1.1.1..", "..111...", "...1...."],
  grass:       ["..1...1.", "..1..1..", "1.1.1...", ".1.11.1.", ".1.1.1..", "..111...", "..111...", "...1...."],
  roundcactus: ["........", "...2....", "..1111..", ".131311.", ".131311.", ".131311.", "..1111..", "........"],
  rosette:     ["........", "1..1..1.", ".1.1.1..", "..131...", "1113111.", "..131...", ".1.1.1..", "........"],
  palm:        [".11..11.", "1111111.", "1.1b1.1.", "...b....", "...b....", "..b.....", "..b.....", ".bbb...."],
  lilypad:     ["........", "........", "..2.....", ".1111...", "111.11..", "111111..", ".1111...", "........"],
  leafybig:    ["..1..1..", ".11.11..", ".13.131.", "1131131.", ".11.11..", "..1.1...", "..1.1...", "..d.d..."],
  trap:        ["..1.1...", ".12121..", ".11111..", "..111...", "...g....", "..gg....", "...g.g..", "...gg..."],

  // --- More flowers ---
  flowerC:       [".11.11..", "1111111.", "1122211.", ".11111..", "...g....", "...g....", "..gg....", "...g...."],
  ragged:        [".1.1.1..", "..111...", "1.121.1.", "..111...", ".1.g.1..", "...g....", "..gg....", "...g...."],
  star:          ["........", "..1.1...", "...2....", "..1.1...", "....g...", "...g....", "..gg....", "...g...."],
  bells:         ["..ggg...", ".g..1g..", ".g.111..", ".g..1.1.", "..g..111", "..g...1.", "..g.....", "..g....."],
  orchidarch:    ["....g...", "...g.11.", "..g.121.", "..g..1..", ".g.11...", ".g121...", ".g.1....", ".g......"],
  iris:          ["...1....", "..111...", ".1.2.1..", "11.g.11.", "...g..g.", "g..g.g..", ".g.gg...", "..gg...."],
  umbel:         ["..2.2...", ".2.2.2..", "..2.2...", "...g....", "1..g..1.", "11.g.11.", ".11g11..", "..111..."],
  rosetteflower: ["........", "..1.1...", "...2....", "g.1.1.g.", "gg...gg.", ".ggggg..", "..ggg...", "........"],
  tallspike:     ["...1....", "..111...", "..111...", "..121...", "..111...", "...g....", "..gg.g..", "...gg..."],
  stamen:        [".111....", "11111...", "11211222", "11111...", ".111....", "..g.....", ".gg.....", "..g....."],
  zigzag:        ["...g....", "..11g...", "...g22..", "..11g...", "...g22..", "..11g...", "...g....", "...g...."],
  torch:         ["..111...", ".11211..", ".12121..", "..111...", "...g....", "...g....", "...g....", "...g...."],
  hanging:       ["gggggggg", "..g..g..", "..1..1..", ".11..11.", "..12..1.", ".11..12.", "..1...1.", "........"],
  groundflower:  ["........", "..1111..", ".112211.", "11222211", "11222211", ".112211.", "..1111..", "........"],
  cactusflower:  ["..222...", ".22322..", "..222...", "...1....", "..11....", "..1.1...", "..11....", "..1....."],
  caudex:        [".1...1..", "121.121.", ".1.b.1..", "..bbb...", "..bbb...", ".bbbbb..", ".bbbbb..", "........"],
  vinepod:       ["g.......", "g.11....", "g121....", "g.1.....", "gg......", "g.3.....", "g.3.....", "g.3....."],
  yuccashape:    ["...2....", "..222...", "...2....", "...2....", "1..2..1.", ".1.2.1..", "1.111.1.", ".11111.."],
  lily:          ["1..2..1.", ".1.2.1..", ".11211..", "..111...", "...g.g..", "..gg....", "...gg...", "...g...."],
  // --- More fungi ---
  bracket:       ["........", ".111....", "12121...", "bbbbbbbb", "bb.111.b", "bb12121b", "bbbbbbbb", "........"],
  tallcap:       ["...11...", "..1111..", "..1211..", "..1111..", "..1121..", "..2222..", "...33...", "...33..."],
  funnel:        ["11111111", ".111111.", "..1111..", "...33...", "...33...", "...33...", "..3333..", "........"],
  // --- More low plants ---
  berryplant:    ["........", ".11.11..", "1111111.", ".11111..", "..2.2...", ".22.22..", "..2.2...", "........"],
  mound:         ["........", "........", "........", "..1221..", ".122121.", "12111211", "11111111", "........"],
  floating:      ["........", ".11...1.", ".11..11.", "....1...", "1....11.", "11..1...", "...11...", "........"],
  pebbles:       ["........", "........", "........", ".11.11..", "1211211.", "1111111.", ".11.11..", "........"],
  tufts:         ["..2...2.", ".222.222", "..2...2.", "..1...1.", "..1..1..", ".1.1.1..", "..111...", "...1...."],
  arch:          [".1....1.", "1.1..1.1", "1..11..1", "1.2..2.1", "..1..1..", ".2.11.2.", "..1..1..", "........"],
  ball:          ["........", "..1.11..", ".1.1..1.", "1..11.1.", ".1.1.1.1", "1.1..11.", ".11.1...", "........"],
  twiggy:        ["1...1..1", ".1.1..1.", "..1.21..", ".1.1.1..", "..111...", "...1....", "...b....", "...b...."],
  pads:          ["....11..", "...1111.", "...1111.", ".11.11..", "1111.2..", "1111....", ".11.....", "........"],
  upright:       ["........", "1..1..1.", "1..1..1.", "11.1.11.", ".1.1.1..", ".11311..", "..111...", "........"],
  straps:        ["........", "........", "........", "11....11", ".11bb11.", "1.1bb1.1", "1......1", "........"],
  bananashape:   ["..1.....", "..11..1.", "..11.11.", "...1.1..", "...d1...", "...d.22.", "...d.22.", "...d...."],
  bigpad:        ["........", ".111111.", "13333331", "13323331", "13333331", ".111111.", "........", "........"],
  pitchershape:  ["...gggg.", "..g...g.", "..g.111.", "..g.121.", "..g.111.", "..g..1..", "..g.....", "..g....."],
  bambooshape:   [".1..1...", ".1..1.1.", "11.11.1.", ".1..1.11", ".3..3.1.", ".1..1.3.", ".1..1.1.", ".1..1.1."],
  // --- More trees ---
  birch:         ["..1111..", ".113111.", "11111131", ".111111.", "...wk...", "...ww...", "...kw...", "..wwww.."],
  weeping:       ["..1111..", ".111111.", "11311311", "1.11.1.1", "1.1b.1.1", "1..b...1", "...b....", "..bbb..."],
  podtree:       ["..1111..", ".111311.", "11111111", ".111111.", "..2bb...", "...bb2..", "..2bb...", "..bbbb.."],
  talltree:      [".111111.", "11311131", ".111111.", "...bb...", "...bb...", "...bb...", "..bbbb..", ".bbbbbb."],
  joshuashape:   ["1.1..1.1", ".1....1.", ".b.11.b.", "..b..b..", "..bbbb..", "...bb...", "...bb...", "..bbbb.."],
};


// =====================================================
// C. NEW PLANTS
// P() is a shortcut that builds one plant object, so each plant fits on a line:
//   P(id, name, latin name, price, type, shape, colours, fact)
// type is what visitors care about: "flower", "mushroom", "leafy" or "tree".
// R() is the same but for rare plants, which only grow from sprouts.
// =====================================================

function P(id, name, latin, price, type, shape, colours, fact) {
  return { id: id, name: name, latin: latin, price: price, type: type, shape: shape,
           colours: colours, fact: fact, sway: type !== "mushroom" };
}

function R(id, name, latin, type, shape, colours, fact) {
  const plant = P(id, name, latin, 0, type, shape, colours, fact);
  plant.rare = true;
  plant.shop = false;   // not for sale
  return plant;
}

const BIOME_PLANTS = {
  meadow: [
    P("clover", "White clover", "Trifolium repens", 35, "flower", "cluster", "lp", "Bacteria in clover roots take nitrogen from the air and turn it into plant food."),
    P("poppy", "Poppy", "Papaver rhoeas", 50, "flower", "flowerC", "rk", "Poppy seeds can lie asleep in the soil for decades and sprout when the ground is disturbed."),
    P("cornflower", "Cornflower", "Centaurea cyanus", 60, "flower", "ragged", "un", "Once a common weed of cornfields, it became rare in the wild as farming changed."),
    P("strawberry", "Wild strawberry", "Fragaria vesca", 85, "leafy", "berryplant", "gr", "The 'seeds' on the outside of a strawberry are the real fruits."),
    P("foxglove", "Foxglove", "Digitalis purpurea", 110, "flower", "bells", "m", "Foxgloves are poisonous, yet the heart medicine digoxin comes from this group of plants."),
    P("lily", "Madonna lily", "Lilium candidum", 150, "flower", "lily", "wo", "Grown for more than 3,000 years, it is one of the oldest garden flowers. Lily pollen is poisonous to cats."),
    P("hollyhock", "Hollyhock", "Alcea rosea", 140, "flower", "spike", "py", "Hollyhocks are in the mallow family, along with cotton and okra."),
    R("beeorchid", "Bee orchid", "Ophrys apifera", "flower", "orchidarch", "pb", "Its flower mimics a female bee to attract males, though in Britain it mostly pollinates itself."),
  ],
  woodland: [
    P("moss", "Cushion moss", "Leucobryum glaucum", 25, "leafy", "mound", "lg", "Mosses have no true roots and take in water straight through their leaves."),
    P("wildgarlic", "Wild garlic", "Allium ursinum", 40, "flower", "umbel", "gw", "Also called ramsons. Its Latin name means 'bear's garlic'."),
    P("primrose", "Primrose", "Primula vulgaris", 45, "flower", "rosetteflower", "yo", "One of the first woodland flowers of spring. Its name comes from the Latin for 'first rose'."),
    P("anemone", "Wood anemone", "Anemone nemorosa", 55, "flower", "star", "wy", "It spreads only about two metres in a century, so big patches are a sign of old woodland."),
    P("bluebell", "Bluebell", "Hyacinthoides non-scripta", 60, "flower", "bells", "n", "A carpet of bluebells is a sign of ancient woodland. Britain holds a large share of the world's bluebells."),
    P("turkeytail", "Turkey tail", "Trametes versicolor", 90, "mushroom", "bracket", "oi", "A bracket fungus that rots dead wood and returns its nutrients to the soil."),
    P("inkcap", "Shaggy ink cap", "Coprinus comatus", 100, "mushroom", "tallcap", "isw", "Its cap dissolves into black ink within hours to release its spores."),
    P("bramble", "Bramble", "Rubus fruticosus", 120, "leafy", "arch", "dv", "Its arching stems root where the tips touch the ground, so it 'walks' across a wood."),
    P("chanterelle", "Chanterelle", "Cantharellus cibarius", 130, "mushroom", "funnel", "oay", "It has ridges, not true gills, and lives in partnership with tree roots, so it is very hard to farm."),
    P("pennybun", "Penny bun", "Boletus edulis", 170, "mushroom", "mushroom", "bbi", "Also called porcini or cep. Under its cap are pores, not gills."),
    P("holly", "Holly", "Ilex aquifolium", 180, "leafy", "bush", "jrd", "Only female holly trees bear berries."),
    P("pine", "Scots pine", "Pinus sylvestris", 350, "tree", "conifer", "ddj", "The only pine native to Britain."),
    P("birch", "Silver birch", "Betula pendula", 400, "tree", "birch", "ggl", "A pioneer tree: among the first to colonise open ground."),
    R("ghostorchid", "Ghost orchid", "Epipogium aphyllum", "flower", "orchidarch", "ip", "It has no green leaves and takes all its food from fungi. One of Britain's rarest plants."),
  ],
  wetland: [
    P("duckweed", "Duckweed", "Lemna minor", 20, "leafy", "floating", "l", "One of the smallest flowering plants. It can double its area in a couple of days."),
    P("rush", "Soft rush", "Juncus effusus", 30, "leafy", "grass", "d", "Its pith was once dipped in fat to make rushlights, a cheap kind of candle."),
    P("forgetmenot", "Water forget-me-not", "Myosotis scorpioides", 40, "flower", "cluster", "gu", "Its flower buds open pink and then turn blue."),
    P("marigold", "Marsh marigold", "Caltha palustris", 45, "flower", "flowerA", "ya", "Thought to be one of Britain's most ancient native plants, here since the last Ice Age."),
    P("reedmace", "Bulrush", "Typha latifolia", 50, "leafy", "reed", "gb", "Each brown seed head can hold more than 200,000 fluffy seeds."),
    P("watermint", "Water mint", "Mentha aquatica", 60, "flower", "spike", "vh", "Crossing water mint with spearmint gave us peppermint."),
    P("cottongrass", "Cotton grass", "Eriophorum angustifolium", 65, "leafy", "tufts", "gw", "Not a grass but a sedge. Its fluffy heads carry the seeds on the wind."),
    P("sphagnum", "Sphagnum moss", "Sphagnum", 70, "leafy", "mound", "xl", "It holds up to 20 times its dry weight in water and slowly builds up into peat."),
    P("bogbean", "Bogbean", "Menyanthes trifoliata", 75, "flower", "ragged", "wp", "Named for leaves like a broad bean's. Its petals are fringed with white hairs."),
    P("flagiris", "Yellow flag iris", "Iris pseudacorus", 80, "flower", "iris", "yo", "Thought to be the model for the fleur-de-lis symbol."),
    P("loosestrife", "Purple loosestrife", "Lythrum salicaria", 90, "flower", "tallspike", "mh", "Loved by insects in Europe, but an invasive weed in North America."),
    P("waterlily", "White water lily", "Nymphaea alba", 120, "flower", "lilypad", "gw", "Its leaves float on air-filled tissue, and their breathing pores are on the top surface."),
    P("sundew", "Sundew", "Drosera rotundifolia", 200, "leafy", "trap", "rl", "A carnivorous plant: sticky droplets on its leaves trap and digest insects."),
    P("alder", "Alder", "Alnus glutinosa", 380, "tree", "tree", "dbg", "Alder wood lasts for centuries under water. Much of Venice stands on alder piles."),
    P("willow", "Crack willow", "Salix fragilis", 420, "tree", "weeping", "ggl", "Willow bark contains salicin, the compound that led to aspirin."),
    R("fenorchid", "Fen orchid", "Liparis loeselii", "flower", "flowerB", "ly", "A tiny yellow-green orchid found at only a handful of British fens and dunes."),
    R("bladderwort", "Bladderwort", "Utricularia vulgaris", "flower", "zigzag", "yo", "A carnivorous water plant. Its underwater bladders suck in tiny animals in a few thousandths of a second."),
  ],
  desert: [
    P("tumbleweed", "Tumbleweed", "Salsola tragus", 30, "leafy", "ball", "b", "The dead plant snaps off and rolls in the wind, scattering seeds as it goes."),
    P("desertmarigold", "Desert marigold", "Baileya multiradiata", 50, "flower", "flowerA", "yo", "It flowers quickly after rain, while the water lasts."),
    P("sagebrush", "Sagebrush", "Artemisia tridentata", 80, "leafy", "bush", "qqs", "It has shallow roots to catch rain and a deep taproot to reach groundwater."),
    P("aloe", "Aloe vera", "Aloe vera", 90, "leafy", "upright", "qql", "It opens its pores at night, not by day, to save water. This is called CAM photosynthesis."),
    P("creosote", "Creosote bush", "Larrea tridentata", 100, "leafy", "twiggy", "dy", "One ring of creosote clones in California is around 11,000 years old."),
    P("lithops", "Living stones", "Lithops", 110, "leafy", "pebbles", "sm", "They look like pebbles, which hides them from grazing animals."),
    P("yucca", "Soaptree yucca", "Yucca elata", 120, "flower", "yuccashape", "gw", "Its roots contain saponins and were used to make soap."),
    P("pricklypear", "Prickly pear", "Opuntia", 130, "leafy", "pads", "lm", "Its flat pads are stems, not leaves. The spines are its leaves."),
    P("agave", "Agave", "Agave americana", 140, "leafy", "rosette", "ttc", "It flowers once, after 10 to 30 years, and then dies."),
    P("barrel", "Barrel cactus", "Ferocactus", 150, "leafy", "roundcactus", "gyl", "Its ribs let it swell like an accordion when it rains."),
    P("desertrose", "Desert rose", "Adenium obesum", 160, "flower", "caudex", "pm", "It stores water in its swollen trunk."),
    P("ocotillo", "Ocotillo", "Fouquieria splendens", 170, "leafy", "reed", "gr", "It drops its leaves in drought and regrows them within days of rain."),
    P("joshua", "Joshua tree", "Yucca brevifolia", 450, "tree", "joshuashape", "d", "It relies on one kind of moth for pollination, and the moth relies on it."),
    P("datepalm", "Date palm", "Phoenix dactylifera", 500, "tree", "palm", "g", "People have grown date palms for more than 5,000 years."),
    R("queennight", "Queen of the night", "Peniocereus greggii", "flower", "cactusflower", "gwa", "Its flowers open for a single night each year."),
    R("welwitschia", "Welwitschia", "Welwitschia mirabilis", "leafy", "straps", "d", "It grows just two leaves in its whole life, which can last more than 1,000 years."),
  ],
  rainforest: [
    P("bamboo", "Bamboo", "Bambusoideae", 70, "leafy", "bambooshape", "lld", "A giant grass. Some kinds can grow nearly a metre in a day."),
    P("hibiscus", "Hibiscus", "Hibiscus rosa-sinensis", 90, "flower", "stamen", "ry", "Each flower lasts only a day or two."),
    P("passionflower", "Passion flower", "Passiflora", 110, "flower", "flowerA", "vw", "Some passion flowers grow fake butterfly eggs on their leaves to put off egg-laying butterflies."),
    P("bromeliad", "Bromeliad", "Bromeliaceae", 130, "leafy", "rosette", "rry", "Its leaves form a tank of rainwater where tree frogs raise their tadpoles."),
    P("heliconia", "Heliconia", "Heliconia rostrata", 140, "flower", "zigzag", "ry", "It is pollinated mainly by hummingbirds."),
    P("monstera", "Monstera", "Monstera deliciosa", 150, "leafy", "leafybig", "djl", "The holes in its leaves may let light through to the leaves below."),
    P("vanilla", "Vanilla orchid", "Vanilla planifolia", 160, "flower", "vinepod", "iyb", "The only orchid grown for food. Outside Mexico it has to be pollinated by hand."),
    P("orchid", "Moth orchid", "Phalaenopsis", 180, "flower", "orchidarch", "mw", "An epiphyte: it grows on tree branches, not in soil."),
    P("banana", "Banana plant", "Musa", 200, "leafy", "bananashape", "gy", "Not a tree: its 'trunk' is made of tightly rolled leaf bases."),
    P("torchginger", "Torch ginger", "Etlingera elatior", 220, "flower", "torch", "mp", "Its flower buds are used in cooking across Southeast Asia."),
    P("giantlily", "Giant water lily", "Victoria amazonica", 240, "flower", "bigpad", "dwg", "Its leaves can grow more than 2 metres across. The flowers open white, then turn pink on the second night."),
    P("pitcher", "Pitcher plant", "Nepenthes", 260, "leafy", "pitchershape", "xl", "Its leaves form pitchers of digestive fluid that trap insects."),
    P("treefern", "Tree fern", "Cyathea", 300, "tree", "palm", "j", "Its 'trunk' is a mass of roots around a slender stem."),
    P("rubber", "Rubber tree", "Hevea brasiliensis", 420, "tree", "tree", "ggl", "Its milky latex is the source of natural rubber."),
    P("cacao", "Cacao tree", "Theobroma cacao", 480, "tree", "podtree", "gol", "Chocolate comes from its seeds. The flowers grow straight from the trunk and are pollinated by tiny midges."),
    P("kapok", "Kapok tree", "Ceiba pentandra", 600, "tree", "talltree", "jjl", "An emergent tree that can tower 60 metres or more above the forest floor."),
    R("rafflesia", "Rafflesia", "Rafflesia arnoldii", "flower", "groundflower", "xo", "A parasite with no leaves, stems or roots, and the largest single flower on Earth. It smells of rotting meat."),
    R("jadevine", "Jade vine", "Strongylodon macrobotrys", "flower", "hanging", "tc", "Its turquoise flowers are pollinated by bats."),
  ],
};

// One flat list of every new plant, each labelled with its biome
const NEW_PLANTS = [];
BIOMES.forEach(function (biome) {
  BIOME_PLANTS[biome.id].forEach(function (plant) {
    plant.biome = biome.id;
    NEW_PLANTS.push(plant);
  });
});


// =====================================================
// D. FACTS FOR THE ORIGINAL PLANTS
// These plants are drawn by hand in game.js. This adds their biome,
// type, Latin name and fact. Some got a more accurate name too.
// =====================================================

const PLANT_INFO = {
  daisy:      { biome: "meadow", type: "flower", latin: "Bellis perennis", fact: "A daisy is not one flower but a head of many tiny ones packed together." },
  tulip:      { biome: "meadow", type: "flower", latin: "Tulipa gesneriana", fact: "In 1630s Holland, some single tulip bulbs reportedly sold for the price of a house." },
  lavender:   { biome: "meadow", type: "flower", latin: "Lavandula angustifolia", fact: "Its scent comes from oils made in tiny glands on the flowers and leaves." },
  sunflower:  { biome: "meadow", type: "flower", latin: "Helianthus annuus", fact: "Young sunflowers turn to follow the sun across the sky each day." },
  rose:       { biome: "meadow", type: "flower", latin: "Rosa", fact: "Rose 'thorns' are really prickles: they grow from the skin of the stem and snap off cleanly." },
  bush:       { biome: "meadow", type: "leafy", name: "Raspberry bush", latin: "Rubus idaeus", fact: "Each raspberry is a cluster of many tiny fruits called drupelets." },
  pumpkin:    { biome: "meadow", type: "leafy", latin: "Cucurbita pepo", fact: "A pumpkin is a fruit, and to a botanist it is a kind of berry." },
  tree:       { biome: "meadow", type: "tree", name: "Apple tree", latin: "Malus domestica", fact: "Apple trees grown from seed rarely match their parent, so growers copy good trees by grafting." },
  goldtulip:  { biome: "meadow", type: "flower", name: "Wild tulip", latin: "Tulipa sylvestris", rare: true, fact: "A yellow wild tulip, scarce in Britain, where it was brought in centuries ago." },
  fern:       { biome: "woodland", type: "leafy", name: "Male fern", latin: "Dryopteris filix-mas", fact: "Ferns have no flowers or seeds. They spread by spores from the underside of their fronds." },
  mushroom:   { biome: "woodland", type: "mushroom", name: "Fly agaric", latin: "Amanita muscaria", fact: "It lives in partnership with tree roots, especially birch and pine, trading minerals for sugars." },
  moonshroom: { biome: "woodland", type: "mushroom", name: "Amethyst deceiver", latin: "Laccaria amethystina", rare: true, fact: "Vivid purple when damp, it fades as it dries, which makes it hard to recognise." },
  cactus:     { biome: "desert", type: "leafy", name: "Saguaro", latin: "Carnegiea gigantea", fact: "A saguaro can live for over 150 years and may not grow its first arm until it is 50 or older." },
  sprout:     { type: "leafy" },
};


// =====================================================
// E. WILDLIFE
// =====================================================

// Pictures for the new creatures and the unlockable items
const MORE_SPRITES = {
  hedgehog:  ["........", "..b.b.b.", ".bbbbbb.", "bbbbbbee", "bbbbbbek", "bbbbbbee", ".e..e...", "........"],
  owl:       ["........", ".b...b..", ".bbbbb..", ".ykbky..", ".bbobb..", ".beeeb..", ".bbbbb..", "..o.o..."],
  heron:     ["....ss..", "...sskoo", "...ss...", "..ss....", ".sssss..", ".sssss..", "..k.k...", "..k.k..."],
  newt:      ["........", "........", "...o....", ".oooook.", "o.ooooo.", "..o..o..", "........", "........"],
  lizard:    ["........", "........", "......g.", ".gggggkg", "g.gggg..", "..g..g..", "........", "........"],
  scorpion:  ["........", "..b.....", ".b......", ".b..b.b.", ".bbbbbb.", "..bbbb.b", "..b.b...", "........"],
  parrot:    ["........", "..rrr...", ".rkrro..", ".rrrr...", "urrrr...", "uurry...", "..y.y...", "........"],
  treefrog:  ["........", ".ll..ll.", "lrllllrl", "llllllll", ".llllll.", "ou.ll.uo", "........", "........"],
  book:      ["........", ".bbbbbbb", ".baaaabi", ".bbbbbbi", ".baaaabi", ".bbbbbbi", ".bbbbbbb", "..iiiii."],
  shoal:     ["........", ".o..oo..", ".oooook.", ".o..oo..", "........", "..o..oo.", "..oooook", "..o..oo."],
};

// Visitors that only come to one biome. Same rules as VISITORS in game.js.
const BIOME_VISITORS = [
  { id: "hedgehog", name: "Hedgehog",  biome: "woodland",   type: "leafy",    kinds: 3 },
  { id: "owl",      name: "Tawny owl", biome: "woodland",   type: "tree",     kinds: 2, flier: true },
  { id: "newt",     name: "Newt",      biome: "wetland",    type: "leafy",    kinds: 3 },
  { id: "heron",    name: "Heron",     biome: "wetland",    type: "water",    kinds: 3 },
  { id: "lizard",   name: "Lizard",    biome: "desert",     type: "leafy",    kinds: 3 },
  { id: "scorpion", name: "Scorpion",  biome: "desert",     type: "leafy",    kinds: 6 },
  { id: "treefrog", name: "Tree frog", biome: "rainforest", type: "leafy",    kinds: 3 },
  { id: "parrot",   name: "Macaw",     biome: "rainforest", type: "tree",     kinds: 2, flier: true },
];

// What the botany log says about each creature once you've seen it
const WILDLIFE_FACTS = {
  bee:       "Bees visit flowers for nectar and carry pollen from one to the next. Many crops depend on them.",
  butterfly: "Butterflies taste with their feet, which is how they choose a plant to lay eggs on.",
  worm:      "Earthworms pull dead leaves underground and their tunnels let air and water into the soil.",
  ladybird:  "One ladybird can eat thousands of aphids in its life.",
  bird:      "Birds that eat fruit spread the seeds in their droppings, far from the parent plant.",
  dragonfly: "Dragonflies spend most of their lives under water as larvae, sometimes for years.",
  duck:      "Seeds and tiny animals can hitch a ride between ponds on a duck's feet and feathers.",
  snail:     "A snail's tongue, the radula, is covered in thousands of tiny teeth.",
  hedgehog:  "Hedgehogs roam up to a mile or two each night looking for beetles, worms and slugs.",
  owl:       "Tawny owls hunt by sound. Their soft-edged feathers let them fly almost silently.",
  newt:      "Newts breathe through their skin as well as their lungs, so they need clean water.",
  heron:     "A heron stands perfectly still in shallow water and strikes at fish with its neck.",
  lizard:    "Many desert lizards hide in burrows through the heat of the day.",
  scorpion:  "Scorpions glow blue-green under ultraviolet light.",
  treefrog:  "Sticky pads on its toes let a tree frog climb wet leaves.",
  parrot:    "Macaws eat clay from riverbanks, which may help them cope with toxins in seeds.",
};

// Homes form when a garden has enough of one thing
const HOMES = [
  { id: "hive",      name: "Beehive",    hint: "Plant 5 flowers in one garden.", fact: "A honeybee colony can hold tens of thousands of bees, nearly all of them sisters." },
  { id: "wormhouse", name: "Worm house", hint: "Plant 3 mushrooms in one garden.", fact: "Healthy soil can hold hundreds of earthworms in every square metre." },
  { id: "shoal",     name: "Fish shoal", hint: "Add 4 water features to one garden.", fact: "Swimming in a shoal makes it harder for a predator to pick out one fish." },
];
