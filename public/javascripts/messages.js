// @ts-check

(function(exports){
    exports.GAME_CONTINUING = {
        type: "GAME-CONTINUING",
        data: false
    };

    exports.GAME_TURN = {
        type: "GAME-TURN",
        data: ""
    }

    exports.T_PLAYER_TYPE = "PLAYER-TYPE";
    exports.O_PLAYER_A = {
        type: exports.T_PLAYER_TYPE,
        data: "A",
    };
    exports.S_PLAYER_A = JSON.stringify(exports.O_PLAYER_A);

    /*
    * Server to client: set as player B
    */
    exports.O_PLAYER_B = {
        type: exports.T_PLAYER_TYPE,
        data: "B",
    };
    exports.S_PLAYER_B = JSON.stringify(exports.O_PLAYER_B);

    exports.ADD_TOKEN = {
        type: "ADD-TOKEN",
        data: null,
    }

    exports.BOARD_STATE = {
        type: "BOARD-STATE",
        data: null,
    }

// @ts-ignore
}(typeof exports === "undefined" ? (this.Messages = {}) : exports));