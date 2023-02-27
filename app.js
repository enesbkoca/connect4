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

//property: websocket, value: game
let websockets = {};
let connectionID = 0;
let connected = 0;
let game_count = 0;

let currentGame = new Game(game_count++);

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
    
    con.on("close", function(code) {
        console.log(`${con["id"]} disconnected ...`);
        if (code == 1001) {
            const gameObj = websockets[con["id"]];

            if (gameObj.isValidTransition(gameObj.gameState, "ABORTED")) {
              gameObj.setStatus("ABORTED");
              try {
                gameObj.playerA.close();
                gameObj.playerA = null;
              } catch (e) {
                console.log("Player A closing: " + e);
              }
      
              try {
                gameObj.playerB.close();
                gameObj.playerB = null;
              } catch (e) {
                console.log("Player B closing: " + e);
              }

              connected--;
            }
          }
        });
    });

server.listen(port);