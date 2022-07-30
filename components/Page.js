import React from "react";
import Head from "next/head";

import "../styles/sanitize.css";
import "skeleton-css/css/skeleton.css";

import "../styles/styles.less";
import Footer from "./Footer";

const Page = ({ children, onThemeToggle, darkModeActive }) => {
	return (
		<>
			<Head>
				<meta charSet="utf-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=1"
				/>
				<meta name="description" content="By HansAnonymous" />
				<meta name="apple-mobile-web-app-title" content="RL Mafia" />
				<meta name="application-name" content="RL Mafia" />
				<meta name="msapplication-TileColor" content="#ffffff" />
				<meta name="theme-color" content="#ffffff" />
				<title>RL Mafia</title>

				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon-16x16.png"
				/>
				<link rel="manifest" href="/site.webmanifest" />
				<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#555555" />
			</Head>
			<div dir="ltr" className="container dir-ltr lang-en">
				<div className="main-content">
					<div className="main-content-container">
						{children}
					</div>
					<div className="footer-container">
						<button
							className="btn-small"
							onClick={onThemeToggle}
							style={{ marginBottom: "1.5em" }}
						>
							Switch to {darkModeActive ? "Light" : "Dark"} Mode
						</button>
						<Footer />
					</div>
				</div>
			</div>
		</>
	);
};

export default Page;
