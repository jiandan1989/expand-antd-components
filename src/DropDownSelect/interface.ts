import { DropDownProps } from 'antd/lib/dropdown';
import { EllipsisTextProps } from '@/EllipsisText/interface';
import EllipsisText from '@/EllipsisText';

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
export type ActionType = {
  clear: () => void;
  onOk: () => void;
};

export interface DropDownSelectProps {
  value?: string | string[] /** | Omit<ItemData, 'children'>[]; */;
  onChange?(keys: string[], checkData: Omit<ItemData, 'children'>[]): void;
  onOk?(): void;
  trigger?: DropDownProps['trigger'];
  dataSource: ItemData[];
  /** 是否支持搜索 */
  showSearch?: boolean;
  /** 节点前是否展示 checkbox */
  checkable?: boolean;
  /** 自定义 */
  renderMenuItem?(item: ItemData): JSX.Element;
  /** 选择模式 */
  mode?: ModeType;
  /** 是否展示打勾 */
  showTick?: boolean;
  /** 内容区 */
  valueProps?: Omit<EllipsisTextProps, 'value'>;
  footerRender?: ((actions?: ActionType) => JSX.Element) | boolean;
}

export interface DropDownSelectInt extends React.FC<DropDownSelectProps> {
  EllipsisText: typeof EllipsisText;
}

declare const DropDownSelect: DropDownSelectInt;

export default DropDownSelect;
