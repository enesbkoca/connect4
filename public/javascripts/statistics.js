const playersHeader = document.getElementById('connectedPlayers');


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

updatePlayerCount();