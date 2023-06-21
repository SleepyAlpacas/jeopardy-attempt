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
});

socket.on('buzz', playerNum => {
    let snd = new Audio("test.mp3");
    snd.play();
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
    socket.emit('character select', ({characterNum, playerNum}));

    document.getElementById('power-uses').innerHTML = "Uses: " + playerPowerUses;
    document.getElementById('player-controls').style.display="flex";

}

function initCharacter(){
    if (characterNum == 1 || characterNum == 4){
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
}

function activatePower(){
    
}

async function confetti() {
    startConfetti();
    await sleep(3000); 
    stopConfetti();
} 

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}