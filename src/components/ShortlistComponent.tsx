import React from "react";

import { IMovie } from "../App";
import { Button, List } from "antd";

import { DeleteOutlined } from "@ant-design/icons";

import "./ShortlistComponent.css";

export class ShortlistComponent extends React.Component<
	IShortlistComponentProps,
	IShortlistComponentState
> {
	render() {
		const numMovies: number = this.props.shortList.length;

		return (
			<div className={"shortlist-container"}>
				<h2 style={{ width: "100%", textAlign: "center" }}>Your nominations</h2>
				<p style={{ width: "100%", textAlign: "center", fontSize: "0.9em" }}>
					(select up to 5 movies to nominate)
				</p>
				<List
					itemLayout="horizontal"
					bordered
					dataSource={this.props.shortList}
					renderItem={(movie: IMovie) => (
						<List.Item
							actions={[
								<DeleteOutlined
									color={"#eb2f96"}
									onClick={() => this.props.onRemoveMovie(movie.imdbID)}
								/>,
							]}
						>
							<List.Item.Meta title={`${movie.Title} (${movie.Year})`} />
						</List.Item>
					)}
				/>
				<Button
					color={"blue"}
					onClick={this.props.onSubmit}
					disabled={numMovies > 5 || numMovies === 0}
					type="primary"
				>
					Submit nominations
				</Button>
				{numMovies > 5 && (
					<p className={"error-msg"}>
						You cannot select more than 5 movies to nominate
					</p>
				)}
			</div>
		);
	}
}

export interface IShortlistComponentState {
	// nothing
}

export interface IShortlistComponentProps {
	shortList: IMovie[]; //list of movies in the shortlist
	onRemoveMovie: (movieId: string) => void; // when the user removes a movie from the shortlist
	onSubmit: () => void; // when the user clicks the button to submit the nominations
}
