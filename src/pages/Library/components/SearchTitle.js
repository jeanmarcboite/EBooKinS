import React from "react";
import online from "lib/online";
import style from "./Search.module.css";
import BookDetails from "components/BookDetails";
import { Input, Spin, Button } from "antd";
import { urls } from "config";
import { parseString } from "xml2js";

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
const SelectedBook = ({ id, onValidate }) => {
  if (!id) return null;
  let bookID = "goodreads:" + id;
  console.log(bookID);
  return (
    <div>
      <Button type="danger" block onClick={onValidate}>
        Validate
      </Button>
      <BookDetails bookID={bookID} />
    </div>
  );
};

class SearchTitle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: this.props.query,
      selected: undefined,
      works: [],
      loading: true,
    };
  }
  componentDidMount() {
    this.search();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.query !== this.state.query) this.search();
  }

  onClick = (selected) => {
    this.setState({ selected });
  };

  onSearch = (query) => {
    this.setState({ query, loading: true });
  };

  search = () => {
    if (urls.goodreads.search) {
      online
        .get(urls.goodreads.search(this.state.query))
        .then((result) => {
          parseString(result.data, (err, parsed) => {
            let work = parsed.GoodreadsResponse.search[0].results[0].work;
            if (!work) {
              this.setState({ works: [], loading: false });
            } else {
              let works = parsed.GoodreadsResponse.search[0].results[0].work.map(
                (w) => w.best_book[0]
              );

              this.setState({
                works,
                loading: false,
              });
              if (works.length > 0)
                this.setState({ selected: works[0].id[0]._ });
            }
          });
        })
        .catch(console.warn);
    }
  };

  render = () => {
    console.log(this.state);
    return (
      <div className={style.container}>
        <Spin spinning={this.state.loading}>
          <Input.Search
            defaultValue={this.state.query}
            onSearch={this.onSearch}
            enterButton
          />
        </Spin>
        <div className={style.gallery}>
          {!this.state.loading && this.state.works.length === 0 ? (
            <h2>Nothing found</h2>
          ) : (
            this.state.works.map((w, key) => (
              <SearchCard data={w} key={key} onClick={this.onClick} />
            ))
          )}
        </div>
        <SelectedBook
          id={this.state.selected}
          className={style.selected}
          onValidate={() => this.props.onValidate(this.state.selected)}
        />
      </div>
    );
  };
}
export default SearchTitle;
