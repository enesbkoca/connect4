// @ts-check

(function(exports){
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

    exports.BOARD = {
        type: "BOARD",
        data: null,
    }

}(typeof exports === "undefined" ? (this.Messages = {}) : exports));