/**
 * DropDown 版本
 */

import React, {
  FC,
  ReactNode,
  SFC,
  useMemo,
  useRef,
  useEffect,
  Fragment,
} from 'react';
import { Menu, Space, Button, Checkbox, Dropdown } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { useBoolean } from 'ahooks';
import useUpdateState from '@/hooks/useUpdateState';
import EllipsisText from '@/EllipsisText';

import { DropDownSelectProps, ItemData } from './interface';
import {
  isChecked,
  getCheckKeys,
  getCheckedList,
  getCheckedTitles,
  getInitValFromProps,
  generateFlatDataList,
} from './util';

import styles from './index.less';

const ItemWrapper: SFC<{ children: ReactNode }> = props => (
  <span className={styles.item_wrapper}>{props.children}</span>
);

const DropDownSelect: FC<DropDownSelectProps> = props => {
  const ref = useRef<HTMLSpanElement | any>();
  const { dataSource = [] } = props;
  const [state, { setState }] = useUpdateState<{
    selectedKeys: string[];
  }>({
    selectedKeys: getInitValFromProps(props.value),
  });

  const flatData = useMemo(() => generateFlatDataList(dataSource), [
    dataSource,
  ]);
  /** 重置 */
  useEffect(() => {
    setState({ selectedKeys: getInitValFromProps(props.value) });
  }, [props.value]);

  const [visible, { setFalse, setTrue }] = useBoolean(false);

  const renderMenuItem = (item: ItemData) => {
    if (props.renderMenuItem) {
      return <ItemWrapper>{props.renderMenuItem(item)}</ItemWrapper>;
    }

    /** 只有当多选时才允许出现 checkbox */
    const showCheck = props.checkable && props.mode === 'multiple';
    const showItemTick =
      props.showTick && isChecked(state.selectedKeys, item.key);

    return (
      <ItemWrapper>
        {showCheck && (
          <Checkbox
            disabled={item.disabled}
            className={styles.item_checkbox}
            checked={isChecked(state.selectedKeys, item.key)}
          />
        )}
        <span className={styles.item_content}>{item.title}</span>
        {/* 判断是否已经勾选 */}
        {showItemTick && <CheckOutlined />}
      </ItemWrapper>
    );
  };

  /** 选中的 */
  const checkedData = useMemo(
    () => getCheckedList(state.selectedKeys, flatData),
    [flatData, state.selectedKeys],
  );
  const checkedValues = useMemo(() => checkedData.map(item => item.title), [
    checkedData,
  ]);

  /** 点击事件 */
  const onItemClick = ({ key }: { key: string }) => {
    if (key === 'actions') return;
    const checkKeys = getCheckKeys({
      selectedKeys: state.selectedKeys,
      key,
      mode: props.mode,
    });

    if (props.onChange) {
      props.onChange(checkKeys, checkedData);
    }

    setState({ selectedKeys: checkKeys });

    if (props.mode === 'single') {
      setFalse();
    }
  };

  const clear = () => {
    setState({ selectedKeys: [] });
  };

  const onOk = () => {
    setFalse();
  };

  /** 底部操作 */
  const spaceRender = () => {
    if (
      typeof props.footerRender !== 'function' &&
      typeof props.footerRender !== 'boolean'
    ) {
      console.warn('你这个不是函数也不是布尔值, 就是不给你渲染, 你能咋的');
      return null;
    }

    if (typeof props.footerRender === 'function') {
      return props.footerRender({ clear, onOk });
    }
    const defaultSpaceDom = (
      <Fragment>
        {/* <Checkbox>全选</Checkbox> */}
        <Button type="link" size="small" onClick={clear}>
          清空
        </Button>
        <Button type="primary" size="small" onClick={onOk}>
          确定
        </Button>
      </Fragment>
    );
    return defaultSpaceDom;
  };

  const renderFooter = () => {
    return (
      <div className={styles.actions_content}>
        {/* 单选不显示 */}
        {props.mode === 'multiple' && (
          <span className={styles.choose_wrapper}>
            已选{checkedValues.length}项
          </span>
        )}
        <Space className={styles.space_wrapper}>{spaceRender()}</Space>
      </div>
    );
  };

  const renderMenu = () => {
    const baseRender = (item: ItemData) => {
      return (
        <Menu.Item disabled={item.disabled} key={item.key}>
          {renderMenuItem(item)}
        </Menu.Item>
      );
    };

    /** 暂不支持 theme: dark */
    return (
      <Menu
        theme="light"
        onClick={onItemClick}
        selectedKeys={state.selectedKeys}
        className={styles.menu_wrapper}
      >
        {/* {props.showSearch && <Input />} */}
        {dataSource.map(item => {
          return Array.isArray(item.children) && item.children.length > 0 ? (
            <Menu.ItemGroup title={item.title} key={item.key}>
              {item.children.map(item => baseRender(item))}
            </Menu.ItemGroup>
          ) : (
            baseRender(item)
          );
        })}
        {/* typeof props.footerRender === 'boolean' &&  */}
        {props.footerRender && (
          <Fragment>
            <Menu.Divider />
            <Menu.Item key="actions" className={styles.actions}>
              {renderFooter()}
            </Menu.Item>
          </Fragment>
        )}
      </Menu>
    );
  };

  const handleVisibleChange = (flag: boolean) => {
    const fn = flag ? setTrue : setFalse;
    fn();
  };

  return (
    <Dropdown
      trigger={['click']}
      visible={visible}
      overlay={renderMenu()}
      overlayClassName={styles.drop_wrapper}
      onVisibleChange={handleVisibleChange}
      getPopupContainer={() => ref.current}
    >
      <span ref={ref}>
        <EllipsisText value={checkedValues} {...props.valueProps} />
      </span>
    </Dropdown>
  );
};

DropDownSelect.defaultProps = {
  /** 默认不展示 */
  showSearch: true,
  /** 默认不展示 */
  checkable: true,
  /** 默认单选 */
  mode: 'single',
  /** 展示打勾 */
  showTick: true,
  valueProps: {},
  footerRender: true,
};

export default DropDownSelect;
