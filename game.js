//@ts-check

// const websocket = require("ws");

var gameBoard = function() {
    this.boardState = [];

    for (let i = 0; i < 6; i++) {
        this.boardState.push(new Array(7).fill(0))
    }
}

gameBoard.prototype.columnsIsFull = function (col) {
    if (col > 7) {
        return new Error("Column exceeding board size");
    }

    return this.boardState[0][col] != 0;
}

gameBoard.prototype.addToken = function (player, col) {
    if (!this.columnsIsFull(col)) {
        
        let token;

        if (player == "A") {
            token = 1;    
        } else {
            token = 2;
        }


        for (let i = this.boardState.length - 1; i >= 0; i--) {
            if (this.boardState[i][col] == 0) {
                this.boardState[i][col] = token;
                return;
            }
        }

        

    } else {
        return new Error("Cannot add new token, columns is full")
    }
}

gameBoard.prototype.isGameOver = function () {

    // Check board to see if there is a winner, 
    // return the winner or draw if there's no winner and no possible moves

}

var game = function(gameID) {
    this.playerA = null;
    this.playerB = null;
    this.turn = "A";
    this.id = gameID
    this.gameState = "0 ONGOING";
    this.board = new gameBoard();
    this.finalStatus = null;
};


game.prototype.changeTurn = function () {
    // if (this.turn == this.playerA) {
    //     this.turn = this.playerB;
    // } else {
    //     this.turn = this.playerB;
    // }

    (this.turn == "A") ? this.turn = "B" : this.turn = "A";
    console.log('Turn for ' + this.turn);
}


game.prototype.transitionStates = {
    "0 ONGOING": 0,
    "1 ONGOING": 1,
    "2 ONGOING": 2,
    "DRAW": 3,
    "A": 4,
    "B": 5,
    "ABORTED": 6
};

game.prototype.transitionMatrix = [
    [0, 1, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 0, 0, 1],
    [0, 0, 0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
];

game.prototype.isValidTransition = function (from, to) {
    let i, j;

    if (!(from in game.prototype.transitionStates)) {
        return false;
    } else {
        i = game.prototype.transitionStates[from]
    }

    if (!(to in game.prototype.transitionStates)) {
        return false;
    } else {
        j = game.prototype.transitionStates[to];
    }

    return game.prototype.transitionMatrix[i][j] == 1;
};

game.prototype.isValidState = function (state) {
    return (state in game.prototype.transitionStates);
}

game.prototype.setStatus = function(new_state) {
    if (
        game.prototype.isValidState(new_state) &&
        game.prototype.isValidTransition(this.gameState, new_state)
    ) {
        this.gameState = new_state;
        console.log(`[LOG] State changed to ${new_state}`);
    } else {
        return new Error(`Impossible status change from ${this.gameState} to ${new_state}`);
    }

    if (this.gameState == "DRAW" || this.gameState == "A" || this.gameState == "B" || this.gameState == "ABORTED") {
        this.finalStatus = this.gameState;
    }
}

game.prototype.hasTwoPlayers = function () {
    const hasTwoBool = this.gameState == "2 ONGOING"
    console.log(`[LOG] Game has two players: ${hasTwoBool}`);
    return hasTwoBool;
}

game.prototype.addPlayer = function (player) {
    if (this.gameState != "0 ONGOING" && this.gameState != "1 ONGOING") {
        return new Error(`Can't add new player. Current game state: ${this.gameState}`
        );
    } 

    const error = this.setStatus("1 ONGOING");
    if (error instanceof Error) {
        this.setStatus("2 ONGOING")
    }

    if (this.playerA == null) {
        this.playerA = player;
        return "A";
    } else {
        this.playerB = player;
        return "B";
    }

};

module.exports = game