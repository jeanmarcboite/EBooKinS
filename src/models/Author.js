import { parseString } from "xml2js";
class Author {
  constructor(response) {
    var author = this;
    if (response.status != 200) {
      this.error = "goodreads author request: " + response.statusText;
    }
    parseString(response.data, function (err, result) {
      if (err != null) {
        author.error = "parsing goodreads response: " + err;
      } else {
        author.data = result.GoodreadsResponse.author[0];
        author.image_url = author.data.image_url[0];
        author.name = author.data.name[0];
        author.fans_count = author.data.fans_count[0];
        author.about = author.data.about;
        author.influences = author.data.influences;
      }
    });
  }
}

export default Author;
