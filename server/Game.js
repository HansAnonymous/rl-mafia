const Player = require("./Player");

class Game {
	constructor(code, onEmpty, getMinutesUntilRestart) {
		this.code = code;
		this.onEmpty = onEmpty;

		this.locked = false;
		this.getMinutesUntilRestart = getMinutesUntilRestart;

		this.players = [];
		this.status = "lobby-waiting"; // lobby-waiting, lobby-ready, ingame, postgame
		this.timeLeft = null;
		this.timePaused = false;
		this.votes = 0; // number of votes from all players
		this.mafiaVotes = 0; // votes for mafia
		this.successVote = true;
		this.currentRoundNum = 0;
		this.isAllMafia = false;
		this.settings = {
			timeLimit: 8, // 8 minutes
			chanceAllMafia: false,
			chanceAllMafiaPercent: 0.2,
			numberMafia: 1,
			percentVotesToWin: 0.5,
			numberMafia: 1,
			mafiaWinPoints: 3,
			townGuessPoints: 1,
			gameWinPoints: 1
		};

		// delete this game if it does not have players after 60 seconds
		setTimeout(() => this.deleteGameIfEmpty(), 60 * 1000);
	}

	sendNewStateToAllPlayers = () => {
		const newState = this.getState();

		for (const player of this.players) {
			player.socket.emit("gameChange", { ...newState, me: player.getInfo() });
		}
	};

	initPlayer(socket, previousName) {
		const player = this.addPlayer(socket, previousName);
		this.attachListenersToPlayer(player);

		this.checkIfReady();
		this.sendNewStateToAllPlayers();
	}

	addPlayer(socket, previousName) {
		const playerToReplace = this.findPlayerByName(previousName);
		if (playerToReplace && !playerToReplace.connected) {
			// this will never run in the lobby because all players
			// that leave the lobby are deleted, not set as disconnected
			return Game.replacePlayer(playerToReplace, socket);
		} else {
			return this.createPlayer(socket);
		}
	}

	createPlayer(socket) {
		const newPlayer = new Player(socket);
		this.players.push(newPlayer);

		if (this.status === "ingame") {
			this.createPlayerWhileInGame(newPlayer);
		}

		return newPlayer;
	}

	static replacePlayer(player, socket) {
		player.socket = socket;
		player.connected = true;
		return player;
	}

	createPlayerWhileInGame(player) {
		const { isAllMafia } = this;

		if (isAllMafia) {
			player.role = "mafia";
		} else {
			player.role = "town";
		}
	}

	removePlayerByName = (theName) =>
		this.removePlayer(this.findPlayerByName(theName))();

	findPlayerByName = (theName) =>
		this.players.find(({ name }) => name === theName);

	removePlayer = (player) => () => {
		if (!player) return false;

		if (player.socket && player.socket.disconnect) {
			player.socket.disconnect(true);
		}

		player.connected = false;

		if (this.status !== "ingame" && this.status !== "voting" || !player.name) {
			this.deletePlayer(player);
		}

		this.deleteGameIfEmpty();

		this.checkIfReady();
		this.sendNewStateToAllPlayers();
	};

	deleteGameIfEmpty = () => {
		if (this.noPlayersLeft() && this.code !== "ffff") {
			// the only players that could possibly
			// be left are unnamed players
			this.disconnectAllPlayers();

			this.onEmpty();
			return;
		}
	};

	deletePlayer = (player) => {
		const index = this.players.indexOf(player);

		if (index > -1) {
			this.players.splice(index, 1);
		}
	};

	noPlayersLeft = () => {
		const allPlayersGone = this.players.length === 0;
		const allPlayersDisconnected = this.players.reduce(
			(answer, player) => (!player.connected || !player.name) && answer,
			true
		);

		return allPlayersGone || allPlayersDisconnected;
	};

	disconnectAllPlayers = () =>
		this.players.forEach(({ socket }) => {
			if (socket) socket.disconnect(true);
		});

	removeDisconnectedPlayers = () => {
		this.players = this.players.filter((player) => player.connected);
	};

	attachListenersToPlayer = (player) => {
		const { socket } = player;
		socket.on("name", this.setName(player));
		socket.on("startGame", this.startGame(player));
		socket.on("removePlayer", this.removePlayerByName);
		socket.on("disconnect", this.removePlayer(player));
		socket.on("togglePause", this.togglePauseTimer);
		socket.on("goToVoting", this.goToVoting);
		socket.on("vote", (data) => this.vote(player, data));
		socket.on("endGame", this.endGame);
		socket.on("setTimeLimit", this.setTimeLimit);
		socket.on("setPercentVotesToWin", this.setPercentVotesToWin);
		socket.on("setNumberMafia", this.setNumberMafia);
		socket.on("setChanceAllMafia", this.setChanceAllMafia);
		socket.on("setChanceAllMafiaPercent", this.setChanceAllMafiaPercent);
		socket.on("setMafiaWinPoints", this.setMafiaWinPoints);
		socket.on("setTownGuessPoints", this.setTownGuessPoints);
		socket.on("setGameWinPoints", this.setGameWinPoints);
		socket.on("clearName", () => this.clearName(player)());
	};

	setName = (newPlayer) => (name) => {
		const validLength = name.length > 1 && name.length <= 24;

		if (!this.isNameTaken(name) && validLength) {
			newPlayer.name = name;
		} else {
			newPlayer.name = "";
			newPlayer.socket.emit("badName");
		}

		this.checkIfReady();
		this.sendNewStateToAllPlayers();
	};

	clearName = (player) => () => {
		player.name = "";

		this.checkIfReady();
		this.sendNewStateToAllPlayers();
	};

	isNameTaken = (nameToCheck) =>
		this.players.reduce(
			(answer, player) => player.name === nameToCheck || answer,
			false
		);

	checkIfReady = () => {
		if (this.status === "ingame" || this.status === "voting") return false;

		const everyoneHasName = this.players.reduce(
			(answer, player) => player.name && answer,
			true
		);

		const isReady = everyoneHasName;

		this.status = isReady ? "lobby-ready" : "lobby-waiting";

		return isReady;
	};

	startGame = (player) => () => {
		if (this.status !== "lobby-ready") return;
		if (this.locked) {
			player.socket.emit("lockedWarning", this.getMinutesUntilRestart());
			return;
		}

		// console.log(this.settings.chanceAllMafia, this.settings.chanceAllMafiaPercent);
		if (this.settings.chanceAllMafia) {
			this.isAllMafia = Math.random() < this.settings.chanceAllMafiaPercent ? true : false;
		} else {
			this.isAllMafia = false;
		}

		if (this.isAllMafia) {
			this.setAllAsMafia();
		} else {
			this.assignRoles();
		}

		this.startTimer();

		this.status = "ingame";
		this.currentRoundNum++;

		this.sendNewStateToAllPlayers();
	};

	goToVoting = () => {
		this.status = "voting";
		this.timeLeft = 60;
		this.timePaused = false;

		this.sendNewStateToAllPlayers();
	}

	vote = (player, data) => {
		// data.vote is index of player
		// data.win is whether the player won.
		if (this.status !== "voting") return;

		this.votes++;
		player.voted = true;
		player.gameWon = data.win;

		if (this.players[data.vote].role === "mafia") {
			this.mafiaVotes++;
			player.goodVote = true;
			player.score += parseInt(this.settings.townGuessPoints);
			player.scoreChange += parseInt(this.settings.townGuessPoints);
			// console.log(player.name + " voted for mafia");
			// console.log(player.name + " voted for " + this.players[data.vote].name);
			// console.log(player.name + " has " + player.score + " and got " + player.scoreChange + " points");
		}

		if (player.role === "town" && data.win) {
			player.score += parseInt(this.settings.gameWinPoints);
			player.scoreChange += parseInt(this.settings.gameWinPoints);
			// console.log(player.name + " won the game");
			// console.log(player.name + " has " + player.score + " and got " + player.scoreChange + " points");
		}
		// console.log(this.getState());
		if (this.votes >= this.players.length) {
			if (this.mafiaVotes >= this.settings.percentVotesToWin * (this.players.length - this.numMafia)) {
				this.successVote = true;
			} else {
				this.players.forEach((player) => {
					if (player.role === "mafia" && !data.win) {
						player.score += parseInt(this.settings.mafiaWinPoints);
						player.scoreChange += parseInt(this.settings.mafiaWinPoints);
					}
				});
			}

			this.status = "postgame";
			this.timeLeft = 15;
		}
		this.sendNewStateToAllPlayers();
	}

	resetTemps = () => {
		this.votes = 0;
		this.mafiaVotes = 0;
		this.successVote = false;
		this.numMafia = 0;
		this.removeDisconnectedPlayers();
		this.players.forEach((p) => {
			p.reset();
		})
	}

	endGame = () => {
		this.status = "lobby-waiting";
		this.resetTemps();

		this.checkIfReady();
		this.sendNewStateToAllPlayers();
	};

	setAllAsMafia = () => {
		this.players.forEach((player) => {
			player.role = "mafia";
			this.numMafia += 1;
		});
	}

	assignRoles = () => {
		let numMafia = 0;
		while (numMafia < this.settings.numberMafia) {
			const p = this.players[Math.floor(Math.random() * this.players.length)];
			if (p.role !== "mafia") {
				p.role = "mafia";
				numMafia += 1;
			}
		}
		this.players.forEach((player) => {
			if (player.role === "mafia") return;
			player.role = "town";
		});
	};

	startTimer = () => {
		this.timeLeft = this.settings.timeLimit * 60;
		const timer = setInterval(() => {
			if (this.timePaused) return;

			this.timeLeft--;

			if (this.timeLeft > 0) return;

			clearInterval(timer);
		}, 1000);
	};

	togglePauseTimer = () => {
		this.timePaused = !this.timePaused;
		this.sendNewStateToAllPlayers();
	};

	setTimeLimit = (timeLimit) => {
		this.settings.timeLimit = timeLimit;
		this.sendNewStateToAllPlayers();
	};

	setPercentVotesToWin = (percentVotesToWin) => {
		this.settings.percentVotesToWin = percentVotesToWin;
		this.sendNewStateToAllPlayers();
	}

	setNumberMafia = (numberMafia) => {
		this.settings.numberMafia = numberMafia;
		this.sendNewStateToAllPlayers();
	}

	setChanceAllMafia = (chanceAllMafia) => {
		this.settings.chanceAllMafia = chanceAllMafia;
		this.sendNewStateToAllPlayers();
	};

	setChanceAllMafiaPercent = (chanceAllMafiaPercent) => {
		this.settings.chanceAllMafiaPercent = chanceAllMafiaPercent;
		this.sendNewStateToAllPlayers();
	};

	setMafiaWinPoints = (mafiaWinPoints) => {
		this.settings.mafiaWinPoints = parseInt(mafiaWinPoints);
		this.sendNewStateToAllPlayers();
	};

	setTownGuessPoints = (townGuessPoints) => {
		this.settings.townGuessPoints = parseInt(townGuessPoints);
		this.sendNewStateToAllPlayers();
	};

	setGameWinPoints = (gameWinPoints) => {
		this.settings.gameWinPoints = parseInt(gameWinPoints);
		this.sendNewStateToAllPlayers();
	};

	getState = () => ({
		code: this.code,
		players: this.getPlayers(),
		status: this.status,
		timeLeft: this.timeLeft,
		timePaused: this.timePaused,
		successVote: this.successVote,
		isAllMafia: this.isAllMafia,
		settings: this.settings,
		currentRoundNum: this.currentRoundNum,
	});

	getPlayers = () => this.players.map((player) => player.getInfo());
}

module.exports = Game;
