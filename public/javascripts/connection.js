const socket = new WebSocket("ws://localhost:3000");




socket.onmessage = function (event) {
    console.log("[LOG] Message from Server: " + event.data)
    let msg = event.data;
    
    const {type, data} = JSON.parse(msg);

        if (type === "BOARD-STATE") {
        let board = data.flat();

        for (let i = 0; i < gameButtons.length; i++) {
            if (board[i] == 1) {
                gameButtons[i].style.cssText = 'background-color: #e4cb58';
            } else if (board[i] == 2) {
                gameButtons[i].style.cssText = 'background-color: #19bc8b';
            }
        }

    } else if (type === "GAME-CONTINUING") {
        game.isContinuing = data;
        console.log("Game continuing: " + game.isContinuing);

    } else if (type === "PLAYER-TYPE") {
        game.player = data;
        console.log("You are player " + game.player)

    } else if (type === "GAME-TURN") {
        game.turn = data;

    } else {
        console.log("Invalid Message");
    } 

    updateGameStatistics();
};


socket.onopen = function () {

};


