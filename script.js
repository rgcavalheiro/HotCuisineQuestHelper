let currentStep = 0;
let recipeMultiplier = 1;

// Atualiza o valor mostrado do range e ajusta a quantidade de itens
document.getElementById("recipeRange").addEventListener("input", function() {
    recipeMultiplier = this.value;
    document.getElementById("rangeValue").innerText = this.value;
    updateMarketItems();
});

document.getElementById("startQuest").addEventListener("click", function() {
    document.getElementById("initialScreen").style.display = 'none';
    document.getElementById("marketScreen").style.display = 'block';
    updateMarketItems();
});

document.getElementById("goToSteps").addEventListener("click", function() {
    document.getElementById("marketScreen").style.display = 'none';
    document.getElementById("stepContent").style.display = 'block';
    updateStep();
});

document.getElementById("nextStep").addEventListener("click", function() {
    if (currentStep < steps.length - 1) {
        currentStep++;
        updateStep();
    } else {
        alert("Você completou todos os passos!");
    }
});

document.getElementById("restartQuest").addEventListener("click", function() {
    currentStep = 0;
    document.getElementById("stepContent").style.display = 'none';
    document.getElementById("initialScreen").style.display = 'block';
});

function updateMarketItems() {
    const marketItemsTable = document.getElementById("marketItems");
    marketItemsTable.innerHTML = marketItems.map(item => `
        <tr>
            <td>${item.quantity * recipeMultiplier}</td>
            <td>${item.item}</td>
        </tr>
    `).join("");
}

function updateStep() {
    const step = steps[currentStep];
    document.getElementById("stepTitle").innerText = step.title;

    if (Array.isArray(step.description)) {
        let stepContent = "";
        step.description.forEach(npcGroup => {
            stepContent += `<h3>${npcGroup.npc}</h3>`;
            stepContent += `
                <table class="step-table">
                    <thead>
                        <tr><th>Quantidade</th><th>Item</th></tr>
                    </thead>
                    <tbody>
                        ${npcGroup.items.map(item => `
                            <tr>
                                <td>${item.quantity * recipeMultiplier}</td>
                                <td>${item.item}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        });
        document.getElementById("stepDescription").innerHTML = stepContent;
    } else {
        document.getElementById("stepDescription").innerText = step.description;
    }

    if (step.transport) {
        document.getElementById("stepDescription").innerHTML += `<p><em>Transporte: ${step.transport}</em></p>`;
    }
}

// Inicializar a lista de itens do Market
updateMarketItems();
