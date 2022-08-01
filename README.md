# RL Mafia

**Play now: [mafia.lmnts.xyz](https://mafia.lmnts.xyz/)**

Credits to Tanner Krewson. RL Mafia is a fork of the Nextjs Spyfall version by Tanner Krewson, found at [spyfall.tannerkrewson.com](https://spyfall.tannerkrewson.com/), (formerly spyfall.meteor.com and spyfall.crabhat.com)

Issues, feature requests, and pull requests welcome!

## Information

I'm using the same README template from Spyfall but to not repeat the same info, you can find the history of Spyfall at Tanner Krewson's [GitHub repository](https://github.com/tannerkrewson/spyfall).

This is **NOT**, I repeat, **NOT** Spyfall. This is Rocket League Mafia, shortened to RL Mafia. This game involves one player in a Rocket League lobby as the Mafia. All other players are town (villagers, normies, whatever you want to call them).

It is the role of the Mafia to throw the game so their team loses without getting caught. By the end of the match, players must vote for the player they believe is the Mafia. If a majority of the players vote for the Mafia, then the Mafia loses. If the Mafia successfully throws the game and a majority of the players vote for the wrong player, then the Mafia wins. A point system is provided to encourage town to win the game, vote for Mafia, and Mafia to successfully throw the game and remain undetected.

Brumley and Patel licensed Spyfall with the [MIT License](https://github.com/HansAnonymous/rl-mafia/blob/v1.0/LICENSE), meaning anyone is free to copy, modify, and distribute Spyfall. Krewson decided to continue usage of the MIT license. And under this fork of Spyfall, I will maintain the MIT license.

Additionally, this is an extremely slimmed down version of Krewson's final version of Spyfall. I have removed most features including translations as I only intend on serving this game to my friends. If in the future I decide to polish things up, I will bring translations and additional features back.

## Development

#### Instructions

1. Install [Node.js](https://nodejs.org/)
2. `npm install`
3. `npm run dev`
4. Open `localhost:3000` in your browser
5. Create any pull requests against the `dev` branch
6. To deploy, `npm run build` then `npm start`

#### Tips

- To change the default port, set the `PORT` environment variable
- If you set the `NODE_ENV` environment variable to `development`, you can use the link `localhost:3000/ffff` to automatically join a development game. This helps speed up debugging.
