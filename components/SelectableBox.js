import React, { useEffect, useState } from "react";

const SelectableBox = ({ children, onSelect, index, selectedPlayer, voted, isSelf }) => {
	const handleClick = (e) => {
		onSelect(e.target.value);
	}
	const handleDivClick = () => {
		if (voted || isSelf) return;
		onSelect(index);
	}

	return (
		<>
			<li>
				<div
					className={"box" + (parseInt(selectedPlayer) === index ? "-selected" : "")}
					onClick={() => handleDivClick()}
				>
					<input
						type="radio"
						name="player"
						value={index}
						checked={parseInt(selectedPlayer) === index}
						onChange={(e) => handleClick(e)}
						style={{ display: "none" }}
					>
					</input>
					{children}
				</div>
			</li>
			<style jsx>{`
				.box {
					border: 1px solid #ccc;
				}
				.box-selected {
					background-color: #f5f5f5;
					color: #333;
					padding: 3px 10px;
					border-color: #c55;
					border-style: solid;
					border-width: 1px;
					border-radius: 3px;
				}
			`}</style>
		</>
	);
};

export default SelectableBox;
