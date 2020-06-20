/**
 * 搜索树
 */

import React, { FC, useEffect } from 'react';
import { Tree, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import useUpdateState from '@/hooks/useUpdateState';

import { SearchTreeProps } from '../interface';
import styles from './index.less';

const SearchTree: FC<SearchTreeProps> = props => {
  const { showSearch = true } = props;
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
    <div>
      {showSearch && (
        <div className={styles.search}>
          <Input
            prefix={<SearchOutlined />}
            size="small"
            placeholder="输入关键词搜索"
          />
        </div>
      )}
      <Tree
        checkable
        // checkStrictly
        checkedKeys={state.checkedKeys}
        onCheck={onPropsChange}
        treeData={props.treeData}
      />
    </div>
  );
};

export default SearchTree;
