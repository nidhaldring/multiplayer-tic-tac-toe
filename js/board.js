
// sets up all drawing related functions

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function drawImage(name,x,y){
    const img = new Image();
    img.src = "imgs/" + name;
    img.onload = () => {
        ctx.drawImage(img,x,y);
    }
}


function drawBoard(){
    drawImage("board.png",0,0);
}

function drawLetter(letter,x,y){
    const letterX = (x * 200) + 15;
    const letterY = (y * 200) + 25;
    drawImage(letter + ".png",letterX,letterY);
}

function setUpCanvas(){
    canvas.onclick = (event) => {
        if(turn){
            let {top,left} = canvas.getBoundingClientRect();
            const boardX = event.clientX - left;
            const boardY = event.clientY - top;
            sendDrawRequest(Math.floor(boardX / 200),Math.floor(boardY / 200));
        }
    }
}
