module.exports = function (server) {
	const mafia = server.mafia;

	server.post("/new", function (req, res) {
		if (mafia.locked) {
			// 423 Locked
			return res.status(423).send({ minutes: mafia.minutesUntilRestart });
		}
		const theGame = mafia.newGame();
		res.json({ gameCode: theGame.code });
	});

	server.post("/lock", function (req, res) {
		if (!process.env.ADMIN_PASSWORD) {
			res.status(501).end();
		}

		if (req.body.password === process.env.ADMIN_PASSWORD) {
			mafia.lock();
			res.status(200).end();
		} else {
			res.status(401).end();
		}
	});

	server.get("/stats", (req, res) => {
		res.json({
			numberOfConnectedUsers: server.io.engine.clientsCount,
			games: mafia.games.map((game) => ({
				numberOfPlayers: game.players.length,
				inProgress: game.status === "ingame",
				roundsPlayed: game.currentRoundNum,
			})),
		});
	});
};
