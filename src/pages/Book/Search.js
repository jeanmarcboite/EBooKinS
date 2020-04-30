import React from "react";
import { connect } from "react-redux";
import online from "lib/online";
import MainLayout from "pages/MainLayout";
import ReactJson from "react-json-view";
import { parseString } from "xml2js";
import style from "./Search.module.css";
import config, { urls } from "config";

const SearchCard = ({ data }) => {
  console.log(data);

  if (data.$.type != "Book") return <></>;
  return (
    <div>
      <img src={data.image_url[0]} alt="cover" />
      <h3>{data.title[0]}</h3>
      <h2>{data.author[0].name}</h2>
    </div>
  );
};

export default class SearchPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: this.props.match.params.query,
      works: [],
    };
  }
  componentDidMount() {
    if (urls.goodreads.search) {
      online
        .get(urls.goodreads.search(this.state.query))
        .then((result) => {
          parseString(result.data, (err, parsed) => {
            console.log(parsed, result);
            this.setState({
              works: parsed.GoodreadsResponse.search[0].results[0].work.map(
                (w) => w.best_book[0]
              ),
            });
            /*
            let promises = parsed.GoodreadsResponse.search[0].results[0].work
              .slice(0, 1)
              .map((w) => online.get(urls.goodreads.id(w.id[0]._)));

            Promise.all(promises).then((works) => this.setState({ works }));
            */
          });
        })
        .catch(console.warn);
    }
  }

  render = () => {
    return (
      <MainLayout>
        <h1>{this.state.query}</h1>
        <div className={style.gallery}>
          {this.state.works.map((w, key) => (
            <SearchCard data={w} key={key} />
          ))}
        </div>
      </MainLayout>
    );
  };
}
