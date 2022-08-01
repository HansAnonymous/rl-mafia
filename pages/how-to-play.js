import React from "react";
import Link from "next/link";

const HowToPlay = () => {
	return (
		<>
			<div className="main-menu">
				<h3>How to Play RL Mafia</h3>
				<hr />
				<div>
					<p>
						Welcome to RL Mafia. Chances are, if you're on this website, you've
						seen someone else play this game! Rocket League Mafia, or RL Mafia,
						is a game of suspicion, deduction, and comedy. Its name comes from
						the game that also goes by "Mafia", but is also known as "Werewolf",
						"Spyfall", "Secret Hitler", "The Chameleon", "Among Us", "Fake
						Artist Goes to New York", you get the jist.
					</p>
					<p>
						Most notably, this website is a fork of Tanner Krewson's{" "}
						<Link href="https://spyfall.tannerkrewson.com/">Spyfall</Link>.
						Which I have many thanks to give in order to be able to set this up
						in the amount of time I had.
					</p>
					<p>
						The core of this game is located within custom Rocket League
						matches. Upon starting a game, a mafia is chosen in secret. While
						the game is in progress, the Mafia must work against their team in
						order to throw the game. The catch is that the Mafia also needs to
						avoid getting caught. Once the game ends, players then vote who they
						believe the mafia is. If a majority of the players successfully
						deduce who the mafia is, then they win. If not, then the mafia wins.
					</p>
					<p>
						In addition to playing round by round, points are given to players
						based on how well they play the game and if they can guess the
						mafia. The standard point distributions are as follows:
					</p>
					<ul>
						<li>Town gets 1 point for winning the game.</li>
						<li>Town gets 1 point for successfully guessing the mafia.</li>
						<li>
							Mafia gets 3 points if they successfully throw the game for their
							team <b>AND</b> avoids getting voted.
						</li>
					</ul>
					<p>
						There are a few things for all players to note while using this app.
						Players can tap on another player in the game list to mark them as
						not suspicious. During voting, all players must select the checkmark
						for winning the match if they won Rocket League match.
					</p>
					<p>
						Additionally, there are configurations that can be set while in the
						main lobby. All players are able to set the settings. The settings
						include: Setting the amount of time to play each round, how the
						points are distributed among the players, the proportion of votes
						required for the town to vote the mafia out, the number of mafia in
						the game, and a chance that all players can be mafia.
					</p>
					<p>
						If you have any questions, suggestions, feedback, concerns, or
						issues, please feel free to message me on Discord, my username is{" "}
						<b>HansAnonymous#1007</b>.
					</p>
					<p>
						PS. There are still additional settings that still need to be
						implemented. Now that I'm able to release this, I'll focus on
						maintenance for the time being. I'll be adding more features as I
						can. Good luck and have fun!
					</p>
					<p>
						PPS. If you liked this and would like to support me in the future,
						you can support me through Buy Me a Coffee with the button found on
						the home page. Thank you very much!
					</p>
					<style jsx>{`
						text-align: left;
					`}</style>
				</div>
			</div>
			<Link href="/">
				<button>Back to RL Mafia</button>
			</Link>
		</>
	);
};

export default HowToPlay;
