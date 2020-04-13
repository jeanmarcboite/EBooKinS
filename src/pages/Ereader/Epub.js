import EpubJS from "epubjs";

const render = ({ viewer, book, settings, themes }) => {
  if (viewer) {
    console.groupCollapsed("Book open, viewer mounted");
    console.log(settings);
    console.log(getComputedStyle(viewer).width);

    let rendition = book.renderTo(viewer, settings);
    for (let theme in themes) {
      rendition.themes.register(theme, {
        body: themes[theme].ebook_iframe_body,
      });
    }

    rendition.on("relocated", (location) => {
      console.log("relocated", location);
    });

    rendition.on("resized", function (size) {
      console.log("Resized to:", size);
    });
    rendition.display();
    console.groupEnd();
  }
};

class Epub {
  constructor({
    url,
    loadTableOfContents,
    loadMetadata,
    onKeyPress,
    onContextMenu,
    onError,
    $viewer,
    themes,
    debug,
  }) {
    this.eventListeners = [];
    this.settings = {
      width: "600px",
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
    this.$viewer = $viewer;
    this.url = url;
    this.book = EpubJS();
    this.book
      .open(this.url)
      .then(() => {
        if (!$viewer.current) {
          console.log(`Book ${this.url} open, no viewer`);
        } else {
          console.log(`Book ${this.url} open, render`);
          render({
            viewer: this.$viewer.current,
            book: this.book,
            settings: this.settings,
            themes,
          });
          this.rendered = true;

          this.book.rendition.on("keyup", this.keyListener);
          document.addEventListener("keyup", this.keyListener, false);

          this.book.loaded.navigation.then(loadTableOfContents);
          this.book.loaded.metadata.then(loadMetadata);

          this.book.rendition.on("rendered", (section, iFrameView) => {
            console.log("rendered", this.rendition);
            this.rendered = true;
            this.removeEventListeners();
            this.addEventListener(
              iFrameView.document.documentElement,
              "contextmenu",
              onContextMenu
            );
            this.update();

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
  keyListener = (e) => {
    //e.preventDefault();
    if (e.key) {
      switch (e.key) {
        case "ArrowLeft":
          this.prev();
          break;
        case "ArrowRight":
          this.next();
          break;
        default:
          break;
      }
    }
  };

  display = (href) => {
    console.assert(this.book.rendition);
    if (this.rendered) {
      this.book.rendition.display(href);
    }
  };

  update = (theme, width) => {
    if (theme) this.theme = theme;
    if (width) this.width = width;
    if (this.rendered) {
      console.log("update rendition: ", this.theme, this.width);
      let r = this.book.rendition;
      for (let k in r) {
        console.log(k);
      }
      console.log("manager" in r);
      console.log(this.book.rendition);
      console.log(this.book.rendition.manager);
      this.settings.width = this.width;
      //this.rendition = this.book.renderTo(this.$viewer.current, this.settings);
      //this.book.rendition.resize(this.width);
      this.book.rendition.themes.select(this.theme);
      //this.book.rendition.display();
      //console.log("display");
    }
  };

  addEventListener = (target, type, callback, useCapture) => {
    target.addEventListener(type, callback, useCapture);

    this.eventListeners.push({ target, type, callback, useCapture });
    //console.verbose("event listeners: ", this.eventListeners);
  };

  removeEventListeners = () => {
    this.eventListeners.forEach((listener) => {
      listener.target.removeEventListener(listener.type, listener.callback);
    });

    //console.verbose("event listeners removed");
    this.eventListeners = [];
  };

  destroy = () => {
    this.removeEventListeners();
    if (this.book) {
      this.book.destroy();
      delete this.book;
    }
  };

  prev = () => {
    this.book.rendition.prev();
  };

  next = () => {
    this.book.rendition.next();
  };
}

export default Epub;
