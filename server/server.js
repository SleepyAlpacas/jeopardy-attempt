const http = require('http').createServer();
const io = require('socket.io')(http, {
    cors: {origin: "*"}
});

io.on('connection', (socket)=>{
    console.log(socket.id);

    socket.on('create room', (room) => {
        if (!room) {
            socket.emit('create fail', room);
            return;
        }
        if (!io.sockets.adapter.rooms.get(room)){
            socket.join(room);
            socket.emit('create success', room);
        }
        else{
            socket.emit('create fail', room);
        }
    });

    socket.on('join room', (room) => {
        if (!room) {
            socket.emit('join fail', room);
            return;
        }
        if (io.sockets.adapter.rooms.get(room)){
            console.log(io.sockets.adapter.rooms.get(room).size);
            let player = io.sockets.adapter.rooms.get(room).size;
            socket.join(room);
            socket.emit('join success', ({room, player}));
        }
        else{
            socket.emit('join fail', room);
        }
    });

    socket.on('buzz', ({playerNum, buzzerNum, room}) => {
        io.to(room).emit('buzz', ({playerNum, buzzerNum}));
    });

    socket.on('correct answer', () =>{
        io.emit('correct answer');
    });

    socket.on('incorrect answer', () =>{
        io.emit('incorrect answer');
    });

    socket.on('disable buzzer', (room) => {
        io.to(room).emit('disable buzzer');
    });

    socket.on('enable valid buzzer', ({room, buzzedPlayers}) => {
        io.to(room).emit('enable valid buzzer', buzzedPlayers);
    });

    socket.on('character select', ({characterNum, buzzerNum, playerNum, room}) => {
        console.log(characterNum + " " + playerNum);
        console.log("HEY");
        io.to(room).emit('character select', ({characterNum, buzzerNum, playerNum}));
    });

    socket.on('power', ({characterNum, playerNum, room}) =>{
        io.to(room).emit('power', ({characterNum, playerNum}));
    });

    socket.on('game state', ({gameState, room}) => {
        io.to(room).emit('game state', gameState);
    });

    socket.on('update money', ({playerNum, money, room}) => {
        io.to(room).emit('update money', ({playerNum, money}));
    });

    socket.on('submit wager', ({playerNum, wagerAmount, room}) => {
        io.to(room).emit('submit wager', ({playerNum, wagerAmount}));
    });

    socket.on('wager screen', room => {
        io.to(room).emit('wager screen');
    });

    socket.on('submit answer', ({playerNum, answer, room}) => {
        io.to(room).emit('submit answer', ({playerNum, answer}));
    });

    socket.on('show final jeopardy', room => {
        io.to(room).emit('show final jeopardy');
    });

    socket.on('send playerCharacters', ({playerCharacters, room}) => {
        io.to(room).emit('send playerCharacters', playerCharacters);
    });

    socket.on('send prisoner challenge', ({opponentNum, room}) => {
        io.to(room).emit('send prisoner challenge', opponentNum);
    });

    socket.on('send prisoner button', ({button, playerNum, room}) => {
        io.to(room).emit('send prisoner button', ({button, playerNum}));
    });

    socket.on('prisoner dilemma finish', room => {
        io.to(room).emit('prisoner dilemma finish');
    });

    socket.on('request question', ({row, col, playerNum, room}) => {
        io.to(room).emit('request question', ({row, col, playerNum}));
    });

    socket.on('send question', ({question, playerNum, room}) => {
        io.to(room).emit('send question', ({question, playerNum}));
    });
});

io.listen(process.env.PORT || 8080);