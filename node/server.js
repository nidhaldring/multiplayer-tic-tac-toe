

const express = require("express");
const http = require("http");
const WebSocketServer = require("websocket").server;
const GameServersHandler = require("./gameServersHandler");

const app = express();

app.use(express.static("./.."));

const httpServer = http.createServer(app).listen(5050,() => console.log("listenning ..."));

const webSocketServer = new WebSocketServer({httpServer});
const proxy = new GameServersHandler();

webSocketServer.on("request",(req) => {
    const conn = req.accept(null,"*");

    conn.on("message",(msgObject) => {
        proxy.process(conn,msgObject.utf8Data);
    });
});
