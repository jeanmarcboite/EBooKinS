import EpubJS from "epubjs";
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
    this.$viewer = $viewer;
    this.url = url;
    this.book = EpubJS();
    this.book
      .open(this.url)
      .then(() => {
        if ($viewer.current) {
          this.rendition = this.book.renderTo($viewer.current, this.settings);

          this.rendition.on("relocated", (location) => {
            console.log("relocated", location);
          });

          for (let theme in themes) {
            this.rendition.themes.register(theme, {
              body: themes[theme].ebook_iframe_body,
            });
          }
          this.rendition.display();
          this.rendition.on("keyup", this.keyListener);
          document.addEventListener("keyup", this.keyListener, false);

          this.book.loaded.navigation.then(loadTableOfContents);
          this.book.loaded.metadata.then(loadMetadata);

          this.rendition.on("rendered", (section, iFrameView) => {
            console.log("rendered", this.rendition);
            this.rendered = true;
            this.removeEventListeners();
            this.addEventListener(
              iFrameView.document.documentElement,
              "contextmenu",
              onContextMenu
            );
            this.renditionUpdate();

            return false;
          });

          this.rendition.on("resized", function (size) {
            console.log("Resized to:", size);
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
          this.rendition.prev();
          break;
        case "ArrowRight":
          this.rendition.next();
          break;
        default:
          break;
      }
    }
  };

  renditionInit = () => {};

  renditionDisplay = (href) => {
    console.assert(this.rendition);
    if (this.rendered) {
      this.rendition.display(href);
    }
  };

  renditionUpdate = (theme, width) => {
    if (theme) this.theme = theme;
    if (width) this.width = width;
    if (this.rendered) {
      console.log("update rendition: ", this.theme, this.width);
      this.settings.width = this.width;
      this.rendition = this.book.renderTo(this.$viewer.current, this.settings);
      //this.rendition.resize(this.width, "900px");
      this.rendition.themes.select(this.theme);
      this.rendition.display();
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
  renditionPrev = () => {
    this.rendition.prev();
  };

  renditionNext = () => {
    this.rendition.next();
  };
}

export default Epub;
