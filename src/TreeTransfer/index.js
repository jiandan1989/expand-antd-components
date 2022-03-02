/**
 * @desc: 树形穿梭框
 * @name: TreeTransfer
 */

import React, { Component } from 'react';

import TreeTransfer from './TreeTransfer';

import dataSource from './mock';

class TreeTransferDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: ['0-0'],
      targetKeys: ['0-0'],
    };
  }

  onCheckChange = (type, keys) => {
    this.setState({
      [type]: keys,
    });
    // console.log(type, keys, 'props onCheckChange>>>>>>>>>');
  };

  onAllCheckChange = ({ selectedKeys, targetKeys }) => {
    this.setState({
      selectedKeys,
      targetKeys,
    });
    // console.log(selectedKeys, targetKeys, 'props AllCheck>>>>>>>>>>');
  };

  render() {
    const { selectedKeys, targetKeys } = this.state;
    return (
      <TreeTransfer
        targetKeys={targetKeys}
        selectedKeys={selectedKeys}
        // onCheckChange={this.onCheckChange}
        // onAllCheckChange={this.onAllCheckChange}
        dataSource={dataSource}
      />
    );
  }
}

export default TreeTransferDemo;
