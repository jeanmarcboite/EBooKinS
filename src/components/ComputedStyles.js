import React from "react";
import PropTypes from "prop-types";

import { Card } from "antd";

export default class ComputedStyles extends React.Component {
  render = () => {
    let sizes = {};
    for (let elem in this.props.elems) {
      if (this.props.elems[elem].current)
        sizes[elem] = getComputedStyle(this.props.elems[elem].current)[
          this.props.style_attribute
        ];
    }
    return (
      <Card size="small" title={this.props.title} style={{ width: 200 }}>
        {Object.keys(sizes).map((key) => (
          <p key={key}>
            {key}: {sizes[key]}
          </p>
        ))}
      </Card>
    );
  };
}

ComputedStyles.propTypes = {
  title: PropTypes.string,
  elems: PropTypes.objectOf(PropTypes.object),
  style_attribute: PropTypes.string.isRequired,
};
