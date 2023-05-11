import express from "express";
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';

const app = express();
const server = createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 8090;

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, ('res'))));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/res/index.html');
})



// ROOMS
const rooms = {};

io.on('connection', (socket) => {
    console.log("connected");
    console.log(rooms);

    let roomId = 1;

    socket.on('createRoom', (playerName) => {
        roomId = new Date().getTime().toString();
        
        rooms[roomId] = {};
        rooms[roomId].players = [socket.id];

        console.log(rooms);
        
        socket.join(roomId);

        console.log("user1 joined");

        socket.emit('roomCreated', roomId);
    })

    socket.on('joinPlayer', (data) => {
        console.log('player name: ' + data.userName);

        if(
            !rooms[data.roomId] ||
            rooms[data.roomId].players.length >= 2
        ){
            socket.emit('joinRoomError');

            return;
        }

        rooms[data.roomId].players.push(socket.id);

        socket.join(parseInt(data.roomId));

        console.log('user2 joined');

        socket.emit('playerJoined');
        io.to(data.roomId).emit('allPlayersIn');
    })


    // Disconnect
    socket.on('disconnect', () => {
        delete rooms[roomId];
    })
})






server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})