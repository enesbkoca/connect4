// @ts-check

(function(exports){

    // Game continiung
    exports.GAME_CONTINUING = {
        type: "GAME-CONTINUING",
        data: false
    };

    exports.GAME_TURN = {
        type: "GAME-TURN",
        data: null
    };
    
    exports.GAME_STATUS = {
        type: "GAME-STATUS",
        data: null
    };

    exports.GAME_WINNER = {
        type: "GAME-WINNER",
        data: null
    }

    exports.PLAYER_TYPE = {
        type: "PLAYER-TYPE",
        data: null
    };
    
    exports.ADD_TOKEN = {
        type: "ADD-TOKEN",
        data: null,
    };

    exports.BOARD_STATE = {
        type: "BOARD-STATE",
        data: null,
    };
    
// @ts-ignore
}(typeof exports === "undefined" ? (this.Messages = {}) : exports));