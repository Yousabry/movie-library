import React from "react";
import { Row, Col, Alert, Button } from "antd";
import Cookies from "universal-cookie";
import { SearchComponent } from "./components/SearchComponent";
import { ShortlistComponent } from "./components/ShortlistComponent";

import "./App.css";

export class App extends React.Component<IAppProps, IAppState> {
	public cookies: any;

	constructor(props: any) {
		super(props);
		this.cookies = new Cookies();

		this.state = { shortlist: this.cookies.get("movies-shortlist") ?? [] };
	}

	saveShortlist = (shortlist: IMovie[]) => {
		// Save in state and save in cookies, so if the user refreshes the page the info is still saved
		this.setState({ shortlist });
		this.cookies.set("movies-shortlist", JSON.stringify(shortlist), {
			path: "/",
		});
	};

	onSelectMovie = (movieSelected: IMovie) => {
		const shortListIds: string[] = this.state.shortlist.map(
			(movie) => movie.imdbID
		);

		// If the movie is already there, do not add a duplicate
		if (shortListIds.indexOf(movieSelected.imdbID) !== -1) return;

		// Add the movie to the shortlist
		const newShortlist: IMovie[] = this.state.shortlist;
		newShortlist.push(movieSelected);

		this.saveShortlist(newShortlist);
	};

	onRemoveMovie = (movieId: string) => {
		// Find the index of the movie we are removing
		const movieIndex: number = this.state.shortlist.findIndex(
			(movie: IMovie) => movie.imdbID === movieId
		);

		if (movieIndex === -1) return;

		// Remove the movie's with the same id from the shortlist
		const newShortlist: IMovie[] = this.state.shortlist;
		newShortlist.splice(movieIndex, 1);

		this.saveShortlist(newShortlist);
	};

	render() {
		return (
			<div className={"Page-container"}>
				<h1 className={"Page-title"}>Youssef's Movie Library</h1>
				<Row>
					<Col span={12}>
						<SearchComponent
							onSelectMovie={this.onSelectMovie}
							shortList={this.state.shortlist}
						/>
					</Col>
					<Col span={12}>
						<ShortlistComponent
							onRemoveMovie={this.onRemoveMovie}
							shortList={this.state.shortlist}
							onSubmit={() => {
								this.saveShortlist([]);
								alert("nominations submitted!");
							}}
						/>
					</Col>
				</Row>
				{this.state.shortlist.length === 5 && (
					<Alert
						message="You have 5 movies in your list. Ready to nominate them?"
						type="success"
						showIcon
						action={
							<Button
								size="small"
								type="text"
								onClick={() => {
									this.saveShortlist([]);
									alert("nominations submitted!");
								}}
							>
								Nominate!
							</Button>
						}
					/>
				)}
			</div>
		);
	}
}

export interface IAppState {
	shortlist: IMovie[];
}

export interface IAppProps {
	// nothing
}

export interface IMovie {
	Title: string;
	Year: Date;
	imdbID: string;
	Type: string;
	Poster: string; //url to poster pic
}
