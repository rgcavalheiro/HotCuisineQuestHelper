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

const steps = [
    {
        title: "Passo 1: Preparação Inicial em Qualquer Depot",
        description: "Compre os itens do Market listados e prepare-se para a jornada. Use o transporte disponível para viajar até Venore."
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
        transport: "Após finalizar suas compras, use o barco em Venore para viajar até Thais."
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
        transport: "Use o barco para viajar até Carlin."
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
        transport: "Após finalizar suas compras, use o barco em Carlin para viajar até Ab'Dendriel."
    },
    {
        title: "Passo 6: Compras em Ab'Dendriel",
        description: [
            { npc: "Brasith", items: [
                { quantity: 2, item: "Bulb of Garlic" },
                { quantity: 1, item: "Bottle of Bug Milk" }
            ]}
        ],
        transport: "De Ab'Dendriel, use o barco para viajar até Edron."
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
        transport: "Após finalizar suas compras, use o barco em Edron para viajar até Ankrahmun."
    },
    {
        title: "Passo 8: Compras em Ankrahmun",
        description: [
            { npc: "Jezzara", items: [
                { quantity: 18, item: "Jalapeño Peppers" },
                { quantity: 3, item: "Onions" },
                { quantity: 4, item: "Tomatoes" }
            ]}
        ]
    },
    {
        title: "Passo 9: Coleta de Corpos Frescos em Edron",
        description: "Mate um Bat e um Chicken para coletar os corpos frescos. Certifique-se de levá-los ao NPC dentro de 10 minutos."
    }
];
