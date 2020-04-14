import EpubJS from "epubjs";

const render = ({ viewer, book, settings, themes }) => {
  if (viewer) {
    console.groupCollapsed("render book");
    console.log(settings);
    console.log("viewer width: ", getComputedStyle(viewer).width);
    console.trace();

    let rendition = book.renderTo(viewer, settings);
    for (let theme in themes) {
      rendition.themes.register(theme, {
        body: themes[theme].ebook_iframe_body,
      });
    }

    rendition.on("relocated", (location) => {
      console.log("relocated", location);
      //console.trace();
    });
    rendition.on("locationChanged", (location) => {
      console.log("locationChanged", location);
      //console.trace();
    });

    rendition.on("resized", function (size) {
      console.log("Resized to:", size);
    });
    rendition.display();
    console.groupEnd();
  }
};

class Epub {
  constructor(props) {
    const {
      url,
      loadTableOfContents,
      loadMetadata,
      onKeyPress,
      onContextMenu,
      onError,
      $viewer,
      themes,
      debug,
    } = props;
    this.props = { url, onKeyPress, onContextMenu, themes };
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
    this.book = EpubJS();
    this.book
      .open(this.props.url)
      .then(() => {
        if (!$viewer.current) {
          console.log(`Book ${this.props.url} open, no viewer`);
        } else {
          console.log(`Book ${this.props.url} open, render`);
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
    this.book.loaded.navigation.then(loadTableOfContents);
    this.book.loaded.metadata.then(loadMetadata);
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
    if (this.book.rendition) {
      this.book.rendition.display(href);
    }
  };

  updateRendition = (theme, width) => {
    this.theme = theme;
    this.settings.width = width;
    render({
      viewer: this.$viewer.current,
      book: this.book,
      settings: this.settings,
      themes: this.props.themes,
    });

    this.book.rendition.on("keyup", this.keyListener);
    document.addEventListener("keyup", this.keyListener, false);

    this.book.rendition.on("rendered", (section, iFrameView) => {
      console.log("rendered", this.book.rendition);
      this.removeEventListeners();
      this.addEventListener(
        iFrameView.document.documentElement,
        "contextmenu",
        this.props.onContextMenu
      );

      this.book.rendition.themes.select(this.theme);
      return false;
    });
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
