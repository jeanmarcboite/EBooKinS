import React from "react";
import PropTypes from "prop-types";

import { Alert } from "antd";
import { connect } from "react-redux";

import {
  RightOutlined,
  LeftOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from "@ant-design/icons";

import { setSetting } from "pages/Settings/store";

import { ThemeContext, themes } from "ThemeProvider";

import style from "./Ereader.module.css";
import viewerStyle from "./EpubViewer.module.css";
import "./EpubViewer.css";
class EpubContents extends React.PureComponent {
  static whyDidYouRender = true;
  static contextType = ThemeContext;

  constructor(props) {
    super(props);

    this.state = {
      fullscreen: false,
    };
  }

  renderArrows = () => {
    return (
      <>
        <button className={style.fullscreen}>
          {this.state.fullscreen ? (
            <FullscreenExitOutlined onClick={this.exitFullscreen} />
          ) : (
            <FullscreenOutlined onClick={this.setFullscreen} />
          )}
        </button>
        <button
          ref={this.$leftArrow}
          className={style.leftArrow}
          onClick={(e) => {
            e.preventDefault();
            this.props.prev();
          }}
        >
          <LeftOutlined />
        </button>
        <button
          ref={this.$rightArrow}
          className={style.rightArrow}
          onClick={(e) => {
            e.preventDefault();
            this.props.next();
          }}
        >
          <RightOutlined />
        </button>
      </>
    );
  };

  exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };
  setFullscreen = () => {
    document.fullscreenEnabled =
      document.fullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.documentElement.webkitRequestFullScreen;

    let requestFullscreen = (element) => {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    };

    if (document.fullscreenEnabled) {
      requestFullscreen(document.documentElement);
    }
  };

  render = () => {
    const viewer_style = {
      backgroundColor: this.context.theme.background,
      color: "purple",
      height: "100vh",
    };

    return (
      <div
        style={{
          display: "flex",
          background: "papayawhip",
          height: "100vh",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className={viewerStyle.epub_viewer}
          style={{ height: "100%", width: "100%" }}
        >
          <div
            ref={this.props.viewerRef}
            id="viewer"
            className={viewerStyle.viewer}
            style={viewer_style}
          >
            {this.props.error ? (
              <Alert message={this.props.error.toString()} type="error" />
            ) : null}
          </div>
          {this.renderArrows()}
        </div>
      </div>
    );
  };
}

EpubContents.propTypes = {
  error: PropTypes.string,
  next: PropTypes.func.isRequired,
  prev: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    settings: state.settings,
  };
}

const ConnectedEpubContents = connect(mapStateToProps)(EpubContents);

export default React.forwardRef((props, ref) => (
  <ConnectedEpubContents viewerRef={ref} {...props} />
));
