import { PopoverProps } from 'antd/lib/popover';
import { EllipsisTextProps } from '@/EllipsisText/interface';
import { ReactNode } from 'react';

export declare type ActionType = string;

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
  renderItem?(item: ItemData): JSX.Element;
  valueProps?: Omit<EllipsisTextProps, 'value'>;
  /** 底部操作: 是否需要清空操作 */
  actions?: { clean?: boolean };
  /** 是否展示选择项 */
  itemsRender?: ((value: EllipsisTextProps['value']) => ReactNode) | boolean;
  /** 确定回调 */
  onOk?(value: string[]): void;
  /** 点击展示选中项的回调 */
  onCountClick?(target: HTMLDivElement | null, selectedKeys: string[]): void;
}

declare const DropTreeSelect: DropTreeSelectInt;

export default DropTreeSelect;
