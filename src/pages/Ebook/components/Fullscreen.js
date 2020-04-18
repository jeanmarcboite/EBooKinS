import React from "react";

import { FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons";

import style from "./Button.module.css";

export default class Fullscreen extends React.PureComponent {
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
      <button className={style.fullscreen}>
        {this.state.fullscreen ? (
          <FullscreenExitOutlined onClick={this.exitFullscreen} />
        ) : (
          <FullscreenOutlined onClick={this.setFullscreen} />
        )}
      </button>
    );
  };
}
