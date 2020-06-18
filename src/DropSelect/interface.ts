import { ReactNode } from 'react';
import { ActionType } from 'rc-trigger/lib/interface';
import { TreeProps as RcTreeProps } from 'rc-tree';
import { PopoverProps } from 'antd/lib/popover';

export type ValueType = string[];
export interface ValueContentProps {
  /** 左侧描述文案或自定义组件 */
  label?: ReactNode;
  /** 默认值 */
  value?: ValueType;
  /** 自定义格式化 */
  formatter?: (value: ValueType) => string;
  /** 传递数组时支持自定义分割符 */
  /** 占位符 */
  placeholder?: ReactNode;
}

type FilterOmitTypes = 'defaultVisible' | 'visible';

export interface DropSelectProps extends Omit<PopoverProps, FilterOmitTypes> {
  /** 是否禁止点击: 如果是 Button 或其他支持 disabled 属性 可添加 */
  disabled?: boolean;
  /** 触发 */
  trigger?: ActionType | ActionType[];
  valueProps?: ValueContentProps;
}

/** 搜索树 */
export interface SearchTreeProps {
  /** 树形结构的值 */
  treeData?: RcTreeProps['treeData'];
  /** 默认值 */
  value?: ValueType[];
  /** 监听选择事件 */
  onChange?: (checkedKeys: ValueType) => void;
}
