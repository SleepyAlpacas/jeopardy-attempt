var questions = [];
var answers = [];
var row = 5;
var col = 6;
var numQuestions = row*col;
var currentQuestionRow = 999;
var currentQuestionCol = 99;
var currentQuestionMoney = 0;
var playerCount = 4;
var currentPlayerCount = 0;
var wagers = [];
var moneyAfterWagers = [];
var finalJeopardyAnswers = [];
var characterIconsPath = "images/";
var characterIcons = ['Mr._Happy.webp', 'Bump2.webp', 'Mr-nosey-5a.webp', 'Mr_Clever-6A.PNG.webp', 'Littlemissbossy.webp', 'Lucky1.webp', 'MR_WRONG_2A.PNG.webp', 'Little_Miss_Twins4.PNG.webp', 'Speedy_Gonzales.png', 'Slowpoke_Rodriguez.webp', 'Foghorn_Leghorn.png', 'Michigan_J._Frog.webp', 'Rocko_Wallaby.webp', 'Stimpy.webp', 'Robot_Krabs.webp', 'Pigs.webp', 'purin.webp', 'gudetama.png', 'Cinn.webp', 'christophernolan.png'];
var buzzerPath = "buzzers/";
var buzzerFiles = ['dolphin.mp3', 'flintmobile.mp3', 'subaluwa.mp3', 'headshake.mp3', 'pourwater.mp3', 'thunder.mp3', 'piano.mp3', 'yep.mp3', 'freeformjazz.mp3', 'tempura.mp3', 'yop.mp3', 'usb.mp3', 'animalcrossing.mp3', 'bowling.mp3', 'snakedies.mp3', 'kazooie.mp3'];
var playerCharacters = [];
var playerBuzzers = [];
var playerCorrectModifier = [];
var playerIncorrectModifier = [];
var playerCorrectBonus = [];
var playerPowerUses = [];
var correctPlayer = -1;

var rockoed = false;
//prisonerButtons format = [button, playerNum, button, playerNum]
var prisonerButtons = [];
var stimpyWagers = [];


//'ws://localhost:8080'
//'https://jeopardont.onrender.com'
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

for (let i = 0; i < row; i++){
    questions[i][0] = "<img class='question-img' src='0-" + i + "q.jpg'>";
    answers[i][0] = "<img class='question-img' src='0-" + i + "a.jpg'>";
    questions[i][5] = "<audio controls> <source src='5-" + i + ".mp3' type='audio/mp3'> </audio>"
}

questions[0][1]='Aquarium located at the base of the CN Tower';questions[1][1]="Self proclaimed \"Toronto's Majestic Castle\"";questions[2][1]="Huge international event for film snobs";questions[3][1]="Toronto's baseball stadium";questions[4][1]="Toronto's most well known historic marketplace is famous for its food (apparently)";
answers[0][1]="Ripley's Aquarium";answers[1][1]='Casa Loma';answers[2][1]='TIFF';answers[3][1]='Rogers Centre';answers[4][1]='St. Lawrence Market';

questions[0][2]='Name of this short Roman sword';questions[1][2]='Indian ring shaped throwing weapon';questions[2][2]='Chinese equivalent of a naginata or glaive';questions[3][2]='Name of a person who maintains the weapons and armors of a knight who also helps the knight get into his armor';questions[4][2]='Viking sword name';
answers[0][2]='Gladius';answers[1][2]='Chakram';answers[2][2]='Guandao/Yanyuedao';answers[3][2]='Page';answers[4][2]='Carolingian';

questions[0][3] = 'Name the currency of Zimbabwe';questions[1][3]="Name a bordering country of Zimbabwe";questions[2][3]="Name one of Zimbabwe's top 5 exports";questions[3][3]="Zimbabwe has 16 official languages which earned the country a world record at one point. Excluding English, name 1 official language.";questions[4][3]="Capital of Zimbabwe";
answers[0][3]="USD/Zimdollars (other answers may be accepted idk it's complicated)";
answers[1][3]="<ul><li>Mozambique</li><li>Zambia</li><li>Namibia</li><li>Botswana</li><li>South Africa</li></ul>";
answers[2][3]="<ol><li>Gold</li><li>Nickel Mattes</li><li>Raw Tobacco</li><li>Ferroalloys</li><li>Diamonds</li></ol>";
answers[3][3]="<ul><li>Chewa</li><li>Chibarwe</li><li>Kalanga</li><li>Koisan</li><li>Nambya</li><li>Ndau</li><li>Ndebele</li><li>Shangani</li></ul><ul><li>Shona</li><li>Sign Language</li><li>Sotho</li><li>Tonga</li><li>Tswana</li><li>Venda</li><li>Xhosa</li></ul>";
answers[4][3]="Harare";

questions[0][4]="The Sentra, Altima, and Pathfinder are made by which manufacturer?";questions[1][4]="Some highways have special sections during peak times called HOV Lanes. What does HOV stand for?";questions[2][4]="Italian luxury car manufacturer featuring a trident as its logo";questions[3][4]='A V8 engine has 8 of these';questions[4][4]='The first American produced Japanese car which became the best selling Japanese car in America for 15 straight years';
answers[0][4]="Nissan";answers[1][4]="High-Occupancy Vehicles";answers[2][4]="Maserati";answers[3][4]="Cylinders";answers[4][4]="Honda Accord";

answers[0][5]="Bounty";answers[1][5]="Pizza Nova";answers[2][5]="Sleep Country";answers[3][5]="Hakim Optical";answers[4][5]="Alarmforce";

questions[0][col] = "Including special Pikmins and the unreleased Pikmin 4, the Pikmin series has had 11 types of Pikmin. Name 6 types of Pikmin.";
answers[0][col] = "<ul><li>Red Pikmin</li><li>Yellow Pikmin</li><li>Blue Pikmin</li><li>Purple Pikmin</li><li>White Pikmin</li><li>Rock Pikmin</li></ul><ul><li>Winged Pikmin (Pink Pikmin)</li><li>Ice Pikmin</li><li>Glow Pikmin (Green Pikmin)</li><li>Bulbmin</li><li>Mushroom Pikmin</li></ul>";


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
    socket.emit('disable buzzer', room);
    let gameState = 'answer';
    socket.emit('game state', ({gameState, room}));
    document.getElementById('question-screen').style.display = 'none';
    document.getElementById('answer-screen').style.display = 'flex';
    let x = document.getElementsByClassName('buttons');
    for (let i = 0; i < x.length; i++){
        x[i].style.display = "none";
    }

    //check gudetama's power, can only be one gudetama per game
    if (playerCharacters.includes(17)){
        let gudeplayer = playerCharacters.indexOf(17);
        if (buzzedPlayers.includes(gudeplayer)){
            playerCorrectBonus[gudeplayer] = 0;
        }
        else{
            playerCorrectBonus[gudeplayer] += 25;
        }
    }

    buzzedPlayers = [];
    removeBorder();
    rockoed = false;
    stimpyWagers = [];
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
        if (stimpyWagers.length != 0 && stimpyWagers[player] != undefined){
            addMoney(player, stimpyWagers[player]);
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
        socket.emit('send playerCharacters', ({playerCharacters, room}));   
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

//fix any image powers
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
            let currentCell = x[(currentQuestionRow+1)*row+i];
            if (currentCell.nodeName == 'BUTTON' || currentCell.innerHTML == '' || currentCell.childNodes[0].src != "http://127.0.0.1:3002/" + characterIcons[7] ){
                break;
            }
            if (i == col-1){
                console.log("HORIZONTAL BRONGO");
                addMoney(player, 2500);
            }
        }
        for (let i = 1; i < row+1; i++){
            let currentCell = x[i*row+currentQuestionCol];
            if (currentCell.nodeName == 'BUTTON' || currentCell.innerHTML == '' || currentCell.childNodes[0].src != "http://127.0.0.1:3002/" + characterIcons[7]){
                break;
            }
            if (i == row){
                console.log("VERTICAL BRONGO");
                addMoney(player, 2500);
            }
        }
        if (col == row){ 
            if (currentQuestionCol == currentQuestionRow){
                for (let i = 0; i < row; i++){
                    let currentCell = x[row*(i+1) + i];
                    if (currentCell.nodeName == 'BUTTON' || currentCell.innerHTML == ''  || currentCell.childNodes[0].src != "http://127.0.0.1:3002/" + characterIcons[7]){
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
                    let currentCell = x[row*(i+1) - i];
                    if (currentCell.nodeName == 'BUTTON' || currentCell.innerHTML == '' || currentCell.childNodes[0].src != "http://127.0.0.1:3002/" + characterIcons[7]){
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
        let x = document.getElementsByClassName('player')[player].querySelector('img');
        x.src = characterIconsPath + "michigan2.png";
    }

    else if (playerCharacters[player] == 12) {
        rockoed = true;
    }

    else if (playerCharacters[player] == 13){
        let money = parseInt(document.getElementsByClassName('money')[player].innerHTML.slice(1));
        stimpyWagers[player] = money * 2;
        addMoney(player, -money);
    }

    else if (playerCharacters[player] == 16){
        document.getElementById('pause-screen').style.display = 'flex';
    }

    else if (playerCharacters[player] == 19){
        pause();
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

async function pause(){
    let pause = document.getElementById('pause-screen');
    pause.style.display = 'flex';
    socket.emit('disable buzzer', room);
    await sleep(5000);
    pause.style.display = 'none';
    if (document.getElementById('question-screen').style.display == 'flex'){
        socket.emit('enable valid buzzer', ({room, buzzedPlayers}));
    }
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

function prisonerDilemma(button, playerNum){
    prisonerButtons.push(button);
    prisonerButtons.push(playerNum);
    if (prisonerButtons.length == 4){
        let button1 = prisonerButtons[0];
        let player1 = prisonerButtons[1];
        let button2 = prisonerButtons[2];
        let player2 = prisonerButtons[3];

        if (button1 && button2){
            addMoney(player1, -100);
            addMoney(player2, -100);
        }
        else if (button1 ^ button2){
            if (button1){
                addMoney(player1, 500);
                addMoney(player2, -300);
            }
            else{
                addMoney(player2, 500);
                addMoney(player1, -300);
            }
        }
        else{
            addMoney(player1, 300);
            addMoney(player2, 300);
        }

        socket.emit('prisoner dilemma finish', room);
        prisonerButtons = [];
        document.getElementById('pause-screen').style.display = 'none';
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

socket.on('send prisoner button', ({button, playerNum}) => {
    prisonerDilemma(button, playerNum);
});

socket.on('request question', ({row, col, playerNum}) => {
    socket.emit('send question', ({question: questions[row][col], playerNum, room}));
});


function createRoom(){
    room = document.getElementById('create-roomid').value;
    socket.emit('create room', room);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}