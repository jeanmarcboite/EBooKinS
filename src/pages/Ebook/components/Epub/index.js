import EpubJS from "epubjs";

import * as EPUBJS_CONSTANTS from "./constants";

const debug = false;

const render = ({ view, book, settings, themes }) => {
  let consoleGroup = false;
  if (debug) {
    consoleGroup = true;
    console.groupCollapsed(
      "%c render book ",
      "color: green; font-style: italic;"
    );
    console.log(settings);
    console.log("view width: ", getComputedStyle(view).width);
    console.trace();
  }

  let rendition = book.renderTo(view, settings);
  for (let theme in themes) {
    rendition.themes.register(theme, {
      body: themes[theme].ebook_iframe_body,
    });
  }

  if (debug) {
    EPUBJS_CONSTANTS.DOM_EVENTS.forEach((eventType) => {
      rendition.on(eventType, (event) => {
        console.log(
          `%c ${eventType} `,
          "background: blue; color: white",
          event
        );
      });
    });

    for (let k in EPUBJS_CONSTANTS.EVENTS.RENDITION) {
      let eventType = EPUBJS_CONSTANTS.EVENTS.RENDITION[k];
      rendition.on(eventType, (event) => {
        let c = `%c on ${eventType} `;
        if (event) console.log(c, "background: blue; color: yellow", event);
        else console.log(c, "background: blue; color: white");
      });
    }

    rendition.on("resized", function (size) {
      console.log("%c Resized to: ", "color: red", size);
    });
  }
  if (consoleGroup) console.groupEnd();
};

class Epub {
  constructor() {
    this.eventListeners = [];
    this.book = EpubJS();
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

  rendition = () => {
    return this.book.rendition;
  };

  renderBook = (view, width, themes, location, onContextMenu) => {
    render({
      view,
      book: this.book,
      themes,
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
      if (debug) console.log(this.book.rendition);
      this.addEventListener(
        iFrameView.document.documentElement,
        "contextmenu",
        onContextMenu
      );
      return false;
    });
    let displayed = this.display(location);

    displayed
      .then(function (section) {
        if (debug) console.log("%c renderer: ", "color: blue", section.idref);
      })
      .catch((err) => {
        console.warn("display location", location);
        console.warn(err);
        this.display();
      });
  };

  display = (location) => {
    if (location) return this.book.rendition.display(location);
    return this.book.rendition.display();
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
