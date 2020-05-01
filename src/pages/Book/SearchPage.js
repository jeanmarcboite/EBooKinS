import React, { useState } from "react";
import online from "lib/online";
import MainLayout from "pages/MainLayout";
import { parseString } from "xml2js";
import style from "./Search.module.css";
import { urls } from "config";
import Book from "models/Book";
import BookDetails from "./components/BookDetails";
import { Input } from "antd";
import { withRouter } from "react-router-dom";

const SearchCard = ({ data, onClick }) => {
  if (data.$.type !== "Book") return <></>;
  return (
    <div>
      <img
        src={data.image_url[0]}
        alt="cover"
        onClick={() => onClick(data.id[0]._)}
      />
      <h3>{data.title[0]}</h3>
      <h2>{data.author[0].name}</h2>
    </div>
  );
};

const SelectedBook = ({ id }) => {
  const [state, setState] = useState({
    book: { data: {} },
    image_url: "",
    id: null,
  });
  if (!id) return null;

  if (id !== state.id) {
    let book = new Book(id);
    book.getFromGoodreadsID().then((book) => {
      let image_url = book.data.image_url;
      setState({ id, book, image_url });
    });
  }
  return (
    <div>
      {id}
      <BookDetails image_url={state.image_url} data={state.book.data} />
    </div>
  );
};

class SearchPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: this.props.match.params.query,
      selected: undefined,
      works: [],
    };
  }

  componentDidMount() {
    this.search();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.query !== this.state.query) this.search();
  }

  search() {
    if (urls.goodreads.search) {
      online
        .get(urls.goodreads.search(this.state.query))
        .then((result) => {
          parseString(result.data, (err, parsed) => {
            let work = parsed.GoodreadsResponse.search[0].results[0].work;
            if (!work) {
            } else {
              let works = parsed.GoodreadsResponse.search[0].results[0].work.map(
                (w) => w.best_book[0]
              );

              this.setState({
                works,
              });
              if (works.length > 0)
                this.setState({ selected: works[0].id[0]._ });
            }
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

  onClick = (selected) => {
    this.setState({ selected });
  };

  onSearch = (query) => {
    this.setState({ query });
  };

  render = () => {
    return (
      <MainLayout show_header>
        <div className={style.container}>
          <SelectedBook id={this.state.selected} className={style.selected} />
          <Input.Search
            defaultValue={this.state.query}
            onSearch={this.onSearch}
            enterButton
          />
          <div className={style.gallery}>
            {this.state.works.length === 0 ? (
              <h2>Nothing found</h2>
            ) : (
              this.state.works.map((w, key) => (
                <SearchCard data={w} key={key} onClick={this.onClick} />
              ))
            )}
          </div>
        </div>
      </MainLayout>
    );
  };
}
export default withRouter(SearchPage);
