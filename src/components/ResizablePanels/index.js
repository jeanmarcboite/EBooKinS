import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import "./ResizablePanel.css";
/* https://codepen.io/lopis/pen/XYgRKz */
const Resizer = styled(
  styled.div({
    position: "relative",
    cursor: "col-resize",
    "z-index": 99,
    "flex-shrink": 0,
    "-webkit-user-select": "none",
    "-moz-user-select": "none",
    "-ms-user-select": "none",
    "user-select": "none",
  })
)`
  background: ${(props) => props.background || "darkGray"};
  width: ${(props) => props.width || "8px"};

  &:after,
  &:before {
    content: "";
    border-left: "1px solid #333;
    position: " absolute;
    top: "50%";
    transform: "translateY(-100%)";
    right: "0";
    display: "inline-block";
    height: "20px";
    margin: "0 2px";
  }
  ,
  &:before {
    left: "0";
  }
`;

const Panel = styled.div`
  background: "red";
`;
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

  startResize = (event, index) => {
    this.setState({
      isDragging: true,
      currentPanel: index,
      initialPos: event.clientX,
    });
  };

  stopResize = (e) => {
    console.log("stopResize", e);
    if (this.state.isDragging) {
      let { panels, currentPanel, delta } = this.state;
      panels[currentPanel] = (panels[currentPanel] || 0) - delta;
      panels[currentPanel - 1] = (panels[currentPanel - 1] || 0) + delta;
      this.setState({
        isDragging: false,
        panels,
        delta: 0,
        currentPanel: null,
      });
      if (this.props.onResizeEnd) {
        this.props.onResizeEnd({ panelsSize: panels });
      }
    }
  };

  resizePanel = (event) => {
    if (this.state.isDragging) {
      const delta = event.clientX - this.state.initialPos;
      this.setState({
        delta: delta,
      });
    }
  };

  render() {
    const rest = this.props.children.slice(1);
    var sum = this.state.panels.slice(1).reduce((a, b) => a + b, 0);
    return (
      <div
        ref={this.ref}
        style={{ display: "flex" }}
        onMouseUp={this.stopResize}
      >
        <Panel
          style={{
            width: `calc(100% - ${sum}px)`,
          }}
        >
          {this.props.children[0]}
        </Panel>
        {[].concat(
          ...rest.map((child, i) => {
            return [
              <Resizer
                onMouseDown={(e) => this.startResize(e, i + 1)}
                key={2 * i}
                background={this.props.resizerColor}
                width={this.props.resizerSize}
                style={
                  this.state.currentPanel === i + 1
                    ? { left: this.state.delta }
                    : {}
                }
                className="resizer"
              ></Resizer>,
              <Panel
                key={2 * i + 1}
                style={{ width: this.state.panels[i + 1] }}
              >
                {child}
              </Panel>,
            ];
          })
        )}
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
