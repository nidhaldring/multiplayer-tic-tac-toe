

const express = require("express");
const http = require("http");
const WebSocketServer = require("websocket").server;
const GameServer = require("./gameServer");

const app = express();

app.use(express.static("./.."));

const httpServer = http.createServer(app).listen(5050,() => console.log("listenning ..."));

const webSocketServer = new WebSocketServer({httpServer});
const gameServer = new GameServer();

webSocketServer.on("request",(req) => {
    const conn = req.accept(null,"*");

    conn.on("message",(msgObject) => {
        gameServer.processClientMsg(conn,msgObject.utf8Data);
    });
});
