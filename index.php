<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hot Cuisine Quest</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Contêiner Principal com aparência de iPhone -->
    <div id="iphoneContainer" class="container">
        <!-- Tela Inicial -->
        <div id="initialScreen" class="screen">
            <h1>Hot Cuisine Quest</h1>
            <p>Escolha quantas receitas você deseja fazer:</p>
            <input type="range" id="recipeRange" min="1" max="10" value="1">
            <span id="rangeValue">1</span> receita(s)
            <button id="startQuest">Iniciar Quest</button>
        </div>

        <!-- Tela de Itens do Market -->
        <div id="marketScreen" class="screen" style="display:none;">
            <h2>Itens a serem comprados no Market</h2>
            <table id="marketTable" class="market-table">
                <thead>
                    <tr>
                        <th>Quantidade</th>
                        <th>Item</th>
                    </tr>
                </thead>
                <tbody id="marketItems"></tbody>
            </table>
            <div class="button-container">
                <button id="goToSteps">Ir para os Passos</button>
            </div>
        </div>

        <!-- Tela de Passos da Quest -->
        <div id="stepContent" class="screen" style="display:none;">
            <h2 id="stepTitle"></h2>
            <div id="stepDescription"></div>
            <button id="nextStep">Próximo Passo</button>
            <button id="restartQuest">Recomeçar</button> <!-- Botão de Recomeçar -->
        </div>
    </div>

    <!-- Inclusão dos arquivos de dados e lógica -->
    <script src="data.js"></script>
    <script src="script.js"></script>
</body>
</html>
