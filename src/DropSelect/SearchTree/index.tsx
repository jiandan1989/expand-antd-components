/**
 * 搜索树
 * https://ant.design/components/tree-cn/#components-tree-demo-search
 * 上方链接中的搜索使用的是展开 key 的集合控制
 */

import React, { FC, useEffect, useMemo } from 'react';
import { Tree, Input } from 'antd';
import { SearchOutlined, CloseCircleFilled } from '@ant-design/icons';
import useUpdateState from '@/hooks/useUpdateState';

import { SearchTreeProps } from '../interface';
import styles from './index.less';
import {
  getCheckedList,
  getExpandedKeys,
  generateFlatDataList,
} from './helper';

const SearchTree: FC<SearchTreeProps> = props => {
  const { showSearch = true } = props;
  /** props.value 需要处理 checkedKeys  */
  const [state, { setState }] = useUpdateState<{
    checkedKeys?: string[];
    checkedList?: SearchTreeProps['treeData'];
    expandedKeys?: string[];
    value?: string;
    autoExpandParent?: boolean;
  }>({
    checkedKeys: props.value || [],
    checkedList: [],
    expandedKeys: [],
    value: '',
    autoExpandParent: false,
  });

  /** 扁平化数据 */
  const dataList = useMemo(() => generateFlatDataList(props.treeData), [
    props.treeData,
  ]);

  /** 选择事件回调 */
  const onPropsChange = (keys: string[]) => {
    const checkedList = getCheckedList(dataList, keys);
    if (props.onChange) {
      props.onChange(keys, checkedList);
    }

    setState({ checkedKeys: keys, checkedList });
  };

  const onExpand = (expandedKeys: any) => {
    setState({ expandedKeys, autoExpandParent: false });
  };

  useEffect(() => {
    setState({
      checkedKeys: props.value || [],
      checkedList: getCheckedList(dataList, props.value || []),
    });
  }, [props.value]);

  useEffect(() => {
    const expandedKeys = getExpandedKeys(props.treeData, state.value as string);
    setState({ expandedKeys, autoExpandParent: true });
  }, [state.value]);

  return (
    <div className={styles.wrapper}>
      {showSearch && (
        <Input
          size="small"
          value={state.value}
          placeholder="输入关键词搜索"
          prefix={<SearchOutlined />}
          className={styles.search}
          suffix={
            state.value && (
              <CloseCircleFilled
                onClick={() => {
                  setState({ value: '' });
                }}
              />
            )
          }
          onChange={evt => {
            const { value } = evt.target;
            setState({ value });
          }}
        />
      )}
      <Tree
        className={styles.tree_wrapper}
        checkable
        onExpand={onExpand}
        // @ts-ignore
        onCheck={onPropsChange}
        treeData={props.treeData}
        checkedKeys={state.checkedKeys}
        expandedKeys={state.expandedKeys}
        autoExpandParent={state.autoExpandParent}
      />
    </div>
  );
};

export default SearchTree;
