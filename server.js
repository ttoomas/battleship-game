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
        rooms[roomId].roomId = roomId;
        rooms[roomId].creator = {};
        rooms[roomId].creator.playerId = socket.id;
        rooms[roomId].creator.name = playerName;
        rooms[roomId].players = {
            [socket.id]: playerName
        };
        rooms[roomId].positions = {
            [socket.id]: []
        };
        rooms[roomId].created = [false];

        console.log(rooms);
        
        socket.join(roomId);

        console.log("user1 joined");

        socket.emit('roomCreated', {roomId, playerName, playerId: socket.id});
    })

    socket.on('joinPlayer', (data) => {
        console.log('player name: ' + data.userName);

        if(
            !rooms[data.roomId] ||
            Object.keys(rooms[data.roomId].players).length >= 2
        ){
            socket.emit('joinRoomError');

            return;
        }

        roomId = data.roomId;

        const userInfo = {
            roomId: roomId,
            creatorName: rooms[roomId].creator.name,
            joinerName: data.userName,
            playerId: socket.id
        }

        
        rooms[roomId].players[socket.id] = data.userName;
        rooms[roomId].positions = {
            [socket.id]: []
        }
        rooms[roomId].created.push(false);

        socket.join(roomId);
        
        console.log(io.sockets.adapter.rooms.get(roomId));

        console.log('user2 joined');

        socket.emit('playerJoined', userInfo);
        socket.to(roomId).emit('joinedPlayer', userInfo);
    })


    socket.on('movePlayers-create', () => {
        // Move players from join section to create section (select ship positions)
        if(Object.values(rooms[roomId].players).length !== 2) return;

        io.to(roomId).emit('move-create');
    })

    socket.on('movePlayers-wait', (shipInfo) => {
        // rooms[roomId].ships[socket.id].coords = shipInfo.shipCoords;
        // rooms[roomId].ships[socket.id].positions = shipInfo.shipPositions;
        rooms[roomId].positions[socket.id] = shipInfo;

        console.log(rooms);

        rooms[roomId].created[0] === false ? rooms[roomId].created[0] = true : rooms[roomId].created[1] = true;

        const secondNameArr = {...rooms[roomId].players};
        delete secondNameArr[socket.id];
        const secondName = Object.values(secondNameArr)[0];
        

        const data = {
            playerName: rooms[roomId].players[socket.id],
            secondName: secondName
        }

        socket.emit('move-wait', data);

        if(rooms[roomId].created[1] === true){
            // Waiting for creator to start the game
            const data = {
                creatorName: rooms[roomId].creator.name,
                secondName: secondName
            }

            io.to(roomId).emit('wait-startScene', data);
            io.to(rooms[roomId].creator.playerId).emit('wait-startCreator');
        }
    })

    
    socket.on('movePlayers-game', () => {
        // let joinedPlayer = {...rooms[roomId]};

        // const data = {
        //     creator: rooms[roomId].positions[socket.id]
        // }

        // delete joinedPlayer.positions[socket.id];

        // data.joiner = Object.values(joinedPlayer.positions)[0];


        io.to(roomId).emit('move-game', rooms[roomId].positions);
    })


    // Disconnect
    socket.on('disconnect', () => {
        delete rooms[roomId];
    })
})






server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})