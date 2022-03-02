/**
 * @desc: 操作
 * @name: OperatPanel
 * @todo:
 * 1. 操作按钮禁用状态
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button, Icon } from 'antd';

import styles from './index.less';

class OperatPanel extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const {
      operatTexts,
      rightIconType,
      leftIconType,
      onMoveToLeft,
      onMoveToRight,
      rightDisabled,
      leftDisabled,
    } = this.props;
    const [leftText, rightText] = operatTexts;
    return (
      <div className={styles.operat_wrapper}>
        <Button
          className={styles.operat_btn}
          type="primary"
          disabled={rightDisabled}
          onClick={onMoveToLeft}
        >
          <Icon type={leftIconType} />
          {leftText && <span>{leftText}</span>}
        </Button>
        <Button
          className={styles.operat_btn}
          disabled={leftDisabled}
          type="primary"
          onClick={onMoveToRight}
        >
          <Icon type={rightIconType} />
          {rightText && <span>{rightText}</span>}
        </Button>
      </div>
    );
  }
}

OperatPanel.propTypes = {
  operatTexts: PropTypes.array,
  rightIconType: PropTypes.string,
  leftIconType: PropTypes.string,
  rightDisabled: PropTypes.bool,
  leftDisabled: PropTypes.bool,
};

OperatPanel.defaultProps = {
  operatTexts: ['删除', '添加'],
  rightIconType: 'right',
  leftIconType: 'left',
  rightDisabled: false,
  leftDisabled: false,
};

export default OperatPanel;
