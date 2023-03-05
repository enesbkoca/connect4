const playersHeader = document.getElementById('connected_players');
const gameStats = document.getElementById('game_stats')

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
    gameStats.innerHTML = `<h4> Player: ${game.player}</h4><h4> Turn: ${game.turn}</h4><h4> Continuing: ${game.isContinuing}</h4>`
}

updatePlayerCount();