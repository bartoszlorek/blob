import React from 'react';
import styled, {injectGlobal} from 'styled-components';
import {connect} from 'react-redux';

import Text from './Text';

class GUI extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={this.props.className}>
        <Text value={this.props.score} length={8} />
        <Text value={this.props.lives} prefix="x" />
      </div>
    );
  }
}

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({});

const statefulGUI = connect(
  mapStateToProps,
  mapDispatchToProps
)(GUI);

export default styled(statefulGUI)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 0;
  z-index: 999;
  padding: 48px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

injectGlobal`
    @font-face {
        font-family: 'Nintendo';
        src: url('fonts/nintendo.woff2') format('woff2'),
            url('fonts/nintendo.woff') format('woff');
        font-weight: normal;
        font-style: normal;
    }

    body {
        font-family: 'Nintendo', monospace;
        margin: 0;
        padding: 0;
    }
`;
