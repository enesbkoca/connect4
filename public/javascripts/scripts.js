const socket = new WebSocket("ws://localhost:3000");
 

const nickname = 
socket.onmessage = function (event) {
    console.log("[LOG] Message from Server: " + event.data)
};

socket.onopen = function () {
    socket.send("Hello from the client!, ");
    console.log("Sending first message to server");
};