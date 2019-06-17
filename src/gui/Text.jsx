import React from 'react';
import styled from 'styled-components';
import {padStart} from 'lodash';

class Text extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {className, value, length, prefix} = this.props;

    if (length != null) {
      value = padStart(value, length, '0');
    }
    if (prefix != null) {
      value = prefix + value;
    }
    return <div className={className}>{value}</div>;
  }
}

export default styled(Text)`
  color: #fff;
  font-size: 48px;
`;
