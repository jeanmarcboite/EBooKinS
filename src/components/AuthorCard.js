import React from "react";
import renderHTML from "react-render-html";

const image_url = (author) => {
  return author.data?.large_image_url || author.image_url;
};
export default class AuthorCard extends React.Component {
  render() {
    let authors = this.props.author;
    if (!Array.isArray(authors)) authors = [authors];
    console.log(authors);
    return authors.map((author, key) => (
      <div key={key}>
        <img
          src={image_url(author)}
          alt={author.name}
          height="80"
          style={{ float: "right" }}
        />
        <h2>{author.name} </h2>
        {author.role}
        {renderHTML(author.data?.about[0] || "")}
      </div>
    ));
  }
}
