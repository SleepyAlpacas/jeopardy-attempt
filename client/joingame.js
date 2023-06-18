const socket = io('ws://localhost:8080');
var room;
var playerNum; //0 indexed
var buzzedPlayers = [];


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
    document.getElementById('character-select').style.display = "none";
    socket.emit('character select', ({characterNum, playerNum}));
    document.getElementById('player-controls').style.display="flex";
}