
const serverURL  = "ws://127.0.0.1:5050";
const socket = new WebSocket(serverURL); // start connection

let _letter = null;
let _serverId = null;
let turn = false;

function sendToServer(msg){
    if(socket.readyState !== 1){
        console.log("connection ended");
    }
    socket.send(msg);
}

function sendDrawRequest(x,y){
    sendToServer(`candraw;${_letter};${x};${y};${_serverId}`);
}

function sendTurnRequest(){
    sendToServer(`turn;${letter};${_serverId}`);
}

function processMsg(msg){
    if(msg.startsWith("start")){
        processStartMsg(msg);
    }else if(msg.startsWith("draw")){
        processDrawMsg(msg);
    }else if(msg.startsWith("turn")){
        processTurnMsg(msg);
    }else if(msg.startsWith("win")){
        processWonMsg(msg);
    }else if(msg.startsWith("tie")){
        processTieMsg();
    }
}

function processStartMsg(msg){
    let _;
    [_,_letter,_serverId] = msg.split(";");
    drawBoard();
    setUpCanvas();
}

function processDrawMsg(msg){
    let [_,letter,x,y] = msg.split(";");
    drawLetter(letter,x,y);
    turn = false;
}

function processTurnMsg(msg){
    turn = (msg.split(";")[1] === _letter);
    const statusBar = document.getElementById("statusBar");
    if(turn){
        statusBar.innerText = "Your Turn !";
    }else{
        statusBar.innerText = "Other Player Turn";
    }
}

function processWonMsg(msg){
    const winner = msg.split(";")[1];
    const statusBar = document.getElementById("statusBar");
    if(_letter === winner){
        statusBar.innerText = "You've won !!!";
    }else{
        statusBar.innerText = "You've lost !";
    }

    socket.close();
}

function processTieMsg(){
    document.getElementById("statusBar").innerText = " TIE !";
    socket.close();
}

// setting up socket events

socket.onmessage = (msgObject) => {
    const msg = msgObject.data;
    processMsg(msg);
}

socket.onerror = (err) => {
    throw err;
}

// initiate the game
socket.onopen = () => {
    socket.send("ready");
}
