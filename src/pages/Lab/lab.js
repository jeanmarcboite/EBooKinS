import React from "react";
import "./lab.css";

import SplitPane from "react-split-pane";
/* https://codepen.io/lopis/pen/XYgRKz */
export class ResizablePanels extends React.Component {
  eventHandler = null;

  constructor(props) {
    super(props);

    this.state = {
      isDragging: false,
      panels: props.sizes,
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

  stopResize = () => {
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
        className="panel-container"
        onMouseUp={() => this.stopResize()}
      >
        <div
          className="panel"
          style={{
            width: `calc(100% - ${sum}px)`,
          }}
        >
          {this.props.children[0]}
        </div>
        {[].concat(
          ...rest.map((child, i) => {
            return [
              <div
                onMouseDown={(e) => this.startResize(e, i + 1)}
                key={"resizer_" + i}
                style={
                  this.state.currentPanel === i + 1
                    ? { left: this.state.delta }
                    : {}
                }
                className="resizer"
              ></div>,
              <div
                key={"panel_" + i}
                className="panel"
                style={{ width: this.state.panels[i + 1] }}
              >
                {child}
              </div>,
            ];
          })
        )}
      </div>
    );
  }
}

class SplitPanels extends React.Component {
  render = () => {
    const styleA = { background: "#eee" };
    const styleB = { background: "#aaa4ba" };
    const styleC = { background: "#000", width: "30px" };
    const styleD = { padding: "2em", fontStyle: "italic" };
    return (
      <SplitPane
        split="vertical"
        minSize={50}
        maxSize={300}
        defaultSize={100}
        className="primary"
        pane1Style={styleA}
        resizerStyle={styleC}
      >
        <div>
          <button
            style={{
              background: "red",
              width: "20px",
              position: "absolute",
              right: "20px",
            }}
          >
            LEFT
          </button>
        </div>
        <SplitPane split="horizontal" paneStyle={styleD} pane2Style={styleB}>
          <div>Hello...</div>
          <div> ...world.</div>
        </SplitPane>
      </SplitPane>
    );
  };
}

export default SplitPanels;
