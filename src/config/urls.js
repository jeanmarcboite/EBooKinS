let librarything = {
  show: (id) => "http://www.librarything.com/work/" + id,
  cover: (isbn, devkey, size) => {
    size = size ? size : "large";
    return (
      "http://covers.librarything.com/devkey/" +
      devkey +
      "/" +
      size +
      "/isbn/" +
      isbn
    );
  },
  isbn: (isbn, devkey) =>
    "http://www.librarything.com/services/rest/1.1/?method=librarything.ck.getwork&isbn=" +
    isbn +
    "&apikey=" +
    devkey,
  id: (id, devkey) =>
    "http://www.librarything.com/services/rest/1.1/?method=librarything.ck.getwork&id=" +
    id +
    "&apikey=" +
    devkey,
};

let goodreads = {
  nocover: "http://www.goodreads.com/images/nocover60x80.jpg",
  show: (id) => "http://www.goodreads.com/book/show/" + id,
  id: (id, devkey) =>
    "https://www.goodreads.com/book/show/" + id + ".xml?key=" + devkey,
  title: (title, devkey) =>
    "https://www.goodreads.com/book/title.xml?title=" +
    title +
    "&key=" +
    devkey,
  isbn: (isbn, devkey) =>
    "https://www.goodreads.com/book/isbn/" + isbn + "?key=" + devkey,
  show_author: (id, devkey) =>
    "https://www.goodreads.com/author/show/" + id + "?format=xml&key=" + devkey,
  author: (id, devkey) =>
    "https://www.goodreads.com/api/author_url/" + id + "?key=" + devkey,
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
let openlibrary = {
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

const proxy = "https://cors-anywhere.herokuapp.com/";

export default { librarything, goodreads, openlibrary, proxy };
