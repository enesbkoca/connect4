const socket = new WebSocket("ws://localhost:3000");
 
buttons = document.querySelectorAll('.fill')


socket.onmessage = function (event) {
    console.log("[LOG] Message from Server: " + event.data)
    let board = JSON.parse(event.data)["boardState"].flat();

    for (let i = 0; i < buttons.length; i++) {
        if (board[i] == 1) {
            buttons[i].style.cssText = 'background-color: #e4cb58';
        } else if (board[i] == 2) {
            buttons[i].style.cssText = 'background-color: #19bc8b';
        }
    }

};

socket.onopen = function () {
    socket.send("Hello from the client!, ");
    console.log("Sending first message to server");
};

const sendMove = function (move) {
    socket.send(move);
}

document.querySelectorAll('.fill').forEach(function (item) {
    item.addEventListener('click', function () {
        console.log(`Pressed button at ${item.id}`);
        const move = item.id.split(", ");
        sendMove(move);



    });
});