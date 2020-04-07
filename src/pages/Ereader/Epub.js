import EpubJS from "epubjs";

class Epub {
  constructor({ url, loadTableOfContents, $viewer, debug }) {
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
    this.book.loaded.navigation.then((nav) => loadTableOfContents(nav));

    if (debug) {
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
      this.book.loaded.resources.then((resources) => {
        console.log(resources);
      });
    }
  }

  destroy = () => {
    if (this.book) {
      this.book.destroy();
      delete this.book;
    }
  };
  renditionPrev = (e) => {
    this.rendition.prev();
    e.preventDefault();
  };

  renditionNext = (e) => {
    this.rendition.next();
    e.preventDefault();
  };
}

export default Epub;
