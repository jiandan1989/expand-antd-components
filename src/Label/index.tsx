import React from 'react';
import classNames from 'classnames';
import { CloseCircleFilled, DownOutlined } from '@ant-design/icons';

import { getPrefixCls } from '@/util';
import { LabelProps } from './types';
import useResizeRect from './useResizeRect';

import './index.less';

const prefixCls = getPrefixCls('label');

const Label: React.FC<LabelProps> = props => {
  const {
    arrow,
    label,
    value,
    style,
    disabled,
    bordered,
    className,
    allowClear,
    onClear,
  } = props;
  const [containerRef] = useResizeRect<HTMLSpanElement>();

  const wrapperKls = classNames(prefixCls, className, {
    [`${prefixCls}-disabled`]: disabled,
    [`${prefixCls}-bordered`]: bordered,
    [`${prefixCls}-allow-clear`]: allowClear,
  });

  // /** 动态计算允许包含多少文字 */
  // useEffect(() => {
  //   if (containerRef.current && value) {
  //     const textLen = value.length;
  //     const fontSize = toNumber(
  //       window
  //         .getComputedStyle(containerRef.current)
  //         .fontSize?.replace('px', ''),
  //     );
  //     const containerWidth =
  //       rect.width || containerRef.current.getBoundingClientRect().width;

  //     /** 计算可容纳的字符长度 */
  //     const allowSize = containerWidth / fontSize;
  //     if (allowSize <= textLen) {
  //       const sliceText = value.slice(0, Math.abs(allowSize - 6));
  //       console.log(sliceText, 'sliceText>>>>>>>>>>>>');
  //     }
  //   }
  // }, [containerRef, rect.width, value]);

  return (
    <div style={style} className={wrapperKls}>
      {label && <span className={`${prefixCls}-prefix`}>{label}</span>}
      <span ref={containerRef} className={`${prefixCls}-content`}>
        {value}
      </span>
      {/* 有值 且 允许 && 非禁止 */}
      {value && allowClear && !disabled && (
        <CloseCircleFilled
          className={`${prefixCls}-icon ${prefixCls}-clear`}
          onClick={evt => {
            if (!disabled && typeof onClear === 'function') {
              onClear();
            }
            evt.stopPropagation();
          }}
        />
      )}
      {arrow && (
        <DownOutlined className={`${prefixCls}-icon ${prefixCls}-arrow`} />
      )}
    </div>
  );
};

Label.defaultProps = {
  disabled: false,
  bordered: true,
  allowClear: true,
  arrow: true,
};

export default Label;
