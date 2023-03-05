
const game = {
    player: null,
    turn: null,
    isContinuing: false,
}

const gameButtons = document.querySelectorAll('.fill');

// Send move to server
const sendMove = function (move) {

    if (!game.isContinuing) {
        alert("Game not started or finished")
    } else if (game.turn != game.player) { 
        alert("Not your turn")
    } else {
        let addToken = Messages.ADD_TOKEN
        addToken.data = move
        socket.send(JSON.stringify(addToken));
    }

    
}

// Attach event listener to every button on screen and call send move
gameButtons.forEach(function (item) {
    item.addEventListener('click', function () {
        const move = item.id.split(", ");
        sendMove(move);
    });
});