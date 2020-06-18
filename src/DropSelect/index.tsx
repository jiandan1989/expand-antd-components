import React, { FC, useRef } from 'react';
import { Popover } from 'antd';
import { useBoolean } from 'ahooks';

import ValueContent from './ValueContent';
import styles from './index.less';
import { DropSelectProps } from './interface';
import SearchTree from './SearchTree';
import PopFooter from './PopFooter';

const DropSelect: FC<DropSelectProps> = props => {
  const ref = useRef<any>();
  /** 控制是否显示 */
  const [visible, { toggle }] = useBoolean(false);

  const renderChild = () => {
    return <ValueContent {...props.valueProps} />;
  };

  /** 弹框内容 */
  const renderContent = () => {
    return (
      <div>
        <SearchTree />
        <PopFooter />
      </div>
    );
  };

  const trigger = () => {
    if (props.disabled) {
      return;
    }

    toggle();
  };

  return (
    <Popover
      visible={visible}
      placement="bottom"
      trigger={props.trigger}
      content={renderContent()}
      getPopupContainer={() => ref.current}
      overlayStyle={{ minHeight: 400 }}
    >
      <span ref={ref} className={styles.trigger_wrapper} onClick={trigger}>
        {renderChild()}
      </span>
    </Popover>
  );
};

export default DropSelect;
