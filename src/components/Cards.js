import React from "react";

import { Card } from "antd";

export default class Cards extends React.Component {
  render = () => {
    let sizes = {};
    for (let elem in this.props.elems) {
      if (this.props.elems[elem].current)
        sizes[elem] = getComputedStyle(this.props.elems[elem].current).width;
    }
    return (
      <Card size="small" title="Small size card" style={{ width: 200 }}>
        {Object.keys(sizes).map((key) => (
          <p key={key}>
            {key}: {sizes[key]}
          </p>
        ))}
      </Card>
    );
  };
}
