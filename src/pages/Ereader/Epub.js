import EpubJS from "epubjs";

class Epub {
  constructor({
    url,
    loadTableOfContents,
    loadMetadata,
    onContextMenu,
    onError,
    $viewer,
    debug,
  }) {
    this.eventListeners = [];
    this.settings = {
      width: "100%",
      height: "100%",
      spread: "always",
      restore: false,
      reload: false,
      bookmarks: undefined,
      annotations: undefined,
      contained: undefined,
      bookKey: undefined,
      styles: undefined,
      sidebarReflow: false,
      generatePagination: false,
      history: true,
    };

    this.url = url;
    this.book = EpubJS();
    this.book
      .open(this.url)
      .then(() => {
        if ($viewer.current) {
          this.rendition = this.book.renderTo($viewer.current, this.settings);
          //this.rendition = this.book.renderTo($viewer.current, this.settings);
          this.rendition.display();
          this.book.loaded.navigation.then(loadTableOfContents);
          this.book.loaded.metadata.then(loadMetadata);
          this.rendition.on("rendered", (section, iFrameView) => {
            this.addEventListener(
              iFrameView.document.documentElement,
              "contextmenu",
              onContextMenu
            );
            return false;
          });
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
            this.book.loaded.cover.then((cover) => {
              console.log(cover);
            });
            this.book.loaded.resources.then((resources) => {
              console.log(resources);
            });
          }
        }
      })
      .catch(onError);
  }

  addEventListener = (target, type, callback, useCapture) => {
    target.addEventListener(type, callback, useCapture);

    this.eventListeners.push({ target, type, callback, useCapture });
  };

  removeEventListeners = () => {
    this.eventListeners.forEach((listener) => {
      listener.target.removeEventListener(listener.type, listener.callback);
    });

    this.eventListeners = [];
  };

  destroy = () => {
    this.removeEventListeners();
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
