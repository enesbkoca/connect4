//@ts-check

function sendMessage(currentGame, message, data, player=null) {
    message.data = data;
    if (player === "A") {
        currentGame.playerA.send(JSON.stringify(message));
    }
    else if (player === "B") {
        currentGame.playerB.send(JSON.stringify(message));
    } else {
        currentGame.playerA.send(JSON.stringify(message));
        currentGame.playerB.send(JSON.stringify(message));
    }
}

exports.sendMessage = sendMessage;