import React from "react";

import { IMovie } from "./../App";
import { Input, Table, Space, Button } from "antd";

import { EyeOutlined } from "@ant-design/icons";

import "./SearchComponent.css";

const { Search } = Input;

export class SearchComponent extends React.Component<
  ISearchComponentProps,
  ISearchComponentState
> {
  constructor(props: any) {
    super(props);

    this.state = {
      moviesMatchingQuery: [],
      isError: false,
      errorMsg: "",
      searchLoading: false,
      canLoadMore: false,
      searchVal: "",
    };
  }

  getColumns = (): any[] => {
    const shortListIds: string[] = this.props.shortList.map(
      (movie: IMovie) => movie.imdbID
    );

    return [
      { title: "Title", dataIndex: "Title", key: "Title" },
      { title: "Year", dataIndex: "Year", key: "Year" },
      {
        title: "",
        key: "action",
        render: (text: string, record: IMovie) => (
          <Space size="middle">
            <Button
              type="link"
              size="middle"
              disabled={shortListIds.includes(record.imdbID)}
              onClick={() => this.props.onSelectMovie(record)}
            >
              Add movie
            </Button>
            <Button
              shape="circle"
              icon={<EyeOutlined />}
              size={"small"}
              href={record.Poster}
              target={"__blank"}
            />
          </Space>
        ),
      },
    ];
  };

  loadMore = () => {
    this.setState({ searchLoading: true });

    const page: number = this.state.moviesMatchingQuery.length / 10 + 1;

    const reqUrl: string = `http://www.omdbapi.com/?apikey=79fbe843&type=movie&s=${this.state.searchVal}&page=${page}`;

    fetch(reqUrl)
      .then((res) => res.json())
      .then(
        (result) => {
          // for any reason, API did not return a list
          if (result.Response === "False") {
            console.error(result);
            this.setState({
              isError: true,
              errorMsg: result.Error ?? "Something went wrong",
              searchLoading: false,
              canLoadMore: false,
            });
          } else {
            console.log(result);
            const newMoviesMatchingQuery = [
              ...this.state.moviesMatchingQuery,
              ...result.Search,
            ];
            this.setState({
              isError: false,
              moviesMatchingQuery: newMoviesMatchingQuery,
              searchLoading: false,
              canLoadMore: parseInt(result.totalResults ?? "0") / 10 > page, // there are still movies we havent gotten
            });
          }
        },
        (e) => {
          console.error(e);
          this.setState({
            isError: true,
            errorMsg: e.Error ?? "Something went wrong",
            searchLoading: false,
            canLoadMore: false,
          });
        }
      );
  };

  onSearch = (s: string) => {
    if (s === "") return;

    this.setState({ searchLoading: true, searchVal: s });

    const reqUrl: string = `http://www.omdbapi.com/?apikey=79fbe843&type=movie&s=${s}`;

    fetch(reqUrl)
      .then((res) => res.json())
      .then(
        (result) => {
          // for any reason, API did not return a list
          if (result.Response === "False") {
            console.error(result);
            this.setState({
              isError: true,
              errorMsg: result.Error ?? "Something went wrong",
              searchLoading: false,
              canLoadMore: false,
            });
          } else {
            console.log(result);
            this.setState({
              isError: false,
              moviesMatchingQuery: result.Search,
              searchLoading: false,
              canLoadMore: parseInt(result.totalResults ?? "0") > 10,
            });
          }
        },
        (e) => {
          console.error(e);
          this.setState({
            isError: true,
            errorMsg: e.Error ?? "Something went wrong",
            searchLoading: false,
            canLoadMore: false,
          });
        }
      );
  };

  render() {
    return (
      <div className={"search-container"}>
        <Search
          placeholder="search for a movie"
          autoFocus
          allowClear
          enterButton="Search"
          size="large"
          loading={this.state.searchLoading}
          onSearch={this.onSearch}
        />
        {!this.state.isError && this.state.moviesMatchingQuery.length > 0 && (
          <>
            <Table
              columns={this.getColumns()}
              dataSource={this.state.moviesMatchingQuery}
              pagination={false}
              scroll={{ y: 500 }}
              rowKey={(movie: IMovie) => movie.imdbID}
            />
            {this.state.canLoadMore && (
              <Button onClick={this.loadMore}>Load more</Button>
            )}
          </>
        )}
        {this.state.isError && <h3>{this.state.errorMsg}</h3>}
      </div>
    );
  }
}

export interface ISearchComponentState {
  moviesMatchingQuery: IMovie[];
  isError: boolean;
  errorMsg: string;
  searchLoading: boolean;
  canLoadMore: boolean; // whether the current search has more results that can be loaded
  searchVal: string; // current search val
}

export interface ISearchComponentProps {
  shortList: IMovie[]; //list of movies in the shortlist

  onSelectMovie: (movie: IMovie) => void; // when the user selects a movie from the search results
}
