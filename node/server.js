

const express = require("express");
const http = require("http");
const WebSocketServer = require("websocket").server;

const app = express();

app.use(express.static("./.."));

const httpServer = http.createServer(app).listen(5050,() => console.log("listenning ..."));

const webSocketServer = new WebSocketServer({httpServer});
const clients = [];
const board = [[0,0,0],[0,0,0],[0,0,0]]; // 0 => EMPTY ;

webSocketServer.on("request",(req) => {
    const conn = req.accept(null,"*");
    conn.on("message",(msgObject) => {
        processClientMessage(conn,msgObject.utf8Data);
    });
});


function processClientMessage(client,msg){
    if(msg === "ready"){
        processReadyMessage(client);
    }else if(msg.startsWith("candraw")){
        processCanDrawMessage(msg);
    }
}

function sendToClients(msg){
    clients[0].sendUTF(msg);
    clients[1].sendUTF(msg);
}

function processReadyMessage(client){
    clients.push(client);
    if(clients.length == 2){
        // send clients random letter
        clients[0].sendUTF("start;x");
        clients[1].sendUTF("start;o");
        // choose random client to begin
        const randomLetter = ["x","o"][Math.floor(Math.random() * 2)];
        sendToClients(`turn;${randomLetter}`);
    }
}

function processCanDrawMessage(msg){
    const req = msg.split(";");
    const letter = req[1];
    const x = req[2];
    const y = req[3];
    if(board[x][y] === 0){
        sendToClients(`draw;${letter};${x};${y}`);
        board[x][y] = letter;

        const res = checkBoard();
        if(res === null){
            sendToClients(`turn;${letter === 'x' ? 'o' : 'x'}`);
        }else{
            sendToClients(res);
        }
    }
}

function letterHasWonOnLines(letter){
    for(let i = 0;i < 3;++i){
        let vCount = 0;
        let hCount = 0;
        for(let j = 0;j < 3;++j){
            if(board[i][j] === letter){
                vCount++;
            }
            if(board[j][i] === letter){
                hCount++;
            }
        }
        if(hCount === 3 || vCount === 3){
            return true;
        }
    }
    return false;
}

function letterHasWonOnLeftSide(letter){
    for(let i = 0;i < 3;++i){
        if(board[i][i] !== letter){
            return false;
        }
    }
    return true;
}

function letterHasWonOnRightSide(letter){
    for(let i = 0;i < 3;++i){
        if(board[i][2-i] !== letter){
            return false;
        }
    }
    return true;
}

function letterHasWon(letter){
    return (letterHasWonOnLines(letter)||
            letterHasWonOnLeftSide(letter) ||
            letterHasWonOnRightSide(letter));
}

function boardIsFilled(){
    for(let i = 0;i < 3;++i){
        for(let j = 0;j < 3;++j){
            if(board[i][j] === 0){
                return false;
            }
        }
    }
    return true;
}

function checkBoard(){
    if(letterHasWon("x")){
        return "win;x";
    }else if(letterHasWon("o")){
        return "win;o";
    }else if(boardIsFilled()){
        return "tie";
    }
    return null;
}
