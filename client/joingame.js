const socket = io('ws://localhost:8080');
var room;
var playerNum; //0 indexed
var characterNum;
var playerPowerUses;


socket.on('join success', ({room, player}) => {
    document.getElementById('room-menu').style.display = 'none';
    /*
    const text = document.createElement('h1');
    text.innerText = "You are player " + player;
    document.getElementById('display-room').appendChild(text);
    */
    playerNum = player - 1;
    //document.getElementById('player-controls').style.display = 'block';

    document.getElementById('character-select').style.display = 'flex';
    document.getElementById('character-select-header').innerHTML = "Player " + player + " Select Your Character"
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

socket.on('buzz', playerNum => {
    let snd = new Audio("test.mp3");
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
    socket.emit('buzz', ({playerNum, room}));
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

    document.getElementById('character-select').style.display = "none";
    socket.emit('character select', ({characterNum, playerNum, room}));

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