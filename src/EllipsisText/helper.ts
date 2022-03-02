import { RenderEllipsisText } from './interface';

/** 获取内容展示 */
export const getValueText = ({
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

/** @todo: 是否需要判断如果小于一定的值就无法正常显示 value */
const baseWidth = 300;
const baseStyle = { maxWidth: baseWidth };

export const getLastStyles = (
  style?: React.CSSProperties,
  maxWidth?: number,
) => {
  if (maxWidth) {
    return Object.assign(baseStyle, { maxWidth }, style);
  }

  return Object.assign(baseStyle, style);
};

/** 获取省略后的文本 */
export const getEllipsisText = (
  value: string[],
  ellipsisRender: RenderEllipsisText = '',
) => {
  if (typeof ellipsisRender === 'function') {
    return ellipsisRender(value);
  }

  if (typeof ellipsisRender === 'boolean') {
    return `等 ${value.length} 项`;
  }

  return ellipsisRender;
};
