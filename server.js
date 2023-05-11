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



io.on('connection', (socket) => {
    console.log("connected");

    socket.on('test', (data) => {
        let uuid = new Date().getTime().toString();

        socket.join(parseInt(data));

        console.log("joined");

        socket.emit('send', uuid);
    })
})






server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})