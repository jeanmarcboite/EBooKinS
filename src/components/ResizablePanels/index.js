import React from "react";
import PropTypes from "prop-types";

import style from "./ResizablePanels.module.css";
/* https://codepen.io/lopis/pen/XYgRKz */

class ResizablePanels extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDragging: false,
      panels: props.panelsSize,
    };

    this.ref = React.createRef();
  }

  componentDidMount() {
    this.ref.current.addEventListener("mousemove", this.resizePanel);
    this.ref.current.addEventListener("mouseup", this.stopResize);
    this.ref.current.addEventListener("mouseleave", this.stopResize);
  }

  startResize = (event, currentPanel) => {
    //console.log("startResize", event.clientX, event);
    this.setState({
      isDragging: true,
      currentPanel,
      initialPos: event.clientX,
    });
  };

  stopResize = (e) => {
    if (this.state.isDragging) {
      //console.log("stopResize", e.clientX);
      this.setState({
        isDragging: false,
        currentPanel: null,
      });
      if (this.props.onResizeEnd) {
        this.props.onResizeEnd(this.state.panels);
      }
    }
  };

  resizePanel = (event) => {
    if (this.state.isDragging) {
      let { panels, currentPanel } = this.state;
      const delta = event.clientX - this.state.initialPos;
      panels[currentPanel] = (panels[currentPanel] || 0) - delta;
      panels[currentPanel - 1] = (panels[currentPanel - 1] || 0) + delta;
      this.setState({
        panels,
        initialPos: event.clientX,
      });
      if (this.props.onResize) {
        this.props.onResize(panels);
      }
    }
  };

  render() {
    const rest = this.props.children.slice(0, -1);
    var sum = this.state.panels.slice(0, -1).reduce((a, b) => a + b, 0);
    return (
      <div
        ref={this.ref}
        style={{ display: "flex" }}
        onMouseUp={this.stopResize}
      >
        {[].concat(
          ...rest.map((child, i) => {
            return [
              <div
                className={style.panel}
                key={2 * i + 1}
                style={{ width: this.state.panels[i] }}
              >
                {child}
              </div>,
              <div
                className={style.resizer}
                onMouseDown={(e) => this.startResize(e, i + 1)}
                key={2 * i}
                background={this.props.resizerColor}
                width={this.props.resizerSize}
                style={
                  this.state.currentPanel === i
                    ? { left: this.state.delta }
                    : {}
                }
              ></div>,
            ];
          })
        )}
        <div
          className={style.panel}
          style={{
            width: `calc(100% - ${sum}px)`,
          }}
        >
          {this.props.children[this.props.children.length - 1]}
        </div>
      </div>
    );
  }
}

ResizablePanels.propTypes = {
  panelsSize: PropTypes.arrayOf(PropTypes.number),
  onResizeEnd: PropTypes.func,
  resizerColor: PropTypes.string,
  resizerSize: PropTypes.string,
};
export default ResizablePanels;
