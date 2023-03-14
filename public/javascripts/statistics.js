const playersHeader = document.getElementById('connected_players');
const gameStatistics = document.getElementById('game_stats')
const gameStatus = document.getElementById('status')


function updatePlayerCount() {
    setTimeout(() => {
        axios
            .get("/connected")
            .then(function (res) {
                let nrPlayers = res.data;
                console.log('Number of connected players: ' + nrPlayers);
                showConnectedPlayers(nrPlayers);

            })
            .catch(function (err) {
                console.log(err);
            });
    updatePlayerCount()

    }, 500);
}

const showConnectedPlayers = function (connectedPlayers) {
    playersHeader.innerHTML = `Online Players: ${connectedPlayers}`;
}

const updateGameStatistics = function () {
    gameStatistics.innerHTML = `<h4> Player: ${game.player}</h4><h4> Turn: ${game.turn}</h4><h4> Continuing: ${game.isContinuing}</h4>`
    
}

const updateGameStatus = function () {
    gameStatus.innerHTML = `<h1>${game.status}</h1>`
}

updatePlayerCount();