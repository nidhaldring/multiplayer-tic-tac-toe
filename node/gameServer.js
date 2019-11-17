
const Board = require("./board");

class GameServer{

    constructor(gameServersHandler){
        // every msg (except for ready) sent to the game servers hanlder will include an id
        // to identify which game server shall hanle the request
        this.id = require("crypto").randomBytes(10).toString("Base64");
        this.clients = [];
        this.board = new Board();
        this.gameServersHandler = gameServersHandler;
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
            // send clients random letter and the id of the server
            this.clients[0].sendUTF(`start;x;${this.id}`);
            this.clients[1].sendUTF(`start;o;${this.id}`);
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
        this.clients[0].close();
        this.clients[1].close();
        // remove the reference of the object so that it can be garbage collected
        this.gameServersHandler.pop(this);
    }

    sendToClients(msg){
        this.clients[0].sendUTF(msg);
        this.clients[1].sendUTF(msg);
    }

}

module.exports = GameServer;
