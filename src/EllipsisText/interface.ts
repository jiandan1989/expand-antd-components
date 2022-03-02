import { ReactNode } from 'react';

type RenderString = (value: string[]) => string;
export type RenderEllipsisText = RenderString | string | boolean;

export interface EllipsisTextProps {
  /** 左侧描述文案或自定义组件 */
  label?: ReactNode;
  /** 默认值 */
  value?: string[];
  /** 自定义格式化 */
  formatter?: RenderString;
  /** 传递数组时支持自定义分割符 */
  tokenSeparator?: string;
  /** 占位符 */
  placeholder?: ReactNode;
  /** 后缀 Icon */
  suffixIcon?: ReactNode | boolean;
  /** 展示省略后缀描述 */
  ellipsisRender?: RenderEllipsisText;
  /** 展示区域最大宽度 */
  maxWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}
