import React from "react";
import PropTypes from "prop-types";
import { Alert } from "antd";
import { connect } from "react-redux";
import Fullscreen from "./Fullscreen";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import style from "./EpubView.module.css";

class EpubView extends React.PureComponent {
  state = {
    fullscreen: false,
  };

  toggleFullscreen = (event) => {
    this.setState({
      fullscreen: document.fullscreenElement !== null,
    });
  };

  componentDidMount = () => {
    document.addEventListener("fullscreenchange", this.toggleFullscreen);
  };

  componentWillUnmount = () => {
    document.removeEventListener("fullscreenchange", this.toggleFullscreen);
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
              height: "99vh",
            }}
          >
            {this.props.error ? (
              <Alert message={this.props.error.toString()} type="error" />
            ) : null}
          </div>
          <button
            className={style.leftArrow}
            style={{
              visibility: this.props.leftArrowVisible ? "visible" : "hidden",
            }}
            onClick={(e) => {
              e.preventDefault();
              this.props.prev();
            }}
          >
            <LeftOutlined />
          </button>
          <button
            className={style.rightArrow}
            style={{
              visibility: this.props.rightArrowVisible ? "visible" : "hidden",
            }}
            onClick={(e) => {
              e.preventDefault();
              this.props.next();
            }}
          >
            <RightOutlined />
          </button>
          <Fullscreen />
        </div>
      </div>
    );
  };
}

EpubView.propTypes = {
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

const ConnectedEpubView = connect(mapStateToProps)(EpubView);

EpubView.whyDidYouRender = {
  logOnDifferentValues: true,
  customName: "Epub View",
};

export default React.forwardRef((props, ref) => (
  <ConnectedEpubView viewerRef={ref} {...props} />
));
