import EpubJS from "epubjs";

const render = ({ viewer, book, settings, themes }) => {
  console.assert(viewer);
  if (viewer) {
    console.groupCollapsed(
      "%c render book ",
      "background: red; color: white; font-style: italic;"
    );
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
      console.log("%c relocated ", "background: lightGray", location);
    });
    rendition.on("locationChanged", (location) => {
      console.log("%c locationChanged ", "background: lightGray", location);
    });

    rendition.on("resized", function (size) {
      console.log("%c Resized to: ", "color: red", size);
    });
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
    } = props;
    this.props = { url, onKeyPress, onContextMenu, themes };
    this.eventListeners = [];
    this.$viewer = $viewer;
    this.book = EpubJS();
    this.book
      .open(this.props.url)
      .then(() => {
        console.log("%c book open ", "color: green", this.props.url);
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

  renderBook = (width) => {
    render({
      viewer: this.$viewer.current,
      book: this.book,
      themes: this.props.themes,
      settings: {
        width,
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
      },
    });

    this.book.rendition.on("keyup", this.keyListener);
    document.addEventListener("keyup", this.keyListener, false);

    this.book.rendition.once("rendered", (section, iFrameView) => {
      console.log(this.book.rendition);
      this.addEventListener(
        iFrameView.document.documentElement,
        "contextmenu",
        this.props.onContextMenu
      );

      return false;
    });
  };

  display = () => {
    this.book.rendition.display();
  };

  setTheme = (theme) => {
    this.book.rendition.themes.select(theme);
  };
  setFontSize = (fontSize) => {
    this.book.rendition.themes.fontSize(fontSize + "%");
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
