/**
 * DropTreeSelect
 */
import React, {
  FC,
  SFC,
  useRef,
  useMemo,
  ReactNode,
  useEffect,
  useCallback,
  Fragment,
} from 'react';
import { Tree, Menu, Input, Button, Popover } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { useBoolean } from 'ahooks';
import useUpdateState from '@/hooks/useUpdateState';
import EllipsisText from '@/EllipsisText';

import {
  isChecked,
  getCheckKeys,
  getCheckedList,
  generateFlatDataList,
} from './util';
import { ItemData, DropTreeSelectInt, DropTreeSelectState } from './interface';
import styles from './index.less';

const { TreeNode } = Tree;

const ItemWrapper: SFC<{ children: ReactNode; id: string }> = props => (
  <span className={styles.item_wrapper} id={props.id}>
    {props.children}
  </span>
);

const DropTreeSelect: FC<DropTreeSelectInt> = props => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [state, { setState }] = useUpdateState<DropTreeSelectState>({
    searchValue: '',
    selectedKeys: [],
  });

  const [visible, { setTrue, setFalse }] = useBoolean();
  const isMultiple = useMemo(() => props.mode === 'multiple', [props.mode]);

  /** 扁平化列表 */
  const dataList = useMemo(() => generateFlatDataList(props.dataSource), [
    props.dataSource,
  ]);

  /** 过滤后的数组 */
  const filteredList = useMemo(() => {
    if (!state.searchValue) return dataList;
    return dataList.filter(item => item.key.includes(state.searchValue));
  }, [dataList, state.searchValue]);

  const onVisibleChange = (flag: boolean) => {
    if (typeof props.onOk === 'function') return;
    const fn = flag ? setTrue : setFalse;
    fn();
  };

  /** 清空 */
  useEffect(() => {
    if (!visible) {
      setState({ searchValue: '' });
    }
  }, [visible]);

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
      return <ItemWrapper id={item.key}>{props.renderItem(item)}</ItemWrapper>;
    }

    return isMultiple ? (
      <ItemWrapper id={item.key}>{item.title}</ItemWrapper>
    ) : (
      <ItemWrapper id={item.key}>
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
        {data.map(item => {
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

  /** 点击选择项回调函数 */
  const onClickCount = () => {
    if (!state.selectedKeys.length) return;
    if (typeof props.onCountClick === 'function') {
      props.onCountClick(contentRef.current, state.selectedKeys);
    }
  };

  /** 展示选择项 */
  const valueCount = useMemo(() => state.selectedKeys.length, [
    state.selectedKeys,
  ]);

  const renderItems = () => {
    if (typeof props.itemsRender === 'function') {
      return <div className={styles.items}>{props.itemsRender([])}</div>;
    }

    return (
      props.itemsRender && (
        <div className={styles.items}>
          已选择&nbsp;
          <a onClick={onClickCount}>{valueCount}</a> 项
        </div>
      )
    );
  };

  /** 清空 */
  const clean = useCallback(() => {
    setState({ selectedKeys: [] });
  }, []);

  /** 确定 */
  const onOk = () => {
    if (props.onOk) {
      props.onOk(state.selectedKeys);
    }

    if (props.onChange) {
      props.onChange(state.selectedKeys);
    }

    setFalse();
  };

  /** 是否展示清空操作: 只存在于多选 */
  const renderClean = () => {
    if (!props.actions?.clean || props.mode === 'single') return null;
    return (
      <div className={styles.clean} onClick={clean}>
        清空
      </div>
    );
  };

  /** 选择事件回调 */
  const onPropsChange = (keys: string[]) => {
    if (props.onChange) {
      props.onChange(keys);
    }

    setState({ selectedKeys: keys });
  };

  const renderTreeNodes = (data: ItemData[]) =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode
            key={item.key}
            disabled={item.disabled}
            title={renderMenuItem(item)}
          >
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }

      return (
        <TreeNode
          key={item.key}
          disabled={item.disabled}
          title={renderMenuItem(item)}
        />
      );
    });

  const renderTree = (data: ItemData[]) => {
    return (
      <Tree checkable onCheck={onPropsChange} checkedKeys={state.selectedKeys}>
        {renderTreeNodes(props.dataSource)}
      </Tree>
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
        <div
          className={styles.content_wrapper}
          ref={contentRef}
          id="contentRef"
        >
          {!isMultiple
            ? renderMenu(props.dataSource)
            : renderTree(props.dataSource)}
        </div>
        {isMultiple && (
          <div className={styles.pop_footer}>
            {props.itemsRender && renderItems()}
            {/* 如果只有一个子节点, 直接显示到右侧 */}
            <div className={styles.actions}>
              {renderClean()}
              <Button
                type="primary"
                size="small"
                onClick={onOk}
                // {...props.okButtonProps}
              >
                确定
              </Button>
            </div>
          </div>
        )}
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
        <EllipsisText value={checkedValues} {...props.valueProps} />
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
  itemsRender: true,
  valueProps: {
    placeholder: '请选择',
  },
};

export default DropTreeSelect;
