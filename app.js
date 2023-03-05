//@ts-check

const express = require("express");
const http = require("http");
const websocket = require("ws");
const indexRouter = require("./routes/index");

const port = process.argv[2];
const app = express();

const messages = require("./public/javascripts/messages");
const {sendMessage} = require('./communication.js');

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


// Delete empty websockets in a certain time interval
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

    let con = ws;
    con.id = connectionID++;
    const playerType = currentGame.addPlayer(con)
    websockets[con["id"]] = currentGame;
    console.log('[LOG] Player ' + con["id"] + " placed in game " + currentGame.id + " as " + playerType)
    connected++;

	// Senb player information
	sendMessage(currentGame, messages.PLAYER_TYPE, playerType, playerType);
	// setTimeout(sendMessage, 1000, currentGame, messages.PLAYER_TYPE, playerType, playerType);

	if (currentGame.hasTwoPlayers()) {
		// Start game and set turn
		sendMessage(currentGame, messages.GAME_CONTINUING, true);
		sendMessage(currentGame, messages.GAME_TURN, currentGame.turn);

		// Create a new game because previous one started
		currentGame = new Game(game_count++);
		console.log(currentGame.gameState);

	  } else if (currentGame.gameState == 'ABORTED') {
		// Create a new game because previous one aborted
		currentGame = new Game(game_count++);
		console.log(currentGame.gameState);
	  }
	

  	con.on("message", function incoming(message) {
		// console.log("Incoming messsage: " + JSON.parse(message));
		
		const {type, data} = JSON.parse(message);
		console.log(type);
		console.log(data);
		
		if (type === "ADD-TOKEN") {
			const gameObj = websockets[con["id"]];
			const player = gameObj.playerA == con ? "A" : "B";
			if (player != gameObj.turn) {
				console.log(`Player ${player} cannot add token to row ${j}, not their turn`);
			} else {
				const j = data[1];
				console.log(`Player ${player} adding token to row ${j}`);
				
				gameObj.board.addToken(player, j);
				sendMessage(gameObj, messages.BOARD_STATE, gameObj.board.boardState)
				
				gameObj.changeTurn();
				sendMessage(gameObj, messages.GAME_TURN, gameObj.turn);
			}
		}
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
			sendMessage(gameObj, messages.GAME_CONTINUING, false, "A")
			gameObj.playerA.close();
			gameObj.playerA = null;
			numberOfPlayers++;
			} catch (e) {
			console.log("Player A closing: " + e);
			}
	
			try {
			sendMessage(gameObj, messages.GAME_CONTINUING, false, "B")
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