const socket = io('ws://localhost:8080');
var room;
var playerNum; //0 indexed
var characterNum;
var playerPowerUses;
var buzzerNum;
var buzzerPath = 'buzzers/';
var buzzerFiles = ['dolphin.mp3', 'flintmobile.mp3', 'subaluwa.mp3', 'headshake.mp3', 'pourwater.mp3', 'thunder.mp3', 'piano.mp3', 'gnote.mp3'];

for (let i = 0; i < buzzerFiles.length; i++){
    buzzerFiles[i] = buzzerPath + buzzerFiles[i];
}

socket.on('join success', ({room, player}) => {
    document.getElementById('room-menu').style.display = 'none';
    /*
    const text = document.createElement('h1');
    text.innerText = "You are player " + player;
    document.getElementById('display-room').appendChild(text);
    */
    playerNum = player - 1;
    //document.getElementById('player-controls').style.display = 'block';

    document.getElementById('character-page-1').style.display = 'flex';
    
    let headers = document.getElementsByClassName('character-select-header');
    for (let i = 0; i < headers.length; i++){
        headers[i].innerHTML = "Player " + player + " Select Your Character";
    }
});
socket.on('join fail', room=> {
    alert("room " + room + " doesn't exist");
});

/*
socket.on('correct answer', ()=>{
    alert("Player " + (buzzedPlayers[buzzedPlayers.length-1]+1) + " got it right");
    buzzedPlayers = [];
    enableBuzzer();
});
socket.on('incorrect answer', ()=>{
    alert("Player " + (buzzedPlayers[buzzedPlayers.length-1]+1) + " got it wrong");
    if (!buzzedPlayers.includes(playerNum)){
        enableBuzzer();
    }
})
*/
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
    console.log(playerNum);
    if (playerNum == this.playerNum){
        document.getElementById('money').innerHTML = "$" + money;
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
}

function initCharacter(){
    if (characterNum == 0){
        playerPowerUses = 1000;
        document.getElementById('power-uses').style.display = 'none';
    }
    else if (characterNum == 1 || characterNum == 4){
        playerPowerUses = 1;
    }
    else if (characterNum == 2){
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
    if (characterNum == 1){
        if (gameState == 'board'){
            powerButton.disabled = false;
        }
        else {
            powerButton.disabled = true;
        }
    }
    else if (characterNum == 2 || characterNum == 4){
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