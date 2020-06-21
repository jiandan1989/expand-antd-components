/**
 * @name: TransferItem
 * @desc: 单侧树
 * @param
 * 1. treeData: 树形结构数据
 * 2. checkedKeys: 选中数据 keys
 * 3. treeOnCheck: 选中事件
 * 4. checkTitle: 顶部 checkbox 标题 默认为 左侧: 源数据, 右侧: 目标数据
 * 5. showAllCheck: 是否显示全选, 默认为 true
 * 6. showSearch: 是否显示搜索框
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tree, Checkbox, Input } from 'antd';

import styles from './index.less';

const { DirectoryTree, TreeNode } = Tree;

class TransferItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderTreeNodes = data =>
    data.map(item => {
      const treeNodeProps = {
        ...item,
        key: item.key,
        dataRef: item,
      };
      if (item.children) {
        return (
          <TreeNode {...treeNodeProps}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...treeNodeProps} />;
    });

  /**
   * @desc: 获取 checkbox 状态
   */
  getCheckStatus = filteredDataSource => {
    const { checkedKeys } = this.props;
    if (checkedKeys.length === 0) {
      return 'none';
    }
    if (filteredDataSource.every(item => checkedKeys.indexOf(item.key) >= 0)) {
      return 'all';
    }
    return 'part';
  };

  render() {
    const {
      treeData,
      planishData,
      checkedKeys,
      treeOnCheck,
      checkTitle,
      showAllCheck,
      showSearch,
      onAllCheck,
      disabled,
    } = this.props;
    const filteredDataSource = planishData.filter(item => !item.disabled);
    const checkStatus = this.getCheckStatus(filteredDataSource);
    const checkedAll = checkStatus === 'all';
    const allLength = planishData.length;
    const checkedLength = checkedKeys.length;
    return (
      <div className={styles.transfer_item_wrapper}>
        {showAllCheck && (
          <div className={styles.transfer_item_title}>
            <Checkbox
              disabled={disabled}
              checked={checkedAll}
              indeterminate={checkStatus === 'part'}
              onChange={() => {
                onAllCheck(filteredDataSource, checkedAll);
              }}
            />
            <span>{checkTitle}</span>
            <span>
              {checkedLength} / {allLength} 项
            </span>
          </div>
        )}
        <div className={styles.transfer_item_tree_wrapper}>
          {showSearch && (
            <div className={styles.search_wrapper}>
              <Input size="small" />
            </div>
          )}
          <DirectoryTree
            className={styles.transfer_item_directory_tree_wrapper}
            showIcon={false}
            checkedKeys={checkedKeys}
            checkable
            onCheck={treeOnCheck}
          >
            {this.renderTreeNodes(treeData)}
          </DirectoryTree>
        </div>
      </div>
    );
  }
}

TransferItem.defaultProps = {
  showAllCheck: true,
  showSearch: true,
  treeData: [],
  checkedKeys: [],
  checkTitle: '',
  allLength: 0,
  checkedLength: 0,
  onAllCheck() {},
  treeOnCheck() {},
};

TransferItem.propTypes = {
  showAllCheck: PropTypes.bool,
  showSearch: PropTypes.bool,
  treeData: PropTypes.array,
  checkedKeys: PropTypes.array,
  checkTitle: PropTypes.string,
  allLength: PropTypes.number,
  checkedLength: PropTypes.number,
  onAllCheck: PropTypes.func,
  treeOnCheck: PropTypes.func,
};

export default TransferItem;
