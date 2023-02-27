var express = require('express');
const url = require("url");
var router = express.Router();

router.get('/', function(req, res) {
  res.sendFile('splash.html', {root: "./public"});
});

router.get('/game', function (req, res) {
  var query = url.parse(req.url, true).query;

  var nickname = query["nickname"] != undefined ? query["nickname"] : "Anonymous";

  console.log("[LOG] " + nickname + " joined the game.")
  res.sendFile('game.html', {root: './public'})
})

module.exports = router;
