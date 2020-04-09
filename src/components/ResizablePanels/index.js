import React from "react";
import "./ResizablePanels.css";
/* https://codepen.io/lopis/pen/XYgRKz */
class ResizablePanels extends React.Component {
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
export default ResizablePanels;
