import { Button, Grid, Typography } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { useActions } from "../../actions";
import * as React from "react";
import { TodoDialog, TodoTable } from "../../components";
import * as CardActions from "../../actions/card";
import { Card as CardTemplate } from "../../model";

export function Card() {
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);
	// const cardList = useSelector((state: RootState) => state.cardList); //Read from strore
	const cardActions = useActions(CardActions); // set store
	const card: CardTemplate = {
		id: 1,
		description: "description 1",
		image: "your image here",
		titulo: "your title here",
		attributes: {
			adoption_phase: 1,
			amdocs_usage: 1,
			popularity: 1,
			skill_priority: 1,
		},
	};
	const createCard = () => {
		cardActions.addCard(card);
	};

	return (
		<Grid container className={classes.root}>
			<Grid item xs={6}></Grid>
			<Button onClick={createCard} variant="outlined" color="primary">
				Add Card
			</Button>
			<Grid item xs={6}>
				<div className="card_section">
					<div
						className="card selected"
						style={{ visibility: "visible" }}
					>
						<div
							className="front"
							style={{ left: "0px", zIndex: 2 }}
						>
							<figure>
								<img
									className="card_picture"
									src="./js-logo.png"
								/>
							</figure>
							<p className="card_name">JavaScript</p>
							<table className="card_table">
								<tbody>
									<tr className="">
										<td className="left-align">
											Released:
										</td>
										<td className="data">1995</td>
									</tr>
									<tr className="">
										<td className="left-align">Version:</td>
										<td className="data">1.8</td>
									</tr>
									<tr>
										<td className="left-align">
											Difficulty:
										</td>
										<td className="data">7</td>
									</tr>
									<tr>
										<td className="left-align">
											Versatilty:
										</td>
										<td className="data">8</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div
							className="back"
							style={{ left: "0px", zIndex: 2 }}
						></div>
						<div className="num_cards">6</div>
						<div className="next_card"></div>
					</div>
					<div
						className="card hidden flipped"
						style={{ visibility: "visible" }}
					>
						<div
							className="front"
							style={{ left: "0px", zIndex: 2 }}
						>
							<figure>
								<img
									className="card_picture"
									src="./php-logo_1.png"
								/>
							</figure>
							<p className="card_name">PHP</p>
							<table className="card_table">
								<tbody>
									<tr className="">
										<td className="left-align">
											Released:
										</td>
										<td className="data">1995</td>
									</tr>
									<tr className="">
										<td className="left-align">Version:</td>
										<td className="data">7</td>
									</tr>
									<tr>
										<td className="left-align">
											Difficulty:
										</td>
										<td className="data">9</td>
									</tr>
									<tr>
										<td className="left-align">
											Versatilty:
										</td>
										<td className="data">6</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div
							className="back"
							style={{ left: "0px", zIndex: 2 }}
						></div>
						<div className="next_card"></div>
						<div className="num_cards">4</div>
					</div>
					<div className="gameover">
						<h1>Game Over</h1>
						<h2>Player 1 Wins</h2>
					</div>
				</div>
			</Grid>
		</Grid>
	);
}

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		padding: 20,
		[theme.breakpoints.down("md")]: {
			paddingTop: 50,
			paddingLeft: 15,
			paddingRight: 15,
		},
	},
}));
