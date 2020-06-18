/**
 * 搜索树
 */

import React, { FC, useEffect } from 'react';
import { Tree } from 'antd';
import useUpdateState from '@/hooks/useUpdateState';

import treeData from './_mock';
import { SearchTreeProps } from '../interface';

const SearchTree: FC<SearchTreeProps> = props => {
  const [state, { setState }] = useUpdateState({
    checkedKeys: props.value || [],
  });

  useEffect(() => {
    setState({ checkedKeys: props.value || [] });
  }, [props.value]);

  /** 选择事件回调 */
  const onPropsChange = (keys: string[]) => {
    if (props.onChange) {
      props.onChange(keys);
    }

    setState({ checkedKeys: keys });
  };

  return (
    <Tree
      checkable
      // checkStrictly
      checkedKeys={state.checkedKeys}
      onCheck={onPropsChange}
      treeData={treeData}
    />
  );
};

export default SearchTree;
