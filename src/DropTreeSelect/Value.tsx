/**
 * 显示内容区域
 */
import React, { useCallback, useMemo, forwardRef, useRef } from 'react';
// import { findDOMNode } from 'react-dom';
import classnames from 'classnames';
import { DownOutlined } from '@ant-design/icons';

import { ValueContentProps } from './interface';
import styles from './value.less';

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
  console.log(placeholder);
  if (!value || (Array.isArray(value) && !value.length)) return placeholder;
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

const ValueContent = forwardRef<any, ValueContentProps>((props, ref) => {
  const valueRef = useRef<any>();
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

  console.log(valueText, 'valueText');

  const kls = classnames(styles.content, props.className);
  const lastStyles = useMemo(() => getLastStyles(props.style, props.maxWidth), [
    props.style,
    props.maxWidth,
  ]);

  /** 获取真实 DOM 宽度等
   * 参考: https://github.com/ant-design/ant-design/blob/master/components/typography/Base.tsx
   * 1. 获取到整个 value content 宽度
   * 2. 获取到当前字体大小 及所有 value textContent 的值 整体计算后的宽度
   * 3. 如果容器宽度 大于 计算后的宽度
   *    (1). 计算整个内容区域的 分割后的长度 及 value.length 展示 等 value.length 项
   *    (2). 如果是React 组件, 参考 antd Typography 如何计算 ? 以及展示区域如何显示 ... 等
   */
  // console.log(
  //   findDOMNode(valueRef.current)?.getBoundingClientRect(),
  //   '>>>>>>>>>>>>',
  // );

  return (
    <span className={kls} style={lastStyles} ref={ref}>
      {props.label && <span className={styles.label}>{props.label}</span>}
      <span className={styles.value} ref={valueRef}>
        {valueText}
      </span>
      <span className={styles.suffix}>{renderSuffix()}</span>
    </span>
  );
});

export default ValueContent;
