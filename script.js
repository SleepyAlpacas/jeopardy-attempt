var questions = [];
var answers = [];
var row = 5;
var col = 5;
var numQuestions = row * col;
var currentQuestionRow = 999;
var currentQuestionCol = 99;
var currentQuestionMoney = 0;
var playerCount = 4;
var currentPlayerCount = 0;
var wagers = [];
var moneyAfterWagers = [];
var characterIcons = ['Mr._Happy.webp', 'Bump2.webp', 'Mr-nosey-5a.webp', 'Mr_Clever-6A.PNG.webp', 'Littlemissbossy.webp', 'Lucky1.webp', 'MR_WRONG_2A.PNG.webp', 'Little_Miss_Twins4.PNG.webp'];
var playerCharacters = [];
var playerCorrectModifier = [];
var playerIncorrectModifier = [];
var playerCorrectBonus = [];
var playerPowerUses = [];
var correctPlayer = -1;

for (let i = 0; i < row; i++){
    questions[i] = [];
    answers[i] = [];
    for (let i2 = 0; i2 < col; i2++){
        questions[i][i2] = i + "-" + i2;
        answers[i][i2] = "ans " + questions[i][i2];
    }
}


questions[0][col] = "final jeopardy";
answers[0][col] = "answer jeopardy"



$(document).ready(function(){
    $("#question-screen").click(function(){
        if (wagers.length != playerCount || moneyAfterWagers.length == playerCount){
            showAnswer();
        }
    });
    $('#answer-screen').click(function(){
        if (wagers.length != playerCount){
            showBoard();
        }
        else{
            showWinScreen();
        }
    });
});

//when you select a question,
function showQuestion(row, col){
    loadQuestion(row, col);
    document.getElementById('board').style.display = 'none';
    document.getElementById('question-screen').style.display = 'flex';
    let x = document.getElementsByClassName('buttons');
    for (let i = 0; i < x.length; i++){
        x[i].style.display = "block";
    }
}

function loadQuestion(row, col){
    currentQuestionRow = row;
    currentQuestionCol = col;
    currentQuestionMoney = (currentQuestionRow + 1) * 100;
    document.getElementById('question-text').innerHTML = questions[row][col];
    document.getElementById('answer-text').innerHTML = answers[row][col];
}

function showAnswer(){
    document.getElementById('question-screen').style.display = 'none';
    document.getElementById('answer-screen').style.display = 'flex';
    let x = document.getElementsByClassName('buttons');
    for (let i = 0; i < x.length; i++){
        x[i].style.display = "none";
    }
}

function showBoard(){
    numQuestions--;
    document.getElementById('answer-screen').style.display = 'none';
    if (numQuestions != 0){
        greyOutQuestion();
        document.getElementById('board').style.display = 'block';
    }
    else{
        document.getElementById('final-jeopardy-wager').style.display = 'flex';
        let x = document.getElementsByClassName('wager-box');
        for (let i = 0; i < playerCount; i++){
            x[i].style.display = 'block';
        }
    }
}

function greyOutQuestion(){
    let query = ".board-questions .board-row:nth-child(" + (currentQuestionRow + 1) +") .board-cell:nth-child(" + (currentQuestionCol + 1) + ")";
    let text = "";
    if (correctPlayer != -1){
        text = "<img class = 'player-icon' src='" + characterIcons[playerCharacters[correctPlayer]] + "'>";
        correctPlayer = -1;
    }
    $(query).replaceWith("<div class='board-cell'>" + text + "</div>");
}

function correctAnswer(player){
    let x = document.getElementsByClassName('money')
    let currentMoney = parseInt(x[player].innerHTML);
    if (wagers.length != playerCount){
        correctPlayer = player;
        x[player].innerHTML = currentMoney + currentQuestionMoney * playerCorrectModifier[player] + playerCorrectBonus[player] + "$";
        checkPowerCorrect(player);
        showAnswer();
    }
    else{
        x[player].innerHTML = "???";
        moneyAfterWagers[player] = currentMoney + wagers[player];
        document.getElementsByClassName('buttons')[player].style.display = 'none';
    }
}

function incorrectAnswer(player){
    let x = document.getElementsByClassName('money')
    let currentMoney = parseInt(x[player].innerHTML);
    if (wagers.length != playerCount){
        x[player].innerHTML = currentMoney - currentQuestionMoney * playerIncorrectModifier[player] + "$";
        checkPowerIncorrect(player);
    }
    else{
        x[player].innerHTML = "???";
        moneyAfterWagers[player] = currentMoney - wagers[player];
        document.getElementsByClassName('buttons')[player].style.display = 'none';
    }
}

function submitWager(){
    let x = document.getElementsByClassName('wager-box');
    let y = document.getElementsByClassName('money');
    for (let i = 0; i < playerCount; i++){
        let currentMoney = parseInt(y[i].innerHTML);
        if (x[i].value > currentMoney || (currentMoney <= 0 && x[i].value != 0) || !x[i].value.match(/^[0-9]+$/)){
            alert("Player" + (i+1) + "'s wager is invalid");
            return;
        }
        wagers[i] = parseInt(x[i].value);
        x[i].style.display = 'none';
    }
    document.getElementById('final-jeopardy-wager').style.display = 'none';
    showQuestion(0, col);
}

function showWinScreen(){
    document.getElementById('win-screen').style.display = 'flex';
    document.getElementById('answer-screen').style.display = 'none';
    let x = document.getElementsByClassName('money');
    let winnerMoney = parseInt(x[0].innerHTML);
    let winnerIndex = 0;   
    for (let i = 0; i < playerCount; i++){
        x[i].innerHTML = moneyAfterWagers[i] + "$";
        if (winnerMoney < parseInt(x[i].innerHTML)){
            winnerMoney = parseInt(x[i].innerHTML);
            winnerIndex = i;
        }
    }

    let winnerIcon = document.getElementsByClassName('player-icon')[winnerIndex].src;
    document.getElementById('winner-icon').src = winnerIcon;
}

function setPlayerCharacter(characterNum){
    initCharacter(characterNum);
    currentPlayerCount++;
    if (currentPlayerCount == playerCount) {
        document.getElementById('character-select').style.display = 'none';
        document.getElementById('board').style.display = 'block';
    }
    else{
        document.getElementById('character-select-header').innerHTML = "Player " + (currentPlayerCount + 1) + " Select Your Character"
    }
}

function initCharacter(characterNum){
    document.getElementsByClassName('player-icon')[currentPlayerCount].src = characterIcons[characterNum];
    playerCharacters[currentPlayerCount] = characterNum;
    if (characterNum == 5){
        playerCorrectModifier[currentPlayerCount] = 0;
    }
    else if (characterNum == 6){
        playerCorrectModifier[currentPlayerCount] = 0.75;
        playerIncorrectModifier[currentPlayerCount] = 0.5;
    }
    else{
        playerCorrectModifier[currentPlayerCount] = 1;
    }

    if (characterNum == 3){
        playerIncorrectModifier[currentPlayerCount] = 1.5;
    }
    else if (characterNum == 6){}
    else{
        playerIncorrectModifier[currentPlayerCount] = 1;
    }

    if (characterNum == 5){
        playerCorrectBonus[currentPlayerCount] = Math.floor(Math.random() * (8) - 2) * 100;
    }
    else{
        playerCorrectBonus[currentPlayerCount] = 0;
    }

    if (characterNum == 1 || characterNum == 4){
        playerPowerUses[currentPlayerCount] = 1;
    }
    else if (characterNum == 2){
        playerPowerUses[currentPlayerCount] = 3;
    }
    else{
        playerPowerUses[currentPlayerCount] = 0;
    }
}

function checkPowerCorrect(player){
    if (playerCharacters[player] == 3){
        playerCorrectBonus[player] += 50;
    }
    else if (playerCharacters[player] == 5){
        playerCorrectBonus[player] = Math.floor(Math.random() * (8) - 2) * 100;
    }
}

function checkPowerIncorrect(player){
    if (playerCharacters[player] == 3){
        playerCorrectBonus[player] = 0;
    }
}