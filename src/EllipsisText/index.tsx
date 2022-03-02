/**
 * 显示内容区域
 */
import React, {
  useCallback,
  useMemo,
  useEffect,
  forwardRef,
  useRef,
} from 'react';
import { Typography } from 'antd';
import classnames from 'classnames';
import { DownOutlined } from '@ant-design/icons';
import useUpdateState from '@/hooks/useUpdateState';

import { EllipsisTextProps } from './interface';
import { getValueText, getLastStyles, getEllipsisText } from './helper';
import styles from './index.less';

const EllipsisText = forwardRef<any, EllipsisTextProps>((props, ref) => {
  const valueRef = useRef<any>();
  const [state, { setState }] = useUpdateState<any>({
    paragraphSuffix: '',
    ellipsis: false,
    value: props.value || [],
  });

  useEffect(() => {
    setState({ value: props.value || [] });
  }, [props.value]);

  const { suffixIcon, value, formatter, placeholder, tokenSeparator } = props;

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
  //   '>>>>>>>>>>>>getBoundingClientRect',
  // );

  // useEffect(() => {
  //   if (valueRef.current) {
  //     console.log(window.getComputedStyle(valueRef.current)?.getPropertyValue('font-size'), valueText, 'document.getElementByIdtest>>>>>>>>>>>>')
  //   }
  // }, [valueRef.current]);

  const ellipsisText = useMemo(
    () => getEllipsisText(state.value, props.ellipsisRender),
    [props.ellipsisRender, state.value],
  );

  return (
    <span className={kls} style={lastStyles} ref={ref}>
      {props.label && <span className={styles.label}>{props.label}</span>}
      <span className={styles.value} ref={valueRef}>
        {valueText.length > 0 && (
          <Typography.Paragraph
            ellipsis={{
              suffix: state.ellipsis && ellipsisText,
              onEllipsis: ellipsis => {
                setState({ ellipsis });
              },
            }}
          >
            {valueText}
          </Typography.Paragraph>
        )}
      </span>
      <span className={styles.suffix}>{renderSuffix()}</span>
    </span>
  );
});

EllipsisText.defaultProps = {
  ellipsisRender: true,
  suffixIcon: true,
  placeholder: '请选择',
};

export default React.memo(EllipsisText);
