type RenderString = (value: string[]) => string;
export type RenderEllipsisText = RenderString | string | boolean;

/** 箭头渲染: 自定义渲染 根据 visible 定义 */
type LabelArrow = boolean | ((open: boolean) => React.ReactNode);

export interface LabelProps {
  /** 尺寸大小 */
  size?: 'small' | 'default' | 'large';
  /** 是否显示边框 */
  bordered?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否显示箭头 */
  arrow?: LabelArrow;
  /** 是否显示清空操作 */
  allowClear?: boolean;
  onClear?: () => void;
  /** 左侧描述文案或自定义组件 */
  label?: React.ReactNode;
  /** 默认值 */
  value?: string[];
  /** 自定义格式化 */
  formatter?: RenderString;
  /** 传递数组时支持自定义分割符 */
  tokenSeparator?: string;
  /** 占位符 */
  placeholder?: React.ReactNode;
  /** 后缀 Icon */
  suffixIcon?: React.ReactNode | boolean;
  /** 展示省略后缀描述 */
  ellipsis?: RenderEllipsisText;
  /** 展示区域最大宽度 */
  maxWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}
