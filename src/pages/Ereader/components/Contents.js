import React from "react";
import PropTypes from "prop-types";

import { Alert } from "antd";
import { connect } from "react-redux";
import Fullscreen from "./Fullscreen";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";

import style from "./Contents.module.css";
class Contents extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      fullscreen: false,
    };

    document.addEventListener("fullscreenchange", (event) => {
      this.setState({
        fullscreen: document.fullscreenElement !== null,
      });
    });
  }

  renderArrows = () => {
    return (
      <>
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
          <Fullscreen />
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
  rightArrowVisibility: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    settings: state.settings,
  };
}

const ConnectedContents = connect(mapStateToProps)(Contents);

Contents.whyDidYouRender = {
  logOnDifferentValues: true,
  customName: "EPUB Contents",
};

export default React.forwardRef((props, ref) => (
  <ConnectedContents viewerRef={ref} {...props} />
));
