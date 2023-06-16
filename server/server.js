const http = require('http').createServer();
const io = require('socket.io')(http, {
    cors: {origin: "*"}
});

io.on('connection', (socket)=>{
    console.log(socket.id);

    socket.on('create room', (room) => {
        if (!io.sockets.adapter.rooms.get(room)){
            socket.join(room);
            socket.emit('create success', room);
        }
        else{
            socket.emit('create fail', room);
        }
    });

    socket.on('join room', (room) => {
        console.log(io.sockets.adapter.rooms.get(room).size);
        if (io.sockets.adapter.rooms.get(room)){
            let player = io.sockets.adapter.rooms.get(room).size;
            socket.join(room);
            socket.emit('join success', ({room, player}));
        }
        else{
            socket.emit('join fail', room);
        }
    });

    socket.on('buzz', (playerNumber) => {
        io.emit('buzz', playerNumber);
    });

    socket.on('correct answer', () =>{
        io.emit('correct answer');
    });

    socket.on('incorrect answer', () =>{
        io.emit('incorrect answer');
    });

    socket.on('character select', ({characterNum, playerNum}) => {
        console.log(characterNum + " " + playerNum);
        console.log("HEY");
        io.emit('character select', ({characterNum, playerNum}));
    });
});

http.listen(8080, () => console.log('listening on 8080'));