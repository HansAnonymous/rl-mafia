import { withTranslation } from "../utils/i18n";
import Router from "next/router";

import Settings from "./Settings";
import AccessCode from "./AccessCode";
import HideableContainer from "./HideableContainer";

const Lobby = ({ t, gameState, socket }) => {
	const playerList = gameState.players.map((player) => ({
		...player,
		isMe: player.name === gameState.me.name,
	}));
	const handleStartGame = () => {
		socket.emit("startGame");
	};

	return (
		<>
			<h4>{t("ui.waiting for players")}</h4>

			<AccessCode code={gameState.code} />

			<hr />

			<ol className="lobby-player-list">
				{playerList.map((player, i) => (
					<li key={i} className="player-box">
						{player.name} {player.name && player.score ? `(${player.score})` : ""}
						{!player.name && <i>Joining...</i>}

						{player.isMe && (
							<a
								href="#"
								className="btn-edit-player"
								data-player-id="{{ _id }}"
								onClick={() => socket.emit("clearName")}
							>
								Edit name
							</a>
						)}
						{!player.isMe && (
							<a
								href="#"
								className="btn-remove-player"
								data-player-id="{{ _id }}"
								onClick={() => socket.emit("removePlayer", player.name)}
							>
								Remove player
							</a>
						)}
					</li>
				))}
			</ol>
			<br />
			<HideableContainer title={"Game Settings"} initialHidden={true}>
				<Settings gameState={gameState} socket={socket} />
			</HideableContainer>

			<div className="button-container">
				<button
					className="btn-start"
					onClick={handleStartGame}
					disabled={gameState.status !== "lobby-ready"}
				>
					{t("ui.start game")}
				</button>
				<button
					className="btn-leave"
					onClick={() => {
						//prevents a redirect back to /[gameCode]
						socket.off("disconnect");

						Router.push("/");
					}}
				>
					{t("ui.leave game")}
				</button>
			</div>
		</>
	);
};

export default withTranslation("common")(Lobby);
