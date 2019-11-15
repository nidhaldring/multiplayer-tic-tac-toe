
class Board{

    constructor(){
        this.board = [[0,0,0],[0,0,0],[0,0,0]];
    }

    addLetter(x,y,letter){
        this.board[x][y] = letter;
    }

    isEmptyAt(x,y){
        return this.board[x][y] === 0;
    }

    status(){
        if(this.letterHasWon("x")){
            return "win;x";
        }else if(this.letterHasWon("o")){
            return "win;o";
        }else if(this.isFull()){
            return "tie";
        }
        return null;
    }

    isFull(){
        for(let i = 0;i < 3;++i){
            for(let j = 0;j < 3;++j){
                if(this.board[i][j] === 0){
                    return false;
                }
            }
        }
        return true;
    }

    letterHasWon(letter){
        return this.letterHasWonOnLines(letter) ||
                this.letterHasWonOnLeftSide(letter) ||
                this.letterHasWonOnRightSide(letter);
    }

    letterHasWonOnLines(letter){
        for(let i = 0;i < 3;++i){
            let vCount = 0;
            let hCount = 0;
            for(let j = 0;j < 3;++j){
                if(this.board[i][j] === letter){
                    vCount++;
                }
                if(this.board[j][i] === letter){
                    hCount++;
                }
            }
            if(hCount === 3 || vCount === 3){
                return true;
            }
        }
        return false;
    }

    letterHasWonOnLeftSide(letter){
        for(let i = 0;i < 3;++i){
            if(this.board[i][i] !== letter){
                return false;
            }
        }
        return true;
    }

    letterHasWonOnRightSide(letter){
        for(let i = 0;i < 3;++i){
            if(this.board[i][2-i] !== letter){
                return false;
            }
        }
        return true;
    }
}

module.exports = Board;
