
const serverURL  = "ws://127.0.0.1:5050/api";
const socket = new WebSocket(serverURL); // start connection

let _letter = null;
let turn = false;

function sendToServer(msg){
    if(socket.readyState !== 1){
        console.log("connection ended");
    }
    socket.send(msg);
}

function sendDrawRequest(x,y){
    sendToServer(`candraw;${_letter};${x};${y}`);
}

function sendTurnRequest(){
    sendToServer(`turn;${letter}`);
}

function processMessage(msg){
    if(msg.startsWith("start")){
        processStartMessage(msg);
    }else if(msg.startsWith("draw")){
        processDrawMessage(msg);
    }else if(msg.startsWith("turn")){
        processTurnMessage(msg);
    }else if(msg.startsWith("win")){
        processWonMessage(msg);
    }else if(msg.startsWith("tie")){
        processTieMessage();
    }
}

function processStartMessage(msg){
    _letter = msg.split(";")[1];
    drawBoard();
    setUpCanvas();
}

function processDrawMessage(msg){
    const req = msg.split(";");
    const letter = req[1];
    const x = req[2];
    const y = req[3];
    drawLetter(letter,x,y);
    turn = false;
}

function processTurnMessage(msg){
    turn = (msg.split(";")[1] === _letter);
    const statusBar = document.getElementById("statusBar");
    if(turn){
        statusBar.innerText = "Your Turn !";
    }else{
        statusBar.innerText = "Other Player Turn";
    }
}

function processWonMessage(msg){
    const winner = msg.split(";")[1];
    const statusBar = document.getElementById("statusBar");
    if(_letter === winner){
        statusBar.innerText = "You've won !!!";
    }else{
        statusBar.innerText = "You've lost !";
    }

    socket.close();
}

function processTieMessage(){
    document.getElementById("statusBar").innerText = " TIE !";
    socket.close();
}

// setting up socket events

socket.onmessage = (msgObject) => {
    const msg = msgObject.data;
    processMessage(msg);
}

socket.onerror = (err) => {
    throw err;
}

// initiate the game
socket.onopen = () => {
    console.log("sent ready request ");
    socket.send("ready");
}
