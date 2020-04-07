import EpubJS from "epubjs";

class Epub {
  constructor({ url, loadTableOfContents, $viewer }) {
    this.settings = {
      width: "100%",
      height: 400,
      spread: "always",
    };
    this.url = url;
    this.book = EpubJS();
    this.book.open(this.url).catch((err) => {
      console.error(err);
    });
    console.assert($viewer.current);
    this.rendition = this.book.renderTo($viewer.current, {
      width: "100%",
      height: "100%",
    });
    //this.rendition = this.book.renderTo($viewer.current, this.settings);
    this.rendition.display();

    this.book.ready.then((book) => {
      console.log(book);
    });
    this.book.loaded.manifest.then((manifest) => {
      console.log(manifest);
    });
    this.book.loaded.spine.then((spine) => {
      console.log(spine);
    });
    this.book.loaded.metadata.then((metadata) => {
      console.log(metadata);
    });
    this.book.loaded.cover.then((cover) => {
      console.log(cover);
    });
    this.book.loaded.navigation.then((nav) => loadTableOfContents(nav));
    this.book.loaded.resources.then((resources) => {
      console.log(resources);
    });
  }
}

export default Epub;
