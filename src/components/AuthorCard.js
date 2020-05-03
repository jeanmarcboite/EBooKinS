import React from "react";

export default class AuthorCard extends React.Component {
  render() {
    let authors = this.props.author;
    if (!Array.isArray(authors)) authors = [authors];

    return authors.map((author, key) => (
      <div key={key}>
        <img src={author.image_url} alt={author.name} height="80" />
        <h2>{author.name} </h2>
        {author.role}
      </div>
    ));
  }
}
