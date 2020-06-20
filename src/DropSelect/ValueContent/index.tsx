/**
 * 显示内容区域
 */
import React, { FC, useCallback, useMemo } from 'react';
import classnames from 'classnames';
import { DownOutlined } from '@ant-design/icons';

import { ValueContentProps } from '../interface';
import styles from './index.less';

const baseWidth = 300;
const baseStyle = { maxWidth: baseWidth };

/** @todo: 是否需要判断如果小于一定的值就无法正常显示 value */
const getLastStyles = (style?: React.CSSProperties, maxWidth?: number) => {
  if (maxWidth) {
    return Object.assign(baseStyle, { maxWidth }, style);
  }

  return Object.assign(baseStyle, style);
};

/** 获取内容展示 */
const getValueText = ({
  value,
  formatter,
  placeholder,
  tokenSeparator,
}: any) => {
  if (!value) return placeholder;
  /** 优先使用接收到的格式化函数 */
  if (formatter) {
    return formatter(value);
  }
  if (Array.isArray(value)) {
    return value.join(tokenSeparator || ',');
  }
  if (typeof value === 'string') {
    return value;
  }

  return value || placeholder;
};

const ValueContent: FC<ValueContentProps> = props => {
  const {
    suffixIcon = true,
    value,
    formatter,
    placeholder,
    tokenSeparator,
  } = props;

  /** 后缀 Icon */
  const renderSuffix = useCallback(() => {
    const defaultIcon = <DownOutlined />;
    if (!suffixIcon) return null;
    if (typeof suffixIcon === 'boolean') {
      return defaultIcon;
    }

    return suffixIcon;
  }, [suffixIcon]);

  /** 获取最终的 value @todo: 需要计算当前的宽度, 设置等几项 */
  const valueText = useMemo(
    () => getValueText({ value, tokenSeparator, placeholder, formatter }),
    [props.value],
  );

  const kls = classnames(styles.content, props.className);
  const lastStyles = useMemo(() => getLastStyles(props.style, props.maxWidth), [
    props.style,
    props.maxWidth,
  ]);

  return (
    <span className={kls} style={lastStyles}>
      {props.label && <span className={styles.label}>{props.label}</span>}
      <span className={styles.value}>{valueText}</span>
      <span className={styles.suffix}>{renderSuffix()}</span>
    </span>
  );
};

export default ValueContent;
