import express from "express";
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';

const app = express();
const server = createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 8090;

server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})