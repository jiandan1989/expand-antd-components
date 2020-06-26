import { ReactNode } from 'react';
import { ActionType } from 'rc-trigger/lib/interface';
import { ButtonProps } from 'antd/lib/button';
import { DropDownProps } from 'antd/lib/dropdown';
import { DataNode } from 'rc-tree/lib/interface';
import { PopoverProps } from 'antd/lib/popover';
import { EllipsisTextProps } from '@/EllipsisText/interface';

export declare type RenderFunction = () => React.ReactNode;

type FilterOmitTypes = 'defaultVisible' | 'visible';

/** 搜索树 */
export interface SearchTreeProps {
  /** 是否支持搜索 */
  showSearch?: boolean;
  /** 树形结构的值 */
  treeData: DataNode[];
  /** 默认值 对应的是 Tree 的 checkedKeys */
  value?: string[];
  /** 监听选择事件 */
  onChange?: (keys: string[], checkedList?: any[]) => void;
}

type ExtendsType = Omit<PopoverProps, FilterOmitTypes> & SearchTreeProps;
export interface DropSelectProps extends ExtendsType {
  // @todo: 是否支持全选
  /** 是否禁止点击: 如果是 Button 或其他支持 disabled 属性 可添加 */
  disabled?: boolean;
  okButtonProps: Omit<ButtonProps, 'onClick' | 'size' | 'type'> & {
    disabled?: boolean;
  };
  /** 触发 */
  trigger?: ActionType | ActionType[];
  valueProps?: Omit<EllipsisTextProps, 'value'>;
  /** 展示内容 value 的类型 */
  valueType: 'key' | 'title';
  /** 是否展示选择项 */
  showItems?: (value: EllipsisTextProps['value']) => ReactNode | boolean;
  /** 点击已选择项目数回调函数 */
  onItemsClick?(count: number): void;
  /** 底部操作: 是否需要清空操作 */
  actions?: { clean?: boolean };
  renderFooter?: (actions: Required<DropSelectProps['actions']>) => ReactNode;
  /** 确定回调 */
  onOk?(value: string[]): void;
}

/** 下拉展示内容操作 */
export interface PopContentProps {}

/** 使用 DropDown版本 */
export interface DropDownSelectProps {
  trigger?: DropDownProps['trigger'];
}
