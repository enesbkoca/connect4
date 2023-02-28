const express = require("express");
const http = require("http");
const websocket = require("ws");
const indexRouter = require("./routes/index");

const port = process.argv[2];
const app = express();

const messages = require("./public/javascripts/messages");

const server = http.createServer(app);
const wss = new websocket.Server({ server });

const Game = require("./game")

app.use(express.static(__dirname + "/public"));


app.get("/game", indexRouter);
app.get("/", indexRouter);

app.get("/connected", function (req, res) {
	res.json(connected);
}) 


//property: websocket, value: game
let websockets = {};
let connectionID = 0;
let connected = 0;
let game_count = 0;

let currentGame = new Game(game_count++);


setInterval(function () {
	for (let i in websockets) {
		if (Object.prototype.hasOwnProperty.call(websockets, i)) {
			let gameObj = websockets[i];
			// If the game has final status, delete the websocket
			if (gameObj.finalStatus != null) {
				delete websockets[i];
			}
		}
	}

}, 50000)


wss.on("connection", function connection(ws) {

  if (currentGame.hasTwoPlayers() || currentGame.gameState == 'ABORTED') {
    currentGame = new Game(game_count++);
    console.log(currentGame.gameState);
  }

    let con = ws;
    con.id = connectionID++;
    const playerType = currentGame.addPlayer(con)
    websockets[con["id"]] = currentGame;
    console.log('[LOG] Player ' + con["id"] + " placed in game " + currentGame.id + " as " + playerType)
    connected++;

    con.send(`You have been placed in game ${currentGame.id} as ${playerType}`)
    
  	con.on("message", function incoming(message) {
		console.log("Incoming messsage: " + message.toString());
		move = message.toString();
		let j = +move.split(",")[1];

		const gameObj = websockets[con["id"]];
		const player = gameObj.playerA == con ? "A" : "B";
		console.log(player, j)
		gameObj.board.addToken(player, j);
		console.log(gameObj.board);
		
		con.send(JSON.stringify(gameObj.board));

		// console.log(oMsg);

		// if (isPlayerA) {
		// 	console.log("Message from Player A");
		// } else {
		// 	console.log("Message from Player B")
		// }
	})

    con.on("close", function(code) {
        console.log(`${con["id"]} disconnected ...`);
		
		let numberOfPlayers = 0;
		
        if (code == 1001) {
            const gameObj = websockets[con["id"]];

            if (gameObj.isValidTransition(gameObj.gameState, "ABORTED")) {
              gameObj.setStatus("ABORTED"); 
			}

			try {
			gameObj.playerA.close();
			gameObj.playerA = null;
			numberOfPlayers++;
			} catch (e) {
			console.log("Player A closing: " + e);
			}
	
			try {
			gameObj.playerB.close();
			gameObj.playerB = null;
			numberOfPlayers++;
			} catch (e) {
			console.log("Player B closing: " + e);
			}

			connected -= numberOfPlayers;
            
          }
        });
    });

server.listen(port);