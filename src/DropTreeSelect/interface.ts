import { ReactNode } from 'react';
import { PopoverProps } from 'antd/lib/popover';

export declare type ActionType = string;

interface BaseProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface ValueContentProps extends BaseProps {
  /** 左侧描述文案或自定义组件 */
  label?: ReactNode;
  /** 默认值 */
  value?: string[];
  /** 自定义格式化 */
  formatter?: (value: string[]) => JSX.Element;
  /** 传递数组时支持自定义分割符 */
  tokenSeparator?: string;
  /** 占位符 */
  placeholder?: ReactNode;
  /** 后缀 Icon */
  suffixIcon?: ReactNode | boolean;
  /** 展示区域最大宽度 */
  maxWidth?: number;
}

export type ItemData = {
  /** 唯一的 key, 必须要有, 不做兼容 */
  key: string;
  /** 标题及文本 */
  title: string;
  /** 是否禁选 */
  disabled?: boolean;
  children?: ItemData[];
};

/** 单选 | 多选 */
export type ModeType = 'multiple' | 'single';
export type TypeFilters = 'visible' | 'getPopupContainer' | 'content';

export type DropTreeSelectState = {
  /** 搜索值 */
  searchValue: string;
  selectedKeys: string[];
};

export interface DropTreeSelectInt extends Omit<PopoverProps, TypeFilters> {
  onChange?(
    keys: string[] /**, checkData: Omit<ItemData, 'children'>[] */,
  ): void;
  dataSource: ItemData[];
  /** 选择模式: 单选 多选 */
  mode?: ModeType;
  value?: string | string[] /** | Omit<ItemData, 'children'>[]; */;
  showSearch?: boolean;
  contentRender?: (() => JSX.Element) | boolean;
  renderItem?(item: ItemData): JSX.Element;
  valueProps?: Omit<ValueContentProps, 'value'>;
}

declare const DropTreeSelect: DropTreeSelectInt;

export default DropTreeSelect;
