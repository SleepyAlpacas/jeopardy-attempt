const socket = io('ws://localhost:8080');
var room;
var playerNum; //0 indexed
var characterNum;
var playerPowerUses;
var buzzerNum;
var buzzerPath = 'buzzers/';
var buzzerFiles = ['dolphin.mp3', 'flintmobile.mp3', 'subaluwa.mp3', 'headshake.mp3', 'pourwater.mp3', 'thunder.mp3', 'piano.mp3', 'yep.mp3', 'freeformjazz.mp3', 'tempura.mp3', 'yop.mp3', 'usb.mp3', 'animalcrossing.mp3', 'bowling.mp3', 'snakedies.mp3', 'kazooie.mp3'];
var characterIconsPath = "images/";
var characterIcons = ['Mr._Happy.webp', 'Bump2.webp', 'Mr-nosey-5a.webp', 'Mr_Clever-6A.PNG.webp', 'Littlemissbossy.webp', 'Lucky1.webp', 'MR_WRONG_2A.PNG.webp', 'Little_Miss_Twins4.PNG.webp', 'Speedy_Gonzales.png', 'Slowpoke_Rodriguez.webp', 'Foghorn_Leghorn.png', 'Michigan_J._Frog.webp', 'Rocko_Wallaby.webp', 'Stimpy.webp', 'Robot_Krabs.webp', 'Pigs.webp', 'purin.webp', 'gudetama.png', 'Cinn.webp'];
var playerCharacters = [];

for (let i = 0; i < buzzerFiles.length; i++){
    buzzerFiles[i] = buzzerPath + buzzerFiles[i];
}

for (let i = 0; i < characterIcons.length; i++){
    characterIcons[i] = characterIconsPath + characterIcons[i];
}

socket.on('join success', ({room, player}) => {
    document.getElementById('room-menu').style.display = 'none';
    playerNum = player - 1;

    document.getElementById('character-page-1').style.display = 'flex';
    
    let headers = document.getElementsByClassName('character-select-header');
    for (let i = 0; i < headers.length; i++){
        headers[i].innerHTML = "Player " + player + " Select Your Character";
    }
});
socket.on('join fail', room=> {
    alert("room " + room + " doesn't exist");
});


socket.on('disable buzzer', () => {
    disableBuzzer();
});
socket.on('enable valid buzzer', (buzzedPlayers) => {
    if (!buzzedPlayers.includes(playerNum)){
        enableBuzzer();
    }
    else{
        checkActivePowerDisabled('answer');
    }
});

socket.on('buzz', ({playerNum, buzzerNum}) => {
    let snd = new Audio(buzzerFiles[buzzerNum]);
    snd.play();
    if (playerNum == this.playerNum){
        checkActivePowerDisabled('buzz');
    }
});

socket.on('game state', gameState => {
    checkActivePowerDisabled(gameState);
})

socket.on('update money', ({playerNum, money}) => {
    if (playerNum == this.playerNum){
        document.getElementById('money').innerHTML = "$" + money;
    }
});

socket.on('wager screen', () => {
    document.getElementById('player-controls').style.display = 'none';
    document.getElementById('wager-screen').style.display = 'flex';
});

socket.on('show final jeopardy', () => {
    document.getElementById('final-jeopardy-screen').style.display = 'flex';
});

socket.on('send playerCharacters', playerCharacters => {
    this.playerCharacters = playerCharacters;
});

socket.on('send prisoner challenge', opponentNum =>{
    console.log(opponentNum);
    if (playerNum == parseInt(opponentNum)){
        document.getElementById('player-controls').style.display = 'none';
        document.getElementById('prisoner-dilemma-screen').style.display = 'block';
        document.getElementById('prisoner-buttons').style.display = 'flex';
    }
});


function joinRoom(){
    room = document.getElementById('join-roomid').value;
    socket.emit('join room', room);
}

function buzz(){
    socket.emit('buzz', ({playerNum, buzzerNum, room}));
}

function disableBuzzer(){
    document.getElementById('buzzer').disabled = true;
}

function enableBuzzer(){
    document.getElementById('buzzer').disabled = false;
}

function correctAnswer(){
    socket.emit('correct answer');
}

function incorrectAnswer(){
    socket.emit('incorrect answer');
}

function setPlayerCharacter(characterNum){
    this.characterNum = characterNum;
    initCharacter();
    checkActivePowerVisibility();

    let pages = document.getElementsByClassName('character-select');
    for (let i = 0; i < pages.length; i++){
        pages[i].style.display = "none";
    }

    document.getElementById('buzzer-page-1').style.display="flex";
}

function setBuzzerNum(buzzerNum){
    this.buzzerNum = buzzerNum;
    socket.emit('character select', ({characterNum, buzzerNum, playerNum, room}));

    let pages = document.getElementsByClassName('buzzer-select');
    for (let i = 0; i < pages.length; i++){
        pages[i].style.display = "none";
    }

    document.getElementById('player-controls').style.display="flex";
    document.getElementById('buzzer').disabled = true;
    document.getElementById('money').style.display = "block";
}

function initCharacter(){
    if (characterNum == 0){
        playerPowerUses = 1000;
        document.getElementById('power-uses').style.display = 'none';
    }
    else if (characterNum == 1 || characterNum == 4 || characterNum == 11){
        playerPowerUses = 1;
    }
    else if (characterNum ==  12|| characterNum == 13 || characterNum == 14 || characterNum == 16){
        playerPowerUses = 2;
    }
    else if (characterNum == 2 || characterNum == 10){
        playerPowerUses = 3;
    }
    else{
        playerPowerUses = 0;
    }
}

function checkActivePowerVisibility(){
    if (playerPowerUses <= 0){
        document.getElementById('power-div').style.display = 'none';
    } 
    else{
        document.getElementById('power-uses').innerHTML = "Uses: " + playerPowerUses;
    }
}

function checkActivePowerDisabled(gameState){
    if (playerPowerUses <= 0){
        return;
    }

    console.log(gameState);
    let powerButton = document.getElementById('power-button');
    if (characterNum == 1 || characterNum == 11 || characterNum == 12 || characterNum == 13){
        if (gameState == 'board'){
            powerButton.disabled = false;
            if (characterNum == 13 && parseInt(document.getElementById('money').innerHTML.slice(1)) < 0){
                powerButton.disabled = true;
            }
        }
        else {
            powerButton.disabled = true;
        }
    }
    else if (characterNum == 2 || characterNum == 4 || characterNum == 10 || characterNum == 14){
        if (gameState == 'buzz'){
            powerButton.disabled = false;
        }
        else {
            powerButton.disabled = true;
        }
    }
}

function activatePower(){
    socket.emit('power', ({characterNum, playerNum, room}));
    playerPowerUses--;
    checkActivePowerVisibility();

    if (characterNum == 0){
        confettiTimeout();
    }
    if (characterNum == 16){
        createPrisonerScreen();
    }
}

function submitWager(){
    let wagerAmount = parseInt(document.getElementById('wager-box').value);
    let currentMoney = parseInt(document.getElementById('money').innerHTML.slice(1));
    if (wagerAmount > currentMoney || (currentMoney <= 0 && wagerAmount != 0) || !String(wagerAmount).match(/^[0-9]+$/)){
            alert('invalid wager');
            return;
    }
    socket.emit('submit wager', ({playerNum, wagerAmount, room}));
    document.getElementById('wager-screen').style.display = 'none';
}

function submitAnswer(){
    let answer = document.getElementById('answer-box').value;
    socket.emit('submit answer', ({playerNum, answer, room}));
    document.getElementById('final-jeopardy-screen').style.display = 'none';
}

function nextPage(className){
    let pages = document.getElementsByClassName(className);
    for (let i = 0; i < pages.length - 1; i++){
        if (pages[i].style.display == 'flex'){
            pages[i].style.display = 'none';
            pages[i+1].style.display = 'flex';
            break;
        }
    }
}

function backPage(className){
    let pages = document.getElementsByClassName(className);
    for (let i = 1; i < pages.length; i++){
        if (pages[i].style.display == 'flex'){
            pages[i].style.display = 'none';
            pages[i-1].style.display = 'flex';
            break;
        }
    }
}

function createPrisonerScreen(){
    document.getElementById('player-controls').style.display = 'none';
    document.getElementById('prisoner-dilemma-screen').style.display = 'block';
    let playerDiv = document.getElementById('player-select');
    playerDiv.style.display = 'flex';
    for (let i = 0; i < playerCharacters.length; i++){
        if (i == playerNum){
            continue;
        }

        let tempButton = document.createElement('button');
        tempButton.className = 'character';
        tempButton.addEventListener("click", function() {sendPrisonerChallenge(i)});

        let tempH1 = document.createElement('h1');
        tempH1.innerText = "Player " + (i+1);
        
        let tempDiv = document.createElement('div');
        tempDiv.className = 'break';

        let tempImg = document.createElement('img');
        tempImg.src = characterIcons[playerCharacters[i]];
        tempImg.className = 'character-icon';

        tempButton.append(tempH1);
        tempButton.append(tempDiv);
        tempButton.append(tempImg);
        playerDiv.append(tempButton);
    }
}

function sendPrisonerChallenge(opponentNum){
    socket.emit('send prisoner challenge', ({opponentNum, room}));
    document.getElementById('player-select').style.display = 'none';
    document.getElementById('prisoner-buttons').style.display = 'flex';
}

async function confetti() {
    startConfetti();
    await sleep(3000); 
    stopConfetti();
}

async function confettiTimeout(){
    let powerButton = document.getElementById('power-button');
    powerButton.disabled = true;
    await sleep(60000);
    powerButton.disabled = false;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}