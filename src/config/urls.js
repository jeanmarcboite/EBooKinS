const librarythingKey = localStorage.getItem("LIBRARYTHING_KEY");
const librarything = !librarythingKey
  ? {
      show: (id) => "http://www.librarything.com/work/" + id,
    }
  : {
      show: (id) => "http://www.librarything.com/work/" + id,
      cover: (isbn, size) => {
        size = size ? size : "large";
        return (
          "http://covers.librarything.com/devkey/" +
          librarythingKey +
          "/" +
          size +
          "/isbn/" +
          isbn
        );
      },
      isbn: (isbn) =>
        "http://www.librarything.com/services/rest/1.1/?method=librarything.ck.getwork&isbn=" +
        isbn +
        "&apikey=" +
        librarythingKey,
      id: (id) =>
        "http://www.librarything.com/services/rest/1.1/?method=librarything.ck.getwork&id=" +
        id +
        "&apikey=" +
        librarythingKey,
    };

const goodreadsKey = localStorage.getItem("GOODREADS_KEY");

const goodreads = !goodreadsKey
  ? {
      nocover: "http://www.goodreads.com/images/nocover60x80.jpg",
      show: (id) => "http://www.goodreads.com/book/show/" + id,
    }
  : {
      nocover: "http://www.goodreads.com/images/nocover60x80.jpg",
      show: (id) => "http://www.goodreads.com/book/show/" + id,
      id: (id) =>
        "https://www.goodreads.com/book/show/" +
        id +
        ".xml?key=" +
        goodreadsKey,
      title: (title) =>
        "https://www.goodreads.com/book/title.xml?title=" +
        title +
        "&key=" +
        goodreadsKey,
      isbn: (isbn) =>
        "https://www.goodreads.com/book/isbn/" + isbn + "?key=" + goodreadsKey,
      show_author: (id) =>
        "https://www.goodreads.com/author/show/" +
        id +
        "?format=xml&key=" +
        goodreadsKey,
      author: (id) =>
        "https://www.goodreads.com/api/author_url/" +
        id.replace(" le ", " ").replace(/\s+/g, ",") +
        "?key=" +
        goodreadsKey,
      search: (q) =>
        "https://www.goodreads.com/search/index.xml?key=" +
        goodreadsKey +
        "&q=" +
        q.replace(/\s+/g, "+"),
    };

/*
openlibrary:
    cover_url: 'http://covers.openlibrary.org/b/ISBN/%v-L.jpg'
data_url: "https://openlibrary.org/api/books?bibkeys=ISBN:%v&format=json&jscmd=data"
ol: "https://openlibrary.org/%v"
url:
    isbn: "https://openlibrary.org/api/books?bibkeys=ISBN:%v&jscmd=details&format=json"
cover: 'http://covers.openlibrary.org/b/%v/%v-M.jpg'
title: "https://openlibrary.org/search.json?title=%v"
titleauthor: "https://openlibrary.org/search.json?title=%v&author=%v"
show: "https://openlibrary.org%v"
*/
const openlibrary = {
  show: (id) => "https://openlibrary.org/" + id,
  isbn: (isbn) =>
    "https://openlibrary.org/api/books?bibkeys=ISBN:" +
    isbn +
    "&jscmd=details&format=json",
  q: (q) => "http://openlibrary.org/search.json?q=" + q,
  title: (title) => "http://openlibrary.org/search.json?q=" + title,
  author: (author) => "http://openlibrary.org/search.json?q=" + author,
  cover: (isbn, size) =>
    "http://covers.openlibrary.org/b/isbn/" + isbn + "-" + size + ".jpg",
};

const proxy = {
  local: "http://localhost:8090/",
  heroku: "https://cors-anywhere.herokuapp.com/",
};

export default { librarything, goodreads, openlibrary, proxy };
