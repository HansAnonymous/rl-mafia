import React, { useEffect, useState, useContext } from "react";
import Router from "next/router";
import withDarkMode from "next-dark-mode";
import { useDarkMode } from "next-dark-mode";

import Page from "../components/Page";

import { appWithTranslation } from "../utils/i18n";

function MyApp({ Component, pageProps }) {
	const {
		darkModeActive,
		switchToDarkMode,
		switchToLightMode,
	} = useDarkMode();

	const [loading, setLoading] = useState(false);
	useEffect(() => {

		const loadingStart = () => setLoading(true);
		const loadingStop = () => {
			setLoading(false);
		};

		Router.events.on("routeChangeStart", loadingStart);
		Router.events.on("routeChangeComplete", loadingStop);

		return () => {
			Router.events.off("routeChangeStart", loadingStart);
			Router.events.off("routeChangeComplete", loadingStop);
		};
	}, []);

	const onThemeToggle = () =>
		darkModeActive ? switchToLightMode() : switchToDarkMode();

	return (
		<Page onThemeToggle={onThemeToggle} darkModeActive={darkModeActive}>
			<Component
				{...pageProps}
				loading={loading}
				onThemeToggle={onThemeToggle}
			/>
			{darkModeActive && (
				<style jsx global>{`
					body {
						background-color: #121212;
						color: white;
						transition: background-color 0.2s linear;
					}

					.footer-container {
						position: relative;
						left: 0;
						bottom: 0;
						width: 100%;
					}
					.footer,
					.language-list {
						color: #ddd;
					}
					button:hover,
					button:active,
					button:focus,
					.swal2-container .swal2-title {
						color: white;
					}
					.swal2-container .swal2-popup {
						background-color: #222;
					}
					button:active {
						background-color: #555;
					}
					button {
						background-color: #222;
						color: white;
						border-color: #aaa;
						transition: background-color 0.2s linear;
					}

					input[type="text"],
					select,
					.box,
					.lobby-player-list > .player-box {
						border-color: #aaa !important;
						background-color: #333 !important;
						color: white !important;
					}
					.game-countdown {
						color: #ddd;
					}
					.access-code,
					.access-code > span {
						color: #fff;
					}
					.box-striked {
						background-color: #333 !important;
						color: grey !important;
					}
				`}</style>
			)}
		</Page>
	);
}

export default withDarkMode(appWithTranslation(MyApp));
