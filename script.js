var questions = [];
var answers = [];
var row = 5;
var col = 5;
var numQuestions = row*col;
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
        x[i].lastElementChild.style.display = 'none';
    }
    checkActivePowerVisibility();
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
        checkActivePowerVisibility();
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
    if (wagers.length != playerCount){
        correctPlayer = player;
        addMoney(player, currentQuestionMoney * playerCorrectModifier[player] + playerCorrectBonus[player])
        checkPowerCorrect(player);
        showAnswer();
    }
    else{
        let currentMoney = parseInt(document.getElementsByClassName('money')[player].innerHTML);
        document.getElementsByClassName('money')[player].innerHTML = "???";
        moneyAfterWagers[player] = currentMoney + wagers[player];
        document.getElementsByClassName('buttons')[player].style.display = 'none';
    }
}

function incorrectAnswer(player){
    if (wagers.length != playerCount){
        addMoney(player, -(currentQuestionMoney * playerIncorrectModifier[player]));
        checkPowerIncorrect(player);
    }
    else{
        let currentMoney = parseInt(document.getElementsByClassName('money')[player].innerHTML);
        document.getElementsByClassName('money')[player].innerHTML = "???";
        moneyAfterWagers[player] = currentMoney - wagers[player];
        document.getElementsByClassName('buttons')[player].style.display = 'none';
    }
}

function addMoney(player, amount){
    let x = document.getElementsByClassName('money');
    let currentMoney = parseInt(x[player].innerHTML);
    x[player].innerHTML = currentMoney + amount + "$";
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
    let winnerIndex = moneyAfterWagers.indexOf(Math.max.apply(null, moneyAfterWagers));   
    for (let i = 0; i < playerCount; i++){
        x[i].innerHTML = moneyAfterWagers[i] + "$";
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
        checkActivePowerVisibility();
        
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

//the bingo function doesn't work on all board sizes yet
function checkPowerCorrect(player){
    if (playerCharacters[player] == 3){
        playerCorrectBonus[player] += 50;
    }
    else if (playerCharacters[player] == 5){
        playerCorrectBonus[player] = Math.floor(Math.random() * (8) - 2) * 100;
    }
    else if (playerCharacters[player] == 7){
        greyOutQuestion();
        correctPlayer = player;
        let x = document.getElementsByClassName('board-cell');
        for (let i = 0; i < col; i++){
            if (x[(currentQuestionRow+1)*5+i].nodeName == 'BUTTON' || x[(currentQuestionRow+1)*5+i].innerHTML == '' || x[(currentQuestionRow+1)*5+i].childNodes[0].src != "http://127.0.0.1:3000/" + characterIcons[7] ){
                break;
            }
            if (i == col-1){
                console.log("HORIZONTAL BRONGO");
                addMoney(player, 2500);
            }
        }
        for (let i = 1; i < row+1; i++){
            if (x[i*5+currentQuestionCol].nodeName == 'BUTTON' || x[i*5+currentQuestionCol].innerHTML == '' || x[i*5+currentQuestionCol].childNodes[0].src != "http://127.0.0.1:3000/" + characterIcons[7]){
                break;
            }
            if (i == row){
                console.log("VERTICAL BRONGO");
                addMoney(player, 2500);
            }
        }
        if (currentQuestionCol == currentQuestionRow){
            for (let i = 0; i < row; i++){
                if (x[5*(i+1) + i].nodeName == 'BUTTON' || x[5*(i+1) + i].innerHTML == ''  || x[5*(i+1) + i].childNodes[0].src != "http://127.0.0.1:3000/" + characterIcons[7]){
                    console.log("i've broken" + (5*i) + " " + i);
                    break;
                }
                if (i == row-1){
                    console.log("DIAGONAL FORWARD BRONGO");
                    addMoney(player, 2500);
                }
            }
        }
        if (currentQuestionCol + currentQuestionRow == 4){
            for (let i = 1; i < row + 1; i++){
                if (x[5*(i+1) - i].nodeName == 'BUTTON' || x[5*(i+1) - i].innerHTML == '' || x[5*(i+1) - i].childNodes[0].src != "http://127.0.0.1:3000/" + characterIcons[7]){
                    console.log("i've broken" + (5*i) + " " + i);
                    break;
                }
                if (i == row){
                    console.log("DIAGONAL BACKWARD BRONGO");
                    addMoney(player, 2500);
                }
            }
        }
    }
}

function checkPowerIncorrect(player){
    if (playerCharacters[player] == 3){
        playerCorrectBonus[player] = 0;
    }
}

function useActivePower(player){
    if (playerCharacters[player] == 1){
        let random = Math.random();
        if (random <= 0.5){
            addMoney(player, parseInt(document.getElementsByClassName('money')[player].innerHTML));
        }
        else if (random <= 0.9){
            addMoney(player, -parseInt(document.getElementsByClassName('money')[player].innerHTML));
        }
        else{
            let totalMoney = parseInt(document.getElementsByClassName('money')[player].innerHTML);
            addMoney(player, -parseInt(document.getElementsByClassName('money')[player].innerHTML));
            for (let i = 0; i < playerCount; i++){
                addMoney(i, Math.floor(totalMoney/playerCount));
            }
        }
        document.getElementsByClassName('buttons')[player].style.display = 'none';
        $(".buttons").eq(player).children().css("display","inline-block");
    }
    playerPowerUses[player]--;
    if (playerPowerUses[player] == 0) {
        document.getElementsByClassName('power-button')[player].style.display = 'none';
    }
}

function checkActivePowerVisibility(){
    for (let player = 0; player < playerCount; player++){
        if (playerPowerUses[player] == 0) continue;
        else if (playerCharacters[player] == 1){
            if (document.getElementById('board').style.display == 'none'){
                $(".buttons").eq(player).children().css("display","inline-block");
                document.getElementsByClassName('power-button')[player].style.display = 'none';
            }
            else{
                document.getElementsByClassName('buttons')[player].style.display = 'block';
                $(".buttons").eq(player).children().css("display","none");
                document.getElementsByClassName('power-button')[player].style.display = 'inline-block';
            }
        }
        else if (playerCharacters[player] == 2 || playerCharacters[player] == 4){
            if (document.getElementById('question-screen').style.display != 'none'){
                document.getElementsByClassName('power-button')[player].style.display = 'inline-block';
            }
            else{
                document.getElementsByClassName('power-button')[player].style.display = 'none';
            }
        }
    }
}