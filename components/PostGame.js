import React, { useState, useEffect } from "react";
import Router from "next/router";
import { withTranslation } from "../utils/i18n";
import Swal from "sweetalert2";

import AccessCode from "./AccessCode";
import HideableContainer from "./HideableContainer";

const PostGame = ({ t, i18n, gameState, socket }) => {
    const {
        me,
        players,
        timeLeft: latestServerTimeLeft,
        successVote,
        timePaused,
        settings,
        isAllMafia,
    } = gameState;

    const [timeLeft, setTimeLeft] = useState(latestServerTimeLeft);

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

    useEffect(() => setTimeLeft(latestServerTimeLeft), [latestServerTimeLeft]);

    const isMafia = me.role === "mafia";
    const mafia = players.filter((p) => p.role === "mafia")[0];
    const successPlayers = successVote ? players.filter((p) => p.goodVote).map((p) => p.name) : [];
    const strSuccessPlayers = successPlayers.length > 1 ? successPlayers.slice(0, -1).join(", ") + ' and ' + successPlayers.slice(-1) : successPlayers[0];

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

            <hr />

            {successVote ? (
                <div className="success-vote-container">
                    <div className="success-vote-text">
                        {isMafia ?
                            "You were outed!" :
                            "The mafia was outed!"
                        } <br />
                        {isAllMafia ? "Everyone was mafia!" : <>{strSuccessPlayers} successfully voted for <b>{mafia.name}</b>!</>}
                    </div>
                </div>
            ) : (
                <div className="failure-vote-container">
                    <div className="failure-vote-text">
                        {`The mafia was not outed!`}<br />
                        {isAllMafia ? "Everyone was mafia!" : "The mafia was " + mafia.name}
                    </div>
                </div>
            )}

            <h5>Here's how you scored</h5>
            <ul className="ingame-player-list">
                {players.map((p, i) => (
                    <li key={i}>
                        <div className="box player-scores">
                            <div className="player-score-name">{p.name}</div>
                            <div className="player-score-score">{p.score} (+{p.scoreChange})</div>
                        </div>
                        <style>{`
                                .player-scores {
                                    display: flex;
                                    justify-content: space-between;
                                }
                            `}</style>
                    </li>
                ))}
            </ul>

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
