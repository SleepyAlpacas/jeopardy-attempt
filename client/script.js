var questions = [];
var answers = [];
var row = 5;
var col = 5;
var numQuestions = col * row;
var currentQuestionRow = 999;
var currentQuestionCol = 99;
var currentQuestionMoney = 0;
var playerCount = 4;
var currentPlayerCount = 0;
var wagers = [];
var moneyAfterWagers = [];
var finalJeopardyAnswers = [];
var characterIconsPath = "images/";
var characterIcons = ['Mr._Happy.webp', 'Bump2.webp', 'Mr-nosey-5a.webp', 'Mr_Clever-6A.PNG.webp', 'Littlemissbossy.webp', 'Lucky1.webp', 'MR_WRONG_2A.PNG.webp', 'Little_Miss_Twins4.PNG.webp', 'Speedy_Gonzales.png', 'Slowpoke_Rodriguez.webp', 'Foghorn_Leghorn.png', 'Michigan_J._Frog.webp', 'Rocko_Wallaby.webp', 'Stimpy.webp', 'Robot_Krabs.webp', 'Pigs.webp'];
var buzzerPath = "buzzers/";
var buzzerFiles = ['dolphin.mp3', 'flintmobile.mp3', 'subaluwa.mp3', 'headshake.mp3', 'pourwater.mp3', 'thunder.mp3', 'piano.mp3', 'gnote.mp3', 'freeformjazz.mp3', 'tempura.mp3', 'yop.mp3', 'usb.mp3', 'animalcrossing.mp3', 'bowling.mp3', 'snakedies.mp3', 'kazooie.mp3'];
var playerCharacters = [];
var playerBuzzers = [];
var playerCorrectModifier = [];
var playerIncorrectModifier = [];
var playerCorrectBonus = [];
var playerPowerUses = [];
var correctPlayer = -1;

var rockoed = false;

const socket = io('https://jeopardont.onrender.com');
var room;
var buzzedPlayers = [];

for (let i = 0; i < row; i++){
    questions[i] = [];
    answers[i] = [];
}

for (let i = 0; i < buzzerFiles.length; i++){
    buzzerFiles[i] = buzzerPath + buzzerFiles[i];
}
for (let i = 0; i < characterIcons.length; i++){
    characterIcons[i] = characterIconsPath + characterIcons[i];
}

for (let i = 0; i < col; i++){
    questions[i][0] = "<img src='0-" + i + ".png'>";
}
answers[0][0]='Blastoise'; answers[1][0]='Sentret'; answers[2][0]='Dusclops'; answers[3][0]='Munna'; answers[4][0]='Drapion';

questions[0][1] = 'Top 10 Healthiest Foods'; questions[2][1]='Top 10 Songs that will make you cry'; questions[1][1]='Top 10 Most Intelligent Animals';questions[3][1]='Top 10 Insanely Racist Moments In Disney Movies That You Totally Forgot About';questions[4][1] = 'Top 5 Brutal Facts About Getting Shot'
answers[0][1]='<ul><li>Avocado</li><li> Kale</li><li> Sweet Potato</li><li> Blueberries</li><li> Almond</li></ul><ul><li> Apple</li><li> Salmon</li><li> Oats</li><li> Garlic</li><li> Broccoli</li></ul>';
answers[2][1]='<ul><li>Wild Horses</li><li> The Sound of Silence</li><li> Wish you were here</li><li> One sweet day</li><li> The living years</li></ul><ul><li> Candle in the wind</li><li> Hallelujah</li><li> Everybody Hurts</li><li> Hurt</li><li> Tears in Heaven</li></ul>';
answers[1][1]='<ul><li>Raccoon</li><li>Border Collie</li><li>African Grey Parrot</li><li>Pig</li><li>Rat</li></ul><ul><li>Orangutan</li><li>Crows</li><li>Elephant</li><li>Bottlenose Dolphin</li><li>Chimpanzee</li></ul>'
answers[3][1]="<ul><li>Fantasia</li><li>Commando Duck</li><li>Santa's Workshop</li><li>The Jungle Book</li><li>Aladdin</li></ul><ul><li>Peter Pan</li><li>Lady and the Tramp</li><li>The Aristocats</li><li>Dumbo</li><li>Song of the South</li>"
answers[4][1]='<ul><li>Women are more likely to survive a gunshot</li><li>Tiny details make a big difference</li><li>Nanotechnology could have saved you</li><li>Getting shot will probably bankrupt you</li><li>There are worse things to get shot with than a gun</li></ul>'

questions[0][2] = "A drawer contains black and white socks. What is the smallest number of socks that must be drawn from the drawer such that you are guaranteed to have a pair of similar colour socks?";
questions[1][2]="<img src='2-2.jpg' class='question-img'> How many moves are required to transport the balls from the tube I to tube III if all the balls must remain in the same order?"
questions[2][2]="<img src='2-3.jpg' class='question-img'>Peter's father has five sons. The names of four sons are Fefe, Fifi, Fafa and Fufu respectively. What is the name of the fifth son?";
questions[3][2]="<img src='2-4.png' class='question-img'>How many triangles are in the picture?";
questions[4][2]="<img src='2-5.jpg' class='question-img'>If you have a 7-minute hourglass and an 11-minute hourglass, how can you boil an egg in exactly 15 minutes?";
answers[0][2] = "3";
answers[1][2] = "5";
answers[2][2]='Peter';
answers[3][2]='16';
answers[4][2] = "<ol style='font-size:30px'><li>Start both hourglasses as you start boiling the egg.</li><li>After the 7-minute hourglass runs out, turn it over to start it again.</li><li>Four minutes later, when the 11-minute hourglass runs out, turn the 7-minute hourglass again.</li><li>Wait for the 7-minute hourglass to run out, which will take another four minutes and get you to exactly 15 minutes of boiling time.</li></ol>";

questions[0][3] = "A critically acclaimed dark fantasy series by Kentaro Miura";
answers[0][3] = "Berserk";
questions[1][3] = "Please name an anime that's animated by Madhouse";
answers[1][3] = "Tatami Galaxy, Hxh, Chihayafuru, Ippo, No game no life, OPM, Death parade, Overlord, Parasyte, Trigun, Cardcaptor Sakura, Beyblade, Texhnolyze,  Black Lagoon, Death Note, Claymore, Btooom!, Irregular at magic highschool, Frieren, ...";
questions[2][3] = "This anime's name translated means \"everyday life\" and is the highest rated slice of life anime on MAL";
answers[2][3] = "Nichijou";
questions[3][3] = "A holiday celebrated from April 29 to May 5 that is also the longest vacation period for Japanese salarymen"
answers[3][3] = "Golden Week";
questions[4][3] = "A song from this Japanese voice was recently heard in Guardians of the Galaxies Vol. 3";
answers[4][3] = "Hatsune Miku (Would've accepted the name of any vocaloid)";

for (let i = 0; i < row; i++){
    questions[i][4] = "<video class='question-vid' controls autoplay> <source src='4-" + i + ".mp4' type='video/mp4'> </video>";
}
answers[0][4]='Brazil';answers[1][4]='China/Hong Kong idk';answers[2][4]='India';answers[3][4]='Russia';answers[4][4]='Italy';

questions[0][col] = "<audio controls> <source src='final.mp3' type='audio/mp3'> </audio> What is the game?";
answers[0][col] = "Parappa the Rapper 2";


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
    sendGameState();
    socket.emit('enable valid buzzer', ({room, buzzedPlayers}));
}

function loadQuestion(row, col){
    currentQuestionRow = row;
    currentQuestionCol = col;
    currentQuestionMoney = (currentQuestionRow + 1) * 100;
    document.getElementById('question-text').innerHTML = questions[row][col];
    document.getElementById('answer-text').innerHTML = answers[row][col];
}

function showAnswer(){
    buzzedPlayers = [];
    socket.emit('disable buzzer', room);
    let gameState = 'answer';
    socket.emit('game state', ({gameState, room}));
    document.getElementById('question-screen').style.display = 'none';
    document.getElementById('answer-screen').style.display = 'flex';
    let x = document.getElementsByClassName('buttons');
    for (let i = 0; i < x.length; i++){
        x[i].style.display = "none";
    }
    removeBorder();
    rockoed = false;
    moneyAfterWagers = [];
}

function showBoard(){
    numQuestions--;
    document.getElementById('answer-screen').style.display = 'none';
    if (numQuestions != 0){
        greyOutQuestion();
        document.getElementById('board').style.display = 'block';
        sendGameState();
    }
    else{
        document.getElementById('final-jeopardy-wager').style.display = 'flex';
        socket.emit('wager screen', room);
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
        let specialExit = false;
        if (rockoed) {
            addMoney(player, -currentQuestionMoney);
            powerPopUp(12, playerCharacters.indexOf(12));
            specialExit = true;
        }
        if (moneyAfterWagers.length != 0 && moneyAfterWagers[player] != undefined){
            addMoney(player, moneyAfterWagers[player]);
            specialExit = true;
        }
        if (!specialExit) {
            addMoney(player, currentQuestionMoney * playerCorrectModifier[player] + playerCorrectBonus[player])
        }
        checkPowerCorrect(player);
        showAnswer();

    }
    else{
        let currentMoney = parseInt(document.getElementsByClassName('money')[player].innerHTML.slice(1));
        document.getElementsByClassName('money')[player].innerHTML = "???";
        moneyAfterWagers[player] = currentMoney + wagers[player];
        document.getElementsByClassName('buttons')[player].style.display = 'none';
        
        socket.emit('update money', ({playerNum: player, money: moneyAfterWagers[player], room}));
    }
}

function incorrectAnswer(player){
    if (wagers.length != playerCount){
        addMoney(player, -(currentQuestionMoney * playerIncorrectModifier[player]));
        checkPowerIncorrect(player);
        socket.emit('enable valid buzzer', ({room, buzzedPlayers}));
        removeBorder();
    }
    else{
        let currentMoney = parseInt(document.getElementsByClassName('money')[player].innerHTML.slice(1));
        document.getElementsByClassName('money')[player].innerHTML = "???";
        moneyAfterWagers[player] = currentMoney - wagers[player];
        document.getElementsByClassName('buttons')[player].style.display = 'none';

        socket.emit('update money', ({playerNum: player, money: moneyAfterWagers[player], room}));
    }
}

function addMoney(playerNum, amount){
    let x = document.getElementsByClassName('money');
    let currentMoney = parseInt(x[playerNum].innerHTML.slice(1));
    let money = currentMoney + amount;
    x[playerNum].innerHTML = "$" + money;
    socket.emit('update money', ({playerNum, money, room}));
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

function calculateWager(playerNum, wagerAmount){
    wagers[playerNum] = wagerAmount;
    if (!wagers.includes(undefined) && wagers.length == playerCount){
        document.getElementById('final-jeopardy-wager').style.display = 'none';
        showQuestion(0, col);
        socket.emit('show final jeopardy', room);
    }
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

function setPlayerCharacter(characterNum, playerNum){
    initCharacter(characterNum, playerNum);
    currentPlayerCount++;
    if (currentPlayerCount == playerCount) {
        let pages = document.getElementsByClassName('character-select');
        for (let i = 0; i < pages.length; i++){
            pages[i].style.display = 'none';
        }
        document.getElementById('board').style.display = 'block';
        sendGameState();
    }
}

function initCharacter(characterNum, playerNum){
    document.getElementsByClassName('player-icon')[playerNum].src = characterIcons[characterNum];
    playerCharacters[playerNum] = characterNum;
    if (characterNum == 5){
        playerCorrectModifier[playerNum] = 0;
    }
    else if (characterNum == 6){
        playerCorrectModifier[playerNum] = 0.75;
        playerIncorrectModifier[playerNum] = 0.5;
    }
    else{
        playerCorrectModifier[playerNum] = 1;
    }

    if (characterNum == 3){
        playerIncorrectModifier[playerNum] = 1.25;
    }
    else if (characterNum == 6){}
    else{
        playerIncorrectModifier[playerNum] = 1;
    }

    if (characterNum == 5){
        playerCorrectBonus[playerNum] = Math.floor(Math.random() * (8) - 2) * 100;
    }
    else{
        playerCorrectBonus[playerNum] = 0;
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
            if (x[(currentQuestionRow+1)*5+i].nodeName == 'BUTTON' || x[(currentQuestionRow+1)*5+i].innerHTML == '' || x[(currentQuestionRow+1)*5+i].childNodes[0].src != "http://127.0.0.1:3002/" + characterIcons[7] ){
                break;
            }
            if (i == col-1){
                console.log("HORIZONTAL BRONGO");
                addMoney(player, 2500);
            }
        }
        for (let i = 1; i < row+1; i++){
            if (x[i*5+currentQuestionCol].nodeName == 'BUTTON' || x[i*5+currentQuestionCol].innerHTML == '' || x[i*5+currentQuestionCol].childNodes[0].src != "http://127.0.0.1:3002/" + characterIcons[7]){
                break;
            }
            if (i == row){
                console.log("VERTICAL BRONGO");
                addMoney(player, 2500);
            }
        }
        if (currentQuestionCol == currentQuestionRow){
            for (let i = 0; i < row; i++){
                if (x[5*(i+1) + i].nodeName == 'BUTTON' || x[5*(i+1) + i].innerHTML == ''  || x[5*(i+1) + i].childNodes[0].src != "http://127.0.0.1:3002/" + characterIcons[7]){
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
                if (x[5*(i+1) - i].nodeName == 'BUTTON' || x[5*(i+1) - i].innerHTML == '' || x[5*(i+1) - i].childNodes[0].src != "http://127.0.0.1:3002/" + characterIcons[7]){
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

    else if (playerCharacters[player] == 8 && buzzedPlayers.length == 1) {
            addMoney(player, 50);
    }

    else if (playerCharacters[player] == 9 && buzzedPlayers.length != 1) {
        addMoney(player, 100)
    }

    else if (playerCharacters[player] == 15 && playerCorrectBonus[player] == 0) {
        greyOutQuestion();
        correctPlayer = player;
        let x = document.getElementsByClassName('board-cell');
        for (let i = 0; i < col; i++){
            let correctAnswerInRow = false;
            for (let i2 = 1; i2 < row + 1; i2++){
                let currentCell = x[(i2 * col) + i];
                if (currentCell.childNodes[0].src == "http://127.0.0.1:3000/jeopardy-attempt/client/" + characterIcons[15]){
                    correctAnswerInRow = true;
                    continue;
                }
            }
            if (!correctAnswerInRow){return;}
        }
        playerCorrectBonus[player] = 100;
    }
}

function checkPowerIncorrect(player){
    if (playerCharacters[player] == 3){
        playerCorrectBonus[player] = 0;
    }
}

function useActivePower(player){
    if (playerCharacters[player] == 0){
        confetti();
    }
    else if (playerCharacters[player] == 1){
        let random = Math.random();
        let money = parseInt(document.getElementsByClassName('money')[player].innerHTML.slice(1));
        if (random <= 0.5){
            addMoney(player, money);
        }
        else if (random <= 0.9){
            addMoney(player, -money);
        }
        else{
            addMoney(player, -money);
            for (let i = 0; i < playerCount; i++){
                addMoney(i, Math.floor(money/playerCount));
            }
        }
    }
    else if (playerCharacters[player] == 11){
        let money = parseInt(document.getElementsByClassName('money')[player].innerHTML.slice(1));
        addMoney(player, -money);
        document.getElementsByClassName('player-icon')[player].src = characterIconsPath + 'michigan2.png';
    }

    else if (playerCharacters[player] == 12) {
        rockoed = true;
    }

    else if (playerCharacters[player] == 13){
        let money = parseInt(document.getElementsByClassName('money')[player].innerHTML.slice(1));
        moneyAfterWagers[player] = money * 2;
        addMoney(player, -money);
    }
}


function sendGameState(){
    let gameState;
    if (document.getElementById('board').style.display == 'none'){
        gameState = 'question';
    }
    else{
        gameState = 'board'
    }
    socket.emit('game state', ({gameState, room}));
}

function createPlayerAnswer(playerNum, answer){
    let tempButton = document.createElement("button");
    tempButton.onclick = function() {alert(answer)};
    tempButton.innerHTML = "Show Answer";
    tempButton.className = "btn btn-info";

    let playerButtons = document.getElementsByClassName("buttons");
    playerButtons[playerNum].append(tempButton);
}

async function powerPopUp(characterNum, playerNum){
    let tempDiv = document.createElement("div");
    tempDiv.id = "power-used";

    let tempImg = document.createElement("img");
    tempImg.src = characterIcons[characterNum];
    tempImg.className = "player-icon";
    
    let tempH1 = document.createElement("h1");
    tempH1.innerText = "Player " + (playerNum + 1) + " has activated a power!";

    tempDiv.append(tempImg);
    tempDiv.append(tempH1);
    document.body.append(tempDiv);

    await sleep(3000);
    tempDiv.remove();
}

async function confetti() {
    startConfetti();
    await sleep(3000); 
    stopConfetti();
} 

function removeBorder(){
    let players = document.getElementsByClassName('player');
    for (let x = 0; x < playerCount; x++){
        players[x].style.border = "";
    }
}

function nextPage(){
    let pages = document.getElementsByClassName('character-select');
    for (let i = 0; i < pages.length - 1; i++){
        if (pages[i].style.display == 'flex'){
            pages[i].style.display = 'none';
            pages[i+1].style.display = 'flex';
            break;
        }
    }
}

function backPage(){
    let pages = document.getElementsByClassName('character-select');
    for (let i = 1; i < pages.length; i++){
        if (pages[i].style.display == 'flex'){
            pages[i].style.display = 'none';
            pages[i-1].style.display = 'flex';
            break;
        }
    }
}

//Server Stuff



socket.on('create success', room => {
    document.getElementById('room-menu').style.display = 'none';
    document.getElementById('character-page-1').style.display = 'flex';
    document.getElementById('players').style.display = 'flex';
    

    let temp = document.getElementsByClassName('character-select');
    for (let i = 0; i < temp.length; i++){
        let text = document.createElement('h1');
        text.innerText = "Your room ID is " + room;
        temp[i].appendChild(text);
    }
    //document.getElementById('host-controls').style.display = 'block';
});
socket.on('create fail', room => {
    alert("room " + room + " already exists");
});

socket.on('character select', ({characterNum, buzzerNum, playerNum}) => {
    setPlayerCharacter(characterNum, playerNum);
    playerBuzzers[playerNum] = buzzerNum;
});

socket.on('buzz', ({playerNum, buzzerNum}) => {
    document.getElementsByClassName('player')[playerNum].style.border = "5px solid red";
    buzzedPlayers.push(playerNum);
    socket.emit('disable buzzer', room);
    
    let snd = new Audio(buzzerFiles[buzzerNum]);
    snd.play();
});

socket.on('power', ({characterNum, playerNum}) => {
    if (characterNum != 0 && characterNum != 12){
        powerPopUp(characterNum, playerNum);
    }
    useActivePower(playerNum);
});

socket.on('submit wager', ({playerNum, wagerAmount}) => {
    calculateWager(playerNum, wagerAmount);
});

socket.on('submit answer', ({playerNum, answer}) => {
    createPlayerAnswer(playerNum, answer);
});



function createRoom(){
    room = document.getElementById('create-roomid').value;
    socket.emit('create room', room);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}