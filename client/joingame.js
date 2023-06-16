const socket = io('ws://localhost:8080');
var room;
var playerNum;
var buzzedPlayers = [];

socket.on('create success', room => {
    document.getElementById('room-menu').style.display = 'none';
    const text = document.createElement('h1');
    text.innerText = "Your room ID is " + room;
    document.getElementById('display-room').appendChild(text);
    document.getElementById('host-controls').style.display = 'block';
});
socket.on('create fail', room => {
    alert("room " + room + " already exists");
});
socket.on('join success', ({room, player}) => {
    document.getElementById('room-menu').style.display = 'none';
    const text = document.createElement('h1');
    text.innerText = "You are player " + player;
    playerNum = player - 1;
    document.getElementById('display-room').appendChild(text);
    document.getElementById('player-controls').style.display = 'block';
    document.getElementById('character-select').style.display = 'flex';
});
socket.on('join fail', room=> {
    alert("room " + room + " doesn't exist");
});
socket.on('buzz', playerNum => {
    alert("player " + (playerNum+1) + " Buzzed!");
    disableBuzzer();
    buzzedPlayers.push(playerNum);
});
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

function createRoom(){
    room = document.getElementById('create-roomid').value;
    socket.emit('create room', room);
}

function joinRoom(){
    room = document.getElementById('join-roomid').value;
    socket.emit('join room', room);
}

function buzz(){
    socket.emit('buzz', playerNum);
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
    document.getElementById('character-select').style.display = "none";
    socket.emit('character select', ({characterNum, playerNum}));
}