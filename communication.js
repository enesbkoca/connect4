function sendMessage(currentGame, message, data) {
    message.data = data;
    currentGame.playerA.send(JSON.stringify(message));
    currentGame.playerB.send(JSON.stringify(message));
}