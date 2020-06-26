# 最终版

> 思前想后还是使用 Popover 和 Menu 以及 Tree 三者的结合

```tsx
import React, { useState, Fragment } from 'react';
import { Form, Card, Tooltip, Tag, Popover } from 'antd';
import { DropTreeSelect } from 'expand-antd-components';
import { Random } from 'mockjs';

const data = Array(50)
  .fill(1)
  .map(() => ({
    key: Random.id(),
    title: Random.city(),
    disabled: Random.boolean(),
    children:
      Random.natural(1, 10) % 9 === 8
        ? Array(4)
            .fill(1)
            .map(() => ({
              key: Random.id(),
              title: Random.cname(),
            }))
        : [],
  }));

const defaultValue = data
  .filter((item: any, idx: number) => idx % 5 === 0 && !item.disabled)
  .map(item => item.key);

/** 获取滚动高度 */
const getScrollTop = (target, values) => {
  const firstKey = values[0] || '';

  const dom = document.getElementById(`${firstKey}`);
  if (dom) {
    const { height } = dom.getBoundingClientRect();
    const offsetTop = dom.offsetTop;
    return offsetTop - height;
  }
  return target.scrollTop;
};

export default () => {
  const [form] = Form.useForm();
  const [initValue, setInitValue] = useState({
    single: defaultValue[0],
    multiple: defaultValue,
  });

  return (
    <Fragment>
      <Card title="普通模式 单选">
        <DropTreeSelect
          dataSource={data}
          mode="single"
          valueProps={{ label: '单选' }}
        />
      </Card>
      <Card title="普通模式 多选">
        <DropTreeSelect
          mode="multiple"
          dataSource={data}
          actions={{ clean: true }}
          valueProps={{ label: '多选' }}
        />
      </Card>
      <Card title="单选-自定义渲染">
        <DropTreeSelect
          dataSource={data}
          mode="single"
          renderItem={item => {
            return (
              <Tooltip title={`自定义渲染-${item.title}`}>
                <span>{item.title}</span>
              </Tooltip>
            );
          }}
          valueProps={{ label: 'renderItem' }}
        />
      </Card>
      <Card title="多选-自定义渲染">
        <DropTreeSelect
          dataSource={data}
          mode="multiple"
          renderItem={item => {
            return (
              <Popover
                content={<pre>{JSON.stringify(item, null, 2)}</pre>}
                title={`多选-自定义渲染(${item.title})`}
              >
                {item.title}
              </Popover>
            );
          }}
          actions={{ clean: true }}
          valueProps={{ label: '多选-自定义渲染' }}
        />
      </Card>
      <Card title="点击滚动">
        <DropTreeSelect
          dataSource={data}
          onCountClick={(target, values) => {
            const top = getScrollTop(target, values);
            target.scrollTop = top;
          }}
          renderItem={item => {
            return item.title;
          }}
          actions={{ clean: true }}
          valueProps={{ label: '点击滚动-onCountClick' }}
        />
      </Card>
    </Fragment>
  );
};
```

### API

```ts
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
  // contentRender?: (() => JSX.Element) | boolean;
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
```
