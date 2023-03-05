//@ts-check

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


	if (currentGame.hasTwoPlayers()) {
		
		let startedMsg = messages.GAME_CONTINUING
		startedMsg.data = true;
		currentGame.playerA.send(JSON.stringify(startedMsg));
		currentGame.playerB.send(JSON.stringify(startedMsg));

		let turnMsg = messages.GAME_TURN;
		turnMsg.data = "A";
		currentGame.playerA.send(JSON.stringify(turnMsg))
		currentGame.playerB.send(JSON.stringify(turnMsg))

		currentGame = new Game(game_count++);
		console.log(currentGame.gameState);

	  } else if (currentGame.gameState == 'ABORTED') {
		currentGame = new Game(game_count++);
		console.log(currentGame.gameState);
	  }
	
	
    // con.send(`You have been placed in game ${currentGame.id} as ${playerType}`)
	con.send((playerType == "A" ? messages.S_PLAYER_A : messages.S_PLAYER_B));

  	con.on("message", function incoming(message) {
		// console.log("Incoming messsage: " + JSON.parse(message));
		
		const {type, data} = JSON.parse(message);
		console.log(type);
		console.log(data);
		
		if (type === "ADD-TOKEN") {
			const gameObj = websockets[con["id"]];
			const player = gameObj.playerA == con ? "A" : "B";
			console.log("Current player: " + player)
			console.log("Turn of  " + gameObj.turn)
			if (player != gameObj.turn) {
				console.log('Not your turn')
			} else {
				const j = data[1];
				
				gameObj.board.addToken(player, j);
				let boardMsg = messages.BOARD_STATE;
				boardMsg.data = gameObj.board.boardState;
				gameObj.playerA.send(JSON.stringify(boardMsg));
				gameObj.playerB.send(JSON.stringify(boardMsg));
				gameObj.
				
				changeTurn();
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
			
			let startedMsg = messages.GAME_CONTINUING
			startedMsg.data = false;
		
			try {
			gameObj.playerA.send(JSON.stringify(startedMsg));
			gameObj.playerA.close();
			gameObj.playerA = null;
			numberOfPlayers++;
			} catch (e) {
			console.log("Player A closing: " + e);
			}
	
			try {
			gameObj.playerB.send(JSON.stringify(startedMsg));
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