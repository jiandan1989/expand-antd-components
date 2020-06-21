import React, {
  FC,
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { Empty, Button, Popover, message } from 'antd';
import { useBoolean } from 'ahooks';
import useUpdateState from '@/hooks/useUpdateState';

import ValueContent from './ValueContent';
import SearchTree from './SearchTree';
import { DropSelectProps } from './interface';
import styles from './index.less';

const DropSelect: FC<DropSelectProps> = props => {
  /** 控制是否显示 */
  const [visible, { toggle, setFalse }] = useBoolean();
  const { showItems = true, valueType = 'title' } = props;
  const ref = useRef<any>();

  /** 选中的数据 */
  const [list, setList] = useState<any[]>([]);
  const [state, { setState }] = useUpdateState({
    value: props.value || [],
  });

  useEffect(() => {
    setState({ value: props.value || [] });
  }, [props.value]);

  /** 点击其他地方关闭 */
  // const handler = (event: Event) => {
  //   if (!document.querySelector(`.${styles.trigger_wrapper}`)?.contains(event.target)) {
  //     // @todo
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener('click', handler);
  //   return () => {
  //     document.removeEventListener('click', handler);
  //   };
  // }, []);

  /** 清空 */
  const clean = useCallback(() => {
    setState({ value: [] });
  }, []);

  const onChangeTree = (keys: string[], checkedList: any[]) => {
    if (props.onChange) {
      props.onChange(keys);
    }

    setList(checkedList);

    setState({ value: keys });
  };

  /** 确定 */
  const onOk = () => {
    if (props.okButtonProps?.disabled) {
      return false;
    }

    if (props.onChange) {
      props.onChange(state.value);
    }

    if (props.onOk) {
      props.onOk(state.value);
    }

    setFalse();
  };

  /** 点击选择项回调函数 */
  const onClickCount = () => {
    message.success('点击');
  };

  const valueCount = useMemo(() => state.value.length, [state.value]);
  /** 展示选择项 */
  const renderItems = () => {
    if (typeof showItems === 'function') {
      return <div className={styles.items}>{showItems([])}</div>;
    }

    return showItems ? (
      <div className={styles.items}>
        已选择&nbsp;
        <a onClick={onClickCount}>{valueCount}</a> 项
      </div>
    ) : null;
  };

  /** 是否展示清空操作 */
  const renderClean = () => {
    if (!props.actions?.clean) return null;
    return (
      <div className={styles.clean} onClick={clean}>
        清空
      </div>
    );
  };

  /** 如果没有 treeData 或者为空 */
  const isTreeDataEmpty = useMemo(
    () =>
      !props.treeData ||
      (Array.isArray(props.treeData) && props.treeData.length === 0),
    [props.treeData],
  );

  /** 弹框内容 */
  const renderContent = () => {
    return isTreeDataEmpty ? (
      <Empty description="暂无数据" />
    ) : (
      <div className={styles.pop_content}>
        <SearchTree
          value={state.value}
          // @ts-ignore
          onChange={onChangeTree}
          treeData={props.treeData}
        />
        <div className={styles.pop_footer}>
          {renderItems()}
          {/* 如果只有一个子节点, 直接显示到右侧 */}
          <div className={styles.actions}>
            {renderClean()}
            <Button
              type="primary"
              size="small"
              onClick={onOk}
              {...props.okButtonProps}
            >
              确定
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const trigger = () => {
    if (props.disabled) {
      return;
    }

    toggle();
  };

  const valueList = useMemo(
    () => (valueType === 'key' ? state.value : list.map(item => item.title)),
    [valueType, state.value, list],
  );

  return (
    <Popover
      visible={visible}
      placement="bottomLeft"
      trigger={props.trigger}
      content={renderContent()}
      getPopupContainer={() => ref.current}
      overlayStyle={{ minHeight: 400 }}
    >
      <span ref={ref} className={styles.trigger_wrapper} onClick={trigger}>
        <ValueContent {...props.valueProps} value={valueList} />
      </span>
    </Popover>
  );
};

export default DropSelect;
