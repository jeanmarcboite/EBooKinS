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

import style from "./Contents.module.css";
class Contents extends React.PureComponent {
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
          className={style.leftArrow}
          style={{ visibility: this.props.leftArrowVisibility }}
          onClick={(e) => {
            e.preventDefault();
            this.props.prev();
          }}
        >
          <LeftOutlined />
        </button>
        <button
          className={style.rightArrow}
          style={{ visibility: this.props.rightArrowVisibility }}
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
          className={style.epub_viewer}
          style={{ height: "100%", width: "100%" }}
        >
          <div
            ref={this.props.viewerRef}
            id="viewer"
            className={style.viewer}
            style={{
              backgroundColor: this.props.backgroundColor,
              height: "100vh",
            }}
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

Contents.propTypes = {
  error: PropTypes.string,
  backgroundColor: PropTypes.string,
  next: PropTypes.func.isRequired,
  prev: PropTypes.func.isRequired,
  leftArrowVisibility: PropTypes.string,
  rightArrowVisibility: PropTypes.string
};

function mapStateToProps(state) {
  return {
    settings: state.settings,
  };
}

const ConnectedContents = connect(mapStateToProps)(Contents);
ConnectedContents.whyDidYouRender = {
  logOnDifferentValues: true,
  customName: "EPUB Contents",
};

export default React.forwardRef((props, ref) => (
  <ConnectedContents viewerRef={ref} {...props} />
));
