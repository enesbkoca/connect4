const socket = new WebSocket("ws://localhost:3000");

buttons = document.querySelectorAll('.fill')


socket.onmessage = function (event) {
    // console.log("[LOG] Message from Server: " + event.data)
    let msg = event.data;
    const {type, data} = JSON.parse(msg);
        if (type === "BOARD") {
        let board = data["boardState"].flat();

        for (let i = 0; i < buttons.length; i++) {
            if (board[i] == 1) {
                buttons[i].style.cssText = 'background-color: #e4cb58';
            } else if (board[i] == 2) {
                buttons[i].style.cssText = 'background-color: #19bc8b';
            }
        }
    } else {
        console.log("Invalid Message");
    }
};

socket.onopen = function () {

};

const sendMove = function (move) {
    let addToken = Messages.ADD_TOKEN
    addToken.data = move
    // console.log(addToken);
    socket.send(JSON.stringify(addToken));
}

document.querySelectorAll('.fill').forEach(function (item) {
    item.addEventListener('click', function () {
        console.log(`Pressed button at ${item.id}`);
        const move = item.id.split(", ");
        sendMove(move);
    });
});