/**
 * 显示内容区域
 */
import React, { FC } from 'react';
import { ValueContentProps } from '../interface';
import styles from './index.less';

const ValueContent: FC<ValueContentProps> = props => {
  return (
    <span className={styles.content_wrapper}>
      {props.label && <span>{props.label}</span>}
    </span>
  );
};

export default ValueContent;
