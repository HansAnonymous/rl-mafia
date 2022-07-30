import React, { useState, useEffect } from "react";

const Settings = ({ gameState, socket }) => {
	const { settings, players } = gameState;
	const {
		timeLimit: serverMinutes,
		chanceAllMafia: serverChanceAllMafia,
		chanceAllMafiaPercent: serverChanceAllMafiaPercent,
		mafiaWinPoints: serverMafiaWinPoints,
		townGuessPoints: serverTownGuessPoints,
		gameWinPoints: serverGameWinPoints,
		percentVotesToWin: serverPercentVotesToWin,
		numberMafia: serverNumberMafia
	} = settings;

	return (
		<div className="settings-container">
			<TimeLimit
				onSetMinutes={(minutes) => socket.emit("setTimeLimit", minutes)}
				serverMinutes={serverMinutes}
			/>
			<br /><br />
			<MafiaWinPoints
				onSetMafiaWinPoints={(mafiaWinPoints) =>
					socket.emit("setMafiaWinPoints", mafiaWinPoints)
				}
				serverMafiaWinPoints={serverMafiaWinPoints}
			/>
			<TownGuessPoints
				onSetTownGuessPoints={(townGuessPoints) =>
					socket.emit("setTownGuessPoints", townGuessPoints)
				}
				serverTownGuessPoints={serverTownGuessPoints}
			/>
			<GameWinPoints
				onSetGameWinPoints={(gameWinPoints) =>
					socket.emit("setGameWinPoints", gameWinPoints)
				}
				serverGameWinPoints={serverGameWinPoints}
			/> <br /><br />
			<PercentVotesToWin
				onSetPercentVotesToWin={(percent) => socket.emit("setPercentVotesToWin", percent)}
				serverPercentVotesToWin={serverPercentVotesToWin}
			/>
			<NumberMafia
				onSetNumberMafia={(numberMafia) => socket.emit("setNumberMafia", numberMafia)}
				serverNumberMafia={serverNumberMafia}
				players={players}
			/><br /><br />
			<ChanceAllMafia
				onSetChanceAllMafia={(chanceAllMafia) =>
					socket.emit("setChanceAllMafia", chanceAllMafia)
				}
				serverChanceAllMafia={serverChanceAllMafia}
			/>
			<ChanceAllMafiaPercent
				onSetChanceAllMafiaPercent={(chanceAllMafiaPercent) =>
					socket.emit("setChanceAllMafiaPercent", chanceAllMafiaPercent)
				}
				chanceAllMafia={serverChanceAllMafia}
				serverChanceAllMafiaPercent={serverChanceAllMafiaPercent}
			/>
		</div>
	);
};

const TimeLimit = ({ onSetMinutes, serverMinutes }) => {
	const minLength = 0;
	const maxLength = 60;

	const [minutes, setMinutes] = useState(serverMinutes);
	const handleChange = (change) => () => {
		const newMinutes = minutes + change;
		if (newMinutes >= minLength && newMinutes <= maxLength) {
			setMinutes(newMinutes);
			onSetMinutes(newMinutes);
		}
	};

	useEffect(() => {
		setMinutes(serverMinutes);
	}, [serverMinutes]);

	return (
		<div>
			<label>Time Limit:</label>
			<div style={{ margin: "-.5em 0 -1em", display: "flex", "justifyContent": "center" }}>
				<button
					className="btn-small"
					onClick={handleChange(-1)}
					disabled={minutes <= minLength}
				>
					-
				</button>
				<span>
					{minutes} minute{minutes !== 1 ? "s" : ""}
				</span>

				<button
					className="btn-small"
					onClick={handleChange(1)}
					disabled={minutes >= maxLength}
				>
					+
				</button>
				<style jsx>{`
					button {
						margin: 0.5em 0;
						font-size: 1.5em;
					}
					span {
						height: 100%;
						font-size: 1.3em;
						padding: 0.5em;
					}
				`}</style>
			</div>
		</div>
	);
};

const PercentVotesToWin = ({ onSetPercentVotesToWin, serverPercentVotesToWin }) => {
	const [percentVotesToWin, setServerPercentVotesToWin] = useState(serverPercentVotesToWin);

	const handleChange = (chance) => {
		setServerPercentVotesToWin(chance);
		onSetPercentVotesToWin(chance);
	}

	useEffect(() => {
		setServerPercentVotesToWin(serverPercentVotesToWin);
	}, [serverPercentVotesToWin]);

	return (
		<>
			<label>
				<input
					type="number"
					min="0.01" max="1"
					step="0.01"
					onChange={({ target: { value } }) => handleChange(value)}
					value={percentVotesToWin}
				/>
				<span className="label-body">
					Proportion of votes to vote mafia out
				</span>
			</label>
			<style jsx>{`
				label {
					margin-bottom: 0;
				}
				input {
					width: 60px;
				}
			`}</style>
		</>
	);
}

const NumberMafia = ({ onSetNumberMafia, serverNumberMafia, players }) => {
	const [numberMafia, setServerNumberMafia] = useState(serverNumberMafia);

	const handleChange = (number) => {
		setServerNumberMafia(number);
		onSetNumberMafia(number);
	}

	useEffect(() => {
		setServerNumberMafia(serverNumberMafia);
	}, [serverNumberMafia]);

	return (
		<>
			<label>
				<input
					type="number"
					min="1" max={players.length}
					step="1"
					onChange={({ target: { value } }) => handleChange(value)}
					value={numberMafia}
				/>
				<span className="label-body">
					# of Mafia (Overridden if all are mafia)
				</span>
			</label>
			<style jsx>{`
				label {
					margin-bottom: 0;
				}
				input {
					width: 60px;
				}
			`}</style>
		</>
	);
}

const ChanceAllMafia = ({ onSetChanceAllMafia, serverChanceAllMafia }) => {
	const [chanceAllMafia, setChanceAllMafia] = useState(serverChanceAllMafia);

	const handleChange = (checked) => {
		setChanceAllMafia(checked);
		onSetChanceAllMafia(checked);
	};

	useEffect(() => {
		setChanceAllMafia(serverChanceAllMafia);
	}, [serverChanceAllMafia]);

	return (
		<>
			<label>
				<input
					type="checkbox"
					onChange={({ target: { checked } }) => handleChange(checked)}
					checked={chanceAllMafia}
				/>
				<span className="label-body">
					Enable chance that all players are mafia (fixed!)
				</span>
			</label>
			<style jsx>{`
				label {
					margin-bottom: 0;
				}
			`}</style>
		</>
	);
};

const ChanceAllMafiaPercent = ({ onSetChanceAllMafiaPercent, chanceAllMafia, serverChanceAllMafiaPercent }) => {
	const [chanceAllMafiaPercent, setChanceAllMafiaPercent] = useState(serverChanceAllMafiaPercent);

	const handleChange = (chance) => {
		setChanceAllMafiaPercent(chance);
		onSetChanceAllMafiaPercent(chance);
	}

	useEffect(() => {
		setChanceAllMafiaPercent(serverChanceAllMafiaPercent);
	}, [serverChanceAllMafiaPercent]);

	return (
		<>
			<label style={{ display: chanceAllMafia ? 'block' : 'none' }}>
				<input
					type="number"
					min="0" max="1"
					step="0.01"
					onChange={({ target: { value } }) => handleChange(value)}
					value={chanceAllMafiaPercent}
				/>
				<span className="label-body">
					Chance all players are mafia
				</span>
			</label>
			<style jsx>{`
				label {
					margin-bottom: 0;
				}
				input {
					width: 60px;
				}
			`}</style>
		</>
	);
}

const MafiaWinPoints = ({ onSetMafiaWinPoints, serverMafiaWinPoints }) => {
	const [mafiaWinPoints, setMafiaWinPoints] = useState(serverMafiaWinPoints);

	const handleChange = (chance) => {
		setMafiaWinPoints(chance);
		onSetMafiaWinPoints(chance);
	}

	useEffect(() => {
		setMafiaWinPoints(serverMafiaWinPoints);
	}, [serverMafiaWinPoints]);

	return (
		<>
			<label>
				<input
					type="number"
					min="0"
					step="1"
					onChange={({ target: { value } }) => handleChange(value)}
					value={mafiaWinPoints || 0}
				/>
				<span className="label-body">
					Points the Mafia gets for winning a game
				</span>
			</label>
			<style jsx>{`
				label {
					margin-bottom: 0;
				}
				input {
					width: 60px;
				}
			`}</style>
		</>
	);
}

const TownGuessPoints = ({ onSetTownGuessPoints, serverTownGuessPoints }) => {
	const [townGuessPoints, setTownGuessPoints] = useState(serverTownGuessPoints);

	const handleChange = (chance) => {
		setTownGuessPoints(chance);
		onSetTownGuessPoints(chance);
	}

	useEffect(() => {
		setTownGuessPoints(serverTownGuessPoints);
	}, [serverTownGuessPoints]);

	return (
		<>
			<label>
				<input
					type="number"
					min="0"
					step="1"
					onChange={({ target: { value } }) => handleChange(value)}
					value={townGuessPoints || 0}
				/>
				<span className="label-body">
					Points the town gets for correct guesses
				</span>
			</label>
			<style jsx>{`
				label {
					margin-bottom: 0;
				}
				input {
					width: 60px;
				}
			`}</style>
		</>
	);
}

const GameWinPoints = ({ onSetGameWinPoints, serverGameWinPoints }) => {
	const [gameWinPoints, setGameWinPoints] = useState(serverGameWinPoints);

	const handleChange = (chance) => {
		setGameWinPoints(chance);
		onSetGameWinPoints(chance);
	}

	useEffect(() => {
		setGameWinPoints(serverGameWinPoints);
	}, [serverGameWinPoints]);

	return (
		<>
			<label>
				<input
					type="number"
					min="0"
					step="1"
					onChange={({ target: { value } }) => handleChange(value)}
					value={gameWinPoints || 0}
				/>
				<span className="label-body">
					Points the town gets for winning a game
				</span>
			</label>
			<style jsx>{`
				label {
					margin-bottom: 0;
				}
				input {
					width: 60px;
				}
			`}</style>
		</>
	);
}

export default Settings;
