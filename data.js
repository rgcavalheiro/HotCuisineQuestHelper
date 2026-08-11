const marketItems = [
    { quantity: 3, item: "Bar of Chocolate" },
    { quantity: 1, item: "Blessed Wooden Stake" },
    { quantity: 3, item: "Candy" },
    { quantity: 3, item: "Candy Canes" },
    { quantity: 1, item: "Flask of Demonic Blood" },
    { quantity: 1, item: "Cream Cake" },
    { quantity: 15, item: "Gingerbreadman" },
    { quantity: 1, item: "Green Perch" },
    { quantity: 10, item: "Honeycombs" },
    { quantity: 1, item: "Northern Pike" },
    { quantity: 2, item: "Peanuts" },
    { quantity: 1, item: "Powder Herb" },
    { quantity: 1, item: "Rainbow Trout" },
    { quantity: 10, item: "Rice Balls" },
    { quantity: 5, item: "Sandcrawler Shell" },
    { quantity: 1, item: "Shadow Herb" },
    { quantity: 15, item: "Shrimps" },
    { quantity: 1, item: "Sling Herb" },
    { quantity: 2, item: "Troll Green" },
    { quantity: 7, item: "Coconuts" },
    { quantity: 1, item: "Juice Squeezer" }
];

/* Nome exibido -> arquivo GIF na TibiaWiki */
const itemSprites = {
    "Bar of Chocolate": "Bar of Chocolate.gif",
    "Blessed Wooden Stake": "Blessed Wooden Stake.gif",
    "Candy": "Candy.gif",
    "Candy Canes": "Candy Cane.gif",
    "Flask of Demonic Blood": "Flask of Demonic Blood.gif",
    "Cream Cake": "Cream Cake.gif",
    "Gingerbreadman": "Gingerbreadman.gif",
    "Green Perch": "Green Perch.gif",
    "Honeycombs": "Honeycomb.gif",
    "Northern Pike": "Northern Pike.gif",
    "Peanuts": "Peanut.gif",
    "Powder Herb": "Powder Herb.gif",
    "Rainbow Trout": "Rainbow Trout.gif",
    "Rice Balls": "Rice Ball.gif",
    "Sandcrawler Shell": "Sandcrawler Shell.gif",
    "Shadow Herb": "Shadow Herb.gif",
    "Shrimps": "Shrimp.gif",
    "Sling Herb": "Sling Herb.gif",
    "Troll Green": "Troll Green.gif",
    "Coconuts": "Coconut.gif",
    "Juice Squeezer": "Juice Squeezer.gif",
    "Hydra Tongues": "Hydra Tongue.gif",
    "Plums": "Plum.gif",
    "Lemons": "Lemon.gif",
    "Mangoes": "Mango.gif",
    "Potatoes": "Potato.gif",
    "Beetroot": "Beetroot.gif",
    "Carrots": "Carrot.gif",
    "Corncobs": "Corncob.gif",
    "Cucumbers": "Cucumber.gif",
    "Bunch of Wheat (15 Flour)": "Bunch of Wheat.gif",
    "Pumpkin": "Pumpkin.gif",
    "Vial of Mead": "Mead.gif",
    "Brown Bread": "Brown Bread.gif",
    "Vials of Milk": "Milk.gif",
    "Bulb of Garlic": "Bulb of Garlic.gif",
    "Bottle of Bug Milk": "Bottle of Bug Milk.gif",
    "Banana": "Banana.gif",
    "Cheese": "Cheese.gif",
    "Cookie": "Cookie.gif",
    "Eggs": "Egg.gif",
    "Oranges": "Orange.gif",
    "Rolls": "Roll.gif",
    "Vials of Beer": "Beer.gif",
    "Ham": "Ham.gif",
    "Meat": "Meat.gif",
    "Vial of Wine": "Wine.gif",
    "Vials of Water": "Water.gif",
    "Vials (qualquer tipo)": "Vial.gif",
    "Brown Mushrooms": "Brown Mushroom.gif",
    "Fern": "Fern.gif",
    "Red Mushrooms": "Red Mushroom.gif",
    "Star Herb": "Star Herb.gif",
    "Stone Herb": "Stone Herb.gif",
    "White Mushrooms": "White Mushroom.gif",
    "Jalape\u00f1o Peppers": "Jalapeno Pepper.gif",
    "Onions": "Onion.gif",
    "Tomatoes": "Tomato.gif",
    "Bat": "Bat.gif",
    "Chicken": "Chicken.gif"
};

/* Coordenadas oficiais (TibiaWiki BR) para o minimapa */
const npcLocations = {
    "Rose": {
        city: "Venore - Crunor's Finest Warehouse",
        x: 32971, y: 32034, z: 6
    },
    "Rodney": {
        city: "Venore - Crunor's Finest Warehouse",
        x: 32970, y: 32041, z: 6
    },
    "Livielle": {
        city: "Venore - Crunor's Finest Warehouse",
        x: 32982, y: 32036, z: 6
    },
    "Donald McRonald": {
        city: "Thais - Farm Lane",
        x: 32389, y: 32229, z: 7
    },
    "Sherry McRonald": {
        city: "Thais - Farm Lane",
        x: 32391, y: 32240, z: 7
    },
    "Dankwart": {
        city: "Svargrond - Tempest in a Meadhorn",
        x: 32202, y: 31160, z: 7
    },
    "Imalas": {
        city: "Carlin - Central Plaza",
        x: 32334, y: 31801, z: 7
    },
    "Dane": {
        city: "Carlin - Wave Cellar",
        x: 32308, y: 31839, z: 8
    },
    "Brasith": {
        city: "Ab'Dendriel - Mangrove Street",
        x: 32692, y: 31589, z: 7
    },
    "Bonifacius": {
        city: "Edron - Castle",
        x: 33167, y: 31801, z: 7
    },
    "Mirabell": {
        city: "Edron - Horn of Plenty",
        x: 33175, y: 31803, z: 6
    },
    "Sandra": {
        city: "Edron - Ivory Towers",
        x: 33257, y: 31840, z: 7
    },
    "Luna": {
        city: "Edron - Ivory Towers",
        x: 33254, y: 31839, z: 5
    },
    "Jezzara": {
        city: "Ankrahmun - North of Depot",
        x: 33125, y: 32820, z: 6
    }
};

const steps = [
    {
        title: "Passo 1: Prepara\u00e7\u00e3o Inicial em Qualquer Depot",
        description: "Compre os itens do Market listados e prepare-se para a jornada. Use o transporte dispon\u00edvel para viajar at\u00e9 Venore."
    },
    {
        title: "Passo 2: Compras em Venore",
        description: [
            { npc: "Rose", items: [
                { quantity: 2, item: "Hydra Tongues" }
            ]},
            { npc: "Rodney", items: [
                { quantity: 5, item: "Plums" }
            ]},
            { npc: "Livielle", items: [
                { quantity: 3, item: "Lemons" },
                { quantity: 22, item: "Mangoes" },
                { quantity: 30, item: "Potatoes" }
            ]}
        ],
        transport: "Ap\u00f3s finalizar suas compras, use o barco em Venore para viajar at\u00e9 Thais."
    },
    {
        title: "Passo 3: Compras em Thais",
        description: [
            { npc: "Donald McRonald", items: [
                { quantity: 2, item: "Beetroot" },
                { quantity: 27, item: "Carrots" },
                { quantity: 2, item: "Corncobs" },
                { quantity: 3, item: "Cucumbers" },
                { quantity: 15, item: "Bunch of Wheat (15 Flour)" }
            ]},
            { npc: "Sherry McRonald", items: [
                { quantity: 1, item: "Pumpkin" }
            ]}
        ],
        transport: "De Thais, pegue o barco para Svargrond."
    },
    {
        title: "Passo 4: Compras em Svargrond",
        description: [
            { npc: "Dankwart", items: [
                { quantity: 1, item: "Vial of Mead" }
            ]}
        ],
        transport: "Use o barco para viajar at\u00e9 Carlin."
    },
    {
        title: "Passo 5: Compras em Carlin",
        description: [
            { npc: "Imalas", items: [
                { quantity: 5, item: "Brown Bread" }
            ]},
            { npc: "Dane", items: [
                { quantity: 3, item: "Vials of Milk" }
            ]}
        ],
        transport: "Ap\u00f3s finalizar suas compras, use o barco em Carlin para viajar at\u00e9 Ab'Dendriel."
    },
    {
        title: "Passo 6: Compras em Ab'Dendriel",
        description: [
            { npc: "Brasith", items: [
                { quantity: 2, item: "Bulb of Garlic" },
                { quantity: 1, item: "Bottle of Bug Milk" }
            ]}
        ],
        transport: "De Ab'Dendriel, use o barco para viajar at\u00e9 Edron."
    },
    {
        title: "Passo 7: Compras em Edron",
        description: [
            { npc: "Bonifacius", items: [
                { quantity: 2, item: "Banana" },
                { quantity: 3, item: "Cheese" },
                { quantity: 10, item: "Cookie" },
                { quantity: 48, item: "Eggs" },
                { quantity: 2, item: "Oranges" },
                { quantity: 2, item: "Rolls" }
            ]},
            { npc: "Mirabell", items: [
                { quantity: 2, item: "Vials of Beer" },
                { quantity: 1, item: "Ham" },
                { quantity: 2, item: "Meat" },
                { quantity: 1, item: "Vial of Wine" }
            ]},
            { npc: "Sandra", items: [
                { quantity: 2, item: "Vials of Water" },
                { quantity: 14, item: "Vials (qualquer tipo)" }
            ]},
            { npc: "Luna", items: [
                { quantity: 10, item: "Brown Mushrooms" },
                { quantity: 1, item: "Fern" },
                { quantity: 10, item: "Red Mushrooms" },
                { quantity: 1, item: "Star Herb" },
                { quantity: 1, item: "Stone Herb" },
                { quantity: 20, item: "White Mushrooms" }
            ]}
        ],
        transport: "Ap\u00f3s finalizar suas compras, use o barco em Edron para viajar at\u00e9 Ankrahmun."
    },
    {
        title: "Passo 8: Compras em Ankrahmun",
        description: [
            { npc: "Jezzara", items: [
                { quantity: 18, item: "Jalape\u00f1o Peppers" },
                { quantity: 3, item: "Onions" },
                { quantity: 4, item: "Tomatoes" }
            ]}
        ]
    },
    {
        title: "Passo 9: Coleta de Corpos Frescos em Edron",
        description: "Mate um Bat e um Chicken para coletar os corpos frescos. Certifique-se de lev\u00e1-los ao NPC dentro de 10 minutos.",
        collect: [
            { quantity: 1, item: "Bat" },
            { quantity: 1, item: "Chicken" }
        ]
    }
];

const JOURNEY_PHASES = [
    { id: "prep", label: "Prepara\u00e7\u00e3o" },
    { id: "rota", label: "Rota" },
    { id: "final", label: "Finaliza\u00e7\u00e3o" }
];

function getStepPhase(stepIndex) {
    const step = steps[stepIndex];
    if (!step) return "prep";
    if (step.collect) return "collect";
    if (Array.isArray(step.description)) return "shop";
    return "prep";
}

function getCityName(step) {
    if (!step) return "";
    if (step.collect) return "Edron";
    if (!Array.isArray(step.description)) return "";
    const match = step.title.match(/Compras em (.+)$/);
    return match ? match[1] : "";
}

function getShoppingSteps() {
    return steps
        .map((step, index) => ({ step, index }))
        .filter(({ step }) => Array.isArray(step.description));
}

function countStepItems(step) {
    if (!step) return 0;
    if (Array.isArray(step.description)) {
        return step.description.reduce((sum, npc) => sum + npc.items.length, 0);
    }
    if (step.collect) return step.collect.length;
    return 0;
}

function countStepNpcs(step) {
    if (!step || !Array.isArray(step.description)) return 0;
    return step.description.length;
}

function marketItemId(itemName) {
    return "market:" + itemName;
}

function npcItemId(npcName, itemName) {
    return "npc:" + npcName + ":" + itemName;
}

function collectItemId(itemName) {
    return "collect:" + itemName;
}

function getAllQuestItems(multiplier) {
    const qty = multiplier || 1;
    const items = [];

    marketItems.forEach((entry) => {
        items.push({
            id: marketItemId(entry.item),
            item: entry.item,
            quantity: entry.quantity * qty,
            source: "market",
            label: "Market"
        });
    });

    steps.forEach((step) => {
        if (Array.isArray(step.description)) {
            const city = getCityName(step);
            step.description.forEach((npcGroup) => {
                npcGroup.items.forEach((entry) => {
                    items.push({
                        id: npcItemId(npcGroup.npc, entry.item),
                        item: entry.item,
                        quantity: entry.quantity * qty,
                        source: "npc",
                        npc: npcGroup.npc,
                        city: city,
                        label: npcGroup.npc
                    });
                });
            });
        }
        if (step.collect) {
            step.collect.forEach((entry) => {
                items.push({
                    id: collectItemId(entry.item),
                    item: entry.item,
                    quantity: entry.quantity * qty,
                    source: "collect",
                    label: "Coleta"
                });
            });
        }
    });

    return items;
}

function getQuestStats(multiplier) {
    const all = getAllQuestItems(multiplier || 1);
    const shopping = getShoppingSteps();
    return {
        totalItems: all.length,
        marketItems: marketItems.length,
        cities: shopping.length,
        steps: steps.length,
        npcItems: all.filter((i) => i.source === "npc").length,
        collectItems: all.filter((i) => i.source === "collect").length
    };
}

function getNextCityName(stepIndex) {
    for (let i = stepIndex + 1; i < steps.length; i++) {
        const city = getCityName(steps[i]);
        if (city && Array.isArray(steps[i].description)) return city;
    }
    return "";
}
