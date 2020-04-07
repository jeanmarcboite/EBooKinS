import EpubJS from "epubjs";

class Epub {
  constructor({ url, loadTableOfContent, $viewer }) {
    this.settings = {
      width: "100%",
      height: "100%",
      spread: "always",
    };
    this.url = url;
    this.book = EpubJS();
    this.book.open(this.url).catch((err) => {
      console.error(err);
    });
    this.book.loaded.navigation.then(loadTableOfContent);
    console.assert($viewer.current);
    this.rendition = this.book.renderTo($viewer.current, this.settings);
    this.rendition.display();
  }
}

export default Epub;
