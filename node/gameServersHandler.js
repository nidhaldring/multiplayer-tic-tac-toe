

// this is the single entry to the system
// process any msg sent to the server
// and decicdes to which game server shall handle the msg

const GameServer = require("./gameServer");

class GameServersHandler{

    constructor(){
        this.servers = new Map();
        this.lastServer = null;
    }

    process(client,msg){
        if(msg === "ready"){
            if(this.lastServer === null){
                // if the server is launched for the first time
                // meaning : this is a ready request
                this.lastServer = this.createNewGameServer();
                this.lastServer.processClientMsg(client,msg);
            }else if(!this.lastServer.hasEnoughClients()){
                // this is another ready request
                this.lastServer.processClientMsg(client,msg);
            }else{
                this.lastServer = this.createNewGameServer();
                this.lastServer.processClientMsg(client,msg);
            }
        }else{
            const serverId = msg.substr(msg.lastIndexOf(";") + 1);
            this.servers.get(serverId).processClientMsg(client,msg.substr(0,msg.lastIndexOf(";")));
        }

    }

    createNewGameServer(){
        const server = new GameServer(this);
        this.push(server);
        return server;
    }

    push(server){
        this.servers.set(server.id,server);
    }

    pop(server){
        this.servers.delete(server.id);
    }

}

module.exports = GameServersHandler;
