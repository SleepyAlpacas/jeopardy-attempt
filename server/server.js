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

    socket.on('buzz', ({playerNum, room}) => {
        io.to(room).emit('buzz', playerNum);
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

    socket.on('character select', ({characterNum, playerNum}) => {
        console.log(characterNum + " " + playerNum);
        console.log("HEY");
        io.emit('character select', ({characterNum, playerNum}));
    });

});

http.listen(8080, () => console.log('listening on 8080'));