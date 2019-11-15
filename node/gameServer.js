
const Board = require("./board");

class GameServer{

    constructor(){
        this.id = require("crypto").randomBytes(10).toString("Base64");
        this.clients = [];
        this.board = new Board();
    }

    hasEnoughClients(){
        return this.clients.length === 2;
    }

    processClientMsg(client,msg){
        if(msg === "ready"){
            this.processReadyMsg(client);
        }else if(msg.startsWith("candraw")){
            this.processCanDrawMsg(msg);
        }
    }

    processReadyMsg(client){
        this.clients.push(client);
        if(this.clients.length === 2){
            // send clients random letter
            this.clients[0].sendUTF("start;x");
            this.clients[1].sendUTF("start;o");
            // choose random client to begin
            const randomLetter = ["x","o"][Math.floor(Math.random() * 2)];
            this.sendToClients(`turn;${randomLetter}`);
        }

    }

    processCanDrawMsg(msg){
        const req = msg.split(";");
        const letter = req[1];
        const x = req[2];
        const y = req[3];
        if(this.board.isEmptyAt(x,y)){
            this.sendToClients(`draw;${letter};${x};${y}`);
            this.board.addLetter(x,y,letter);
            // check if game is over
            const status = this.board.status();
            if(status === null){
                this.sendToClients(`turn;${letter === 'x' ? 'o' : 'x'}`);
            }else{
                this.finish(status);
            }
        }
    }

    finish(msg){
        this.sendToClients(msg);
        // close all connections
        this.clients[0].close();
        this.clients[1].close();
    }

    sendToClients(msg){
        this.clients[0].sendUTF(msg);
        this.clients[1].sendUTF(msg);
    }

}

module.exports = GameServer;
