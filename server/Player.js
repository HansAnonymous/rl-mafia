class Player {
	constructor(socket) {
		this.socket = socket;
		this.name = "";
		this.connected = true;
		this.score = 0;
		this.reset();
	}

	reset = () => {
		this.role = null;
		this.voted = false;
		this.goodVote = false;
		this.gameWon = false;
		this.scoreChange = 0;
	};

	getInfo = () => ({
		name: this.name,
		role: this.role,
		score: this.score,
		scoreChange: this.scoreChange,
		voted: this.voted,
		gameWon: this.gameWon,
		goodVote: this.goodVote,
		connected: this.connected,
	});
}

module.exports = Player;
