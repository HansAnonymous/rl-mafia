module.exports = function (server) {
	const io = server.io;
	const mafia = server.mafia;

	io.on("connection", (socket) => {
		socket.on("joinGame", ({ gameCode, previousName }) => {
			const theGame = mafia.findGame(gameCode);
			if (theGame) {
				theGame.initPlayer(socket, previousName);
			} else {
				socket.emit("invalid", { gameCode });
			}
		});
	});
};
