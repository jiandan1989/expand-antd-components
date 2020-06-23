/**
 * DropTreeSelect
 */
import React, { FC, SFC, useRef, useMemo, ReactNode } from 'react';
import { Tree, Menu, Input, Popover } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { useBoolean } from 'ahooks';
import useUpdateState from '@/hooks/useUpdateState';

import ValueContent from './Value';
import {
  isChecked,
  getCheckKeys,
  getCheckedList,
  generateFlatDataList,
} from './util';
import { ItemData, DropTreeSelectInt, DropTreeSelectState } from './interface';
import styles from './index.less';

const ItemWrapper: SFC<{ children: ReactNode }> = props => (
  <span className={styles.item_wrapper}>{props.children}</span>
);

const DropTreeSelect: FC<DropTreeSelectInt> = props => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [state, { setState }] = useUpdateState<DropTreeSelectState>({
    searchValue: '',
    selectedKeys: [],
  });

  const [visible, { setTrue, setFalse }] = useBoolean();

  /** 扁平化列表 */
  const dataList = useMemo(() => generateFlatDataList(props.dataSource), [
    props.dataSource,
  ]);

  /** 过滤后的数组 */
  const filteredList = useMemo(
    () => dataList.filter(item => item.key !== state.searchValue),
    [dataList, state.searchValue],
  );

  const onVisibleChange = (flag: boolean) => {
    const fn = flag ? setTrue : setFalse;
    fn();
  };

  /** 点击事件 */
  const onItemClick = ({ key }: { key: string }) => {
    const checkKeys = getCheckKeys({
      selectedKeys: state.selectedKeys,
      key,
      mode: props.mode,
    });

    if (props.onChange) {
      props.onChange(checkKeys);
    }

    setState({ selectedKeys: checkKeys });

    if (props.mode === 'single') {
      setFalse();
    }
  };

  const renderMenuItem = (item: ItemData) => {
    if (props.renderItem) {
      return <ItemWrapper>{props.renderItem(item)}</ItemWrapper>;
    }

    return (
      <ItemWrapper>
        <span className={styles.item_content}>{item.title}</span>
        {/* 判断是否已经勾选 */}
        {isChecked(state.selectedKeys, item.key) && <CheckOutlined />}
      </ItemWrapper>
    );
  };

  const renderMenu = (data: ItemData[]) => {
    const baseRender = (item: ItemData) => {
      return (
        <Menu.Item disabled={item.disabled} key={item.key}>
          {renderMenuItem(item)}
        </Menu.Item>
      );
    };

    return (
      <Menu
        theme="light"
        onClick={onItemClick}
        selectedKeys={state.selectedKeys}
        className={styles.menu_wrapper}
      >
        {props.dataSource.map(item => {
          return Array.isArray(item.children) && item.children.length > 0 ? (
            <Menu.ItemGroup title={item.title} key={item.key}>
              {item.children.map(item => baseRender(item))}
            </Menu.ItemGroup>
          ) : (
            baseRender(item)
          );
        })}
      </Menu>
    );
  };

  /** 选择事件回调 */
  const onPropsChange = (keys: string[]) => {
    if (props.onChange) {
      props.onChange(keys);
    }

    setState({ selectedKeys: keys });
  };

  const renderTree = (data: ItemData[]) => {
    return (
      <Tree
        checkable
        treeData={data}
        onCheck={onPropsChange}
        checkedKeys={state.selectedKeys}
      />
    );
  };

  /** 选中的 */
  const checkedData = useMemo(
    () => getCheckedList(state.selectedKeys, dataList as ItemData[]),
    [dataList, state.selectedKeys],
  );
  const checkedValues = useMemo(() => checkedData.map(item => item.title), [
    checkedData,
  ]);

  /** 使用组件方式导致 Input 频繁的 fouce */
  const renderPopContent = () => {
    if (typeof props.contentRender === 'function') {
      return props.contentRender();
    }
    const defaultDom = (
      <div className={styles.pop_content}>
        {props.showSearch && (
          <Input
            size="small"
            value={state.searchValue}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setState({ searchValue: event.target.value });
            }}
          />
        )}
        <div className={styles.content_wrapper}>
          {props.mode === 'single'
            ? renderMenu(props.dataSource)
            : renderTree(props.dataSource)}
        </div>
      </div>
    );
    return defaultDom;
  };

  return (
    <Popover
      visible={visible}
      trigger={props.trigger}
      placement={props.placement}
      content={renderPopContent()}
      onVisibleChange={onVisibleChange}
      getPopupContainer={() => ref.current as HTMLElement}
    >
      <span ref={ref} className={styles.trigger_wrapper}>
        <ValueContent value={checkedValues} {...props.valueProps} />
      </span>
    </Popover>
  );
};

DropTreeSelect.defaultProps = {
  trigger: ['click'],
  placement: 'bottom',
  mode: 'multiple',
  dataSource: [],
  showSearch: true,
  valueProps: {
    placeholder: '请选择',
  },
};

export default DropTreeSelect;
