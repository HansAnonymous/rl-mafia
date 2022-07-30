import React, { useState, useEffect } from "react";
import Router from "next/router";
import { withTranslation } from "../utils/i18n";
import Swal from "sweetalert2";

import SelectableBox from "./SelectableBox";
import AccessCode from "./AccessCode";
import HideableContainer from "./HideableContainer";

const PostGame = ({ t, i18n, gameState, socket }) => {
    const {
        me,
        players,
        timeLeft: latestServerTimeLeft,
        timePaused,
        settings,
    } = gameState;

    const [timeLeft, setTimeLeft] = useState(latestServerTimeLeft);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [gameWon, setGameWon] = useState(false);

    const handleSelectedPlayer = (player) => {
        setSelectedPlayer(player);
    }
    const handleGameWon = (checked) => {
        setGameWon(checked);
    };

    useEffect(() => {
        let interval = null;
        if (!timePaused) {
            interval = setInterval(() => {
                if (timeLeft <= 0) {
                    clearInterval(interval);
                    setTimeLeft(0);
                    return;
                }
                setTimeLeft((timeLeft) => timeLeft - 1);
            }, 1000);
        } else if (timePaused && timeLeft !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timePaused, timeLeft]);

    useEffect(() => {
        setTimeLeft(latestServerTimeLeft)
        console.log(players);
    }, [latestServerTimeLeft]);

    const isMafia = me.role === "mafia";

    const timeExpired = timeLeft <= 0;
    const minutesLeft = Math.floor(timeLeft / 60);
    const secondsLeft = ((timeLeft % 60) + "").padStart(2, "0");
    const showTapToPause = !timePaused && timeLeft > 0;

    const handleTogglePause = () => {
        if (timeExpired) return;

        socket.emit("togglePause");
        logEvent("togglePause", true);
    };

    return (
        <div name="gameView" style={{ userSelect: "none" }}>
            {settings.timeLimit !== 0 && (
                <div style={{ marginBottom: "1em" }} onClick={handleTogglePause}>
                    <h4
                        className={
                            "game-countdown " +
                            (timeExpired ? "finished " : " ") +
                            (timePaused ? "paused" : "")
                        }
                        style={{ marginBottom: "0.25em" }}
                    >
                        {minutesLeft}:{secondsLeft}
                    </h4>
                    <div>
                        {timePaused && <div className="red-text">Game paused</div>}
                        {showTapToPause && <div className="subtitle">Tap to pause</div>}
                    </div>
                </div>
            )}

            <AccessCode code={gameState.code} />

            <HideableContainer title={"Your Role"} initialHidden={false}>
                <div className="status-container-content">
                    {isMafia && (
                        <div className="player-status player-status-mafia">
                            {t("ui.you are the mafia")}
                        </div>
                    )}
                    {!isMafia && (
                        <div
                            className="player-status player-status-not-mafia"
                            dangerouslySetInnerHTML={{
                                __html: t("ui.you are not the mafia"),
                            }}
                        ></div>
                    )}
                </div>
            </HideableContainer>

            <div className="players-left">
                {"Waiting for " + players.filter((p) => !p.voted).length + " players to vote."}
            </div>

            <h5>{t("ui.players")}</h5>
            <ul className="ingame-player-list">
                {players.map((player, i) => (
                    <SelectableBox
                        key={i}
                        index={i}
                        onSelect={handleSelectedPlayer}
                        selectedPlayer={selectedPlayer}
                        voted={me.voted}
                        isSelf={me.name === player.name}
                    >
                        {player.name && player.name}
                        {!player.name && <i>Joining...</i>}
                        {!player.connected && <i> (Disconnected)</i>}
                    </SelectableBox>
                ))}
            </ul>

            <label>
                <input
                    type="checkbox"
                    onChange={({ target: { checked } }) => handleGameWon(checked)}
                    checked={gameWon}
                    {...(me.voted && { disabled: true })}
                />
                <span className="label-body">
                    Did you win? (Check before submitting vote)
                </span>
            </label>

            <div className="submit-vote">
                {selectedPlayer !== null && (
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            socket.emit("vote", { vote: selectedPlayer, win: gameWon });
                        }}
                        {...(me.voted && { disabled: true })}
                    >
                        {!me.voted ? "Submit vote for " + players[selectedPlayer].name : "Voted for " + players[selectedPlayer].name}
                    </button>
                )}
            </div>

            <hr />

            <div className="button-container">
                <button
                    className="btn-end"
                    onClick={() =>
                        popup(t("ui.end game"), t("ui.back"), () => socket.emit("endGame"))
                    }
                >
                    {t("ui.end game")}
                </button>
                <button
                    className="btn-leave"
                    onClick={() =>
                        popup(t("ui.leave game"), t("ui.back"), () => {
                            //prevents a redirect back to /[gameCode]
                            socket.off("disconnect");

                            Router.push("/");
                        })
                    }
                >
                    {t("ui.leave game")}
                </button>
            </div>
        </div>
    );
};

const popup = (yesText, noText, onYes) =>
    Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: yesText,
        cancelButtonText: noText,
    }).then((result) => {
        if (result.value) {
            onYes();
        }
    });

export default withTranslation("common")(PostGame);
