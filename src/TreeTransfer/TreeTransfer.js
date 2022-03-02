/* eslint-disable react/destructuring-assignment */
/**
 * @name: Transfer
 * @desc: 树形穿梭框
 */
/**
 * @param:
 * 1. dataSource: 源数据
 * 2. selectedKeys: 源数据选择的keys
 * 3. targetKeys: 已选择的目标 keys
 * 4. titles: 顶部显示标题集合, 0: 左侧, 1: 右侧
 * 5. operatTexts: 穿梭文字 0: 左侧, 上, 1: 右侧 下
 * 6. wrapperClass: 外层 class
 * 7. onAllCheckChange: 选中事件 selectedKeys, targetKeys
 * 8. onCheckChange: 单个选中事件 type: selectedKeys || targetKeys, keys: 当前选中的keys
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { isEqual } from 'lodash';
import { Card } from 'antd';

import TransferItem from './TransferItem';
import OperatBtns from './OperatBtns';
import { getStateValues, planishDataToTreeData } from './utils';

import styles from './tree-transfer.less';

class TreeTransfer extends Component {
  constructor(props) {
    super(props);
    const { selectedKeys = [], targetKeys = [], dataSource } = props;
    const initialStateValues = getStateValues({
      targetKeys,
      selectedKeys,
      dataSource,
    });
    this.state = {
      ...initialStateValues,
      sdkeys: [], // 好像没用到
    };
  }

  // static getDerivedStateFromProps(props, state) {
  //   if (!isEqual(props.targetKeys, state.targetKeys) || !isEqual(props.selectedKeys, state.selectedKeys)) {
  //     return {
  //       targetKeys: props.targetKeys,
  //       selectedKeys: props.selectedKeys,
  //     }
  //     // const { targetKeys = [], dataSource, selectedKeys = [] } = props;
  //     // const initialStateValues = getStateValues({ targetKeys, selectedKeys, dataSource });
  //     // return {
  //     //   ...initialStateValues,
  //     // }
  //   }
  //   return null;
  // }

  /**
   * @desc: move
   * @todo:
   * 1. 是否允许双向穿梭 false
   * 2. 判断方向 direction
   * right: 添加
   * left: 删除
   */
  onMove = direction => {
    const { sdData } = this.state;
    console.log(direction, sdData, '>>>>>>>>>');
    /**
     * @todo:
     * 1. 左侧 ---> 右侧 OK
     * 2. 右侧 ---> 左侧 计算错误
     */
    this.setState({
      rightDataSource: planishDataToTreeData(sdData),
      rightPlaishData: sdData,
      selectedKeys: [],
      targetKeys: [],
    });
  };
  // onMove = (direction) => {
  //   const { dataSource } = this.props;
  //   let initialStateValues = {};
  //   const { targetKeys, selectedKeys, rightPlaishData } = this.state;
  //   if (direction === 'left') {
  //     const newRightPlaishData = rightPlaishData.filter(item => targetKeys.includes(item.key));
  //     const newTargetKeys = newRightPlaishData.map(item => item.key);
  //     // const newSelectedKeys = rightPlaishData.filter(k => !targetKeys.includes(k));
  //     this.setState({
  //       targetKeys: newTargetKeys,
  //       rightPlaishData: newRightPlaishData,
  //       rightDataSource: planishDataToTreeData(newRightPlaishData),
  //     });
  //     // initialStateValues = this.getStateValues({ targetKeys, selectedKeys, dataSource });
  //   }
  //   if (direction === 'right') {
  //     initialStateValues = getStateValues({ targetKeys: selectedKeys, selectedKeys, dataSource });
  //     this.setState({
  //       ...initialStateValues,
  //       selectedKeys: [],
  //     });
  //   }
  // }

  onMoveToRight = () => this.onMove('right');

  onMoveToLeft = () => this.onMove('left');

  /**
   * @desc: check
   * 1. halfCheckedKeys 组件中内置的父级 keys[]
   * 2. checked: 是否选中
   */
  treeOnCheck = (direction, checkedKeys, e) => {
    const d = this.getStateDirection(direction);
    const { onCheckChange } = this.props;
    if (onCheckChange) {
      onCheckChange(d, checkedKeys);
      return;
    }
    const { planishDataSource, rightPlaishData } = this.state;
    const { halfCheckedKeys } = e;
    // true: 一级节点, false: 非一级
    const firstNode = halfCheckedKeys.length === 0;
    const parentKeys = halfCheckedKeys.filter(k => !checkedKeys.includes(k));
    let lskeys = [];
    let rsKeys = [];
    lskeys = firstNode ? checkedKeys : [...checkedKeys, ...parentKeys];
    rsKeys = firstNode
      ? checkedKeys
      : checkedKeys.filter(k => parentKeys.includes(k));
    const lsData = planishDataSource.filter(k => lskeys.includes(k.key));
    const rsData = rightPlaishData.filter(k => !checkedKeys.includes(k.key));
    const sdkeys = direction === 'left' ? lskeys : rsKeys;
    const sdData = direction === 'left' ? lsData : rsData;
    this.setState({
      sdkeys,
      sdData,
    });

    this.setState(prevState => ({
      ...prevState,
      [d]: checkedKeys,
    }));
  };

  treeLeftOnCheck = (checkedKeys, e) =>
    this.treeOnCheck('left', checkedKeys, e);

  treeRightOnCheck = (checkedKeys, e) =>
    this.treeOnCheck('right', checkedKeys, e);

  /**
   * @desc: 全选
   * @todo: 不能全选了
   * targetKeys
   */
  onAllCheck = (direction, filteredDataSource, checkAll) => {
    const { onAllCheckChange } = this.props;
    const { planishDataSource } = this.state;
    const d = this.getStateDirection(direction);
    const dr = this.getStateReverseDirection(direction);
    const keys = checkAll ? [] : filteredDataSource.map(item => item.key);
    if (onAllCheckChange) {
      // console.log(d, keys, this.state[dr], dr);
      onAllCheckChange({ [`${d}`]: keys, [dr]: this.state[dr] });
      return;
    }
    const sdData = planishDataSource.filter(item => keys.includes(item.key));
    /**
     * @todo
     * 1. 根据选择 direction 判断 决定 sdData
     */
    this.setState({
      [d]: keys,
      sdData,
    });
    // const originalSelectedKeys = this.state[this.getStateDirection(direction)] || [];
    // const currentKeys = filteredDataSource.map(item => item.key);
    // const newKeys1 = originalSelectedKeys.filter((key) => !currentKeys.includes(key));
    // const newKeys2 = [...originalSelectedKeys];
    // currentKeys.forEach(key => {
    //   if (newKeys2.indexOf(key) === -1) {
    //     newKeys2.push(key);
    //   }
    // });
    // const holder = checkAll ? newKeys1 : newKeys2;
    // this.handleSelectChange(direction, holder);
    // if (!this.props.selectedKeys) {
    //   this.setState({
    //     [this.getStateDirection(direction)]: holder,
    //   });
    // }
  };

  onAllLeftCheck = (filteredDataSource, checkAll) =>
    this.onAllCheck('left', filteredDataSource, checkAll);

  onAllRightCheck = (filteredDataSource, checkAll) =>
    this.onAllCheck('right', filteredDataSource, checkAll);

  getStateDirection = direction =>
    direction === 'left' ? 'selectedKeys' : 'targetKeys';

  getStateReverseDirection = direction =>
    direction === 'left' ? 'targetKeys' : 'selectedKeys';

  handleSelectChange(direction, holder) {
    const { selectedKeys, targetKeys } = this.state;
    const { onAllCheckChange } = this.props;
    if (!onAllCheckChange) {
      return;
    }
    if (direction === 'left') {
      onAllCheckChange({ selectedKeys: holder, targetKeys });
    } else {
      onAllCheckChange({ selectedKeys, targetKeys: holder });
    }
  }

  render() {
    const { operatTexts, titles, wrapperClass } = this.props;

    const {
      selectedKeys,
      targetKeys,
      leftDataSource,
      rightDataSource,
      leftPlanishData,
      rightPlaishData,
    } = this.state;

    const leftDisabled = selectedKeys.length === 0;
    const rightDisabled = targetKeys.length === 0;
    const operatProps = {
      operatTexts,
      rightDisabled,
      leftDisabled,
      onMoveToRight: this.onMoveToRight,
      onMoveToLeft: this.onMoveToLeft,
    };
    const leftProps = {
      disabled: false,
      checkedKeys: selectedKeys,
      treeData: leftDataSource,
      planishData: leftPlanishData,
      checkTitle: titles[0],
      treeOnCheck: this.treeLeftOnCheck,
      onAllCheck: this.onAllLeftCheck,
    };

    const rightProps = {
      disabled: false,
      checkedKeys: targetKeys,
      treeData: rightDataSource,
      planishData: rightPlaishData,
      treeOnCheck: this.treeRightOnCheck,
      checkTitle: titles[1],
      onAllCheck: this.onAllRightCheck,
    };
    return (
      <Card className={`${styles.tree_transfer_wrapper} ${wrapperClass}`}>
        {/* 左侧显示数据源 */}
        <TransferItem {...leftProps} />
        <OperatBtns {...operatProps} />
        {/* 右侧显示 */}
        <TransferItem {...rightProps} />
      </Card>
    );
  }
}

TreeTransfer.defaultProps = {
  titles: ['源数据', '目标数据'],
  operatTexts: ['删除', '添加'],
  wrapperClass: '',
};

TreeTransfer.propTypes = {
  operatTexts: PropTypes.array,
  titles: PropTypes.array,
  wrapperClass: PropTypes.string,
};

export default TreeTransfer;
