# DropDownSelect

> 使用 Dropdown 结合 Menu 实现版本

```tsx
import React, { useState, Fragment } from 'react';
import { Form, Card, Tooltip } from 'antd';
import { DropDownSelect } from 'expand-antd-components';
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

export default () => {
  const [form] = Form.useForm();
  const [initValue, setInitValue] = useState({
    single: defaultValue[0],
    multiple: defaultValue,
  });

  return (
    <Fragment>
      <Card title="常规模式">
        <DropDownSelect
          dataSource={data}
          value={defaultValue[0]}
          valueProps={{ label: '常规模式' }}
        />
      </Card>
      <Card title="多选">
        <DropDownSelect
          mode="multiple"
          dataSource={data}
          valueProps={{ label: '多选' }}
        />
      </Card>
      <Card title="测试自定义 renderMenuItem">
        <DropDownSelect
          dataSource={data}
          valueProps={{ label: '测试自定义' }}
          renderMenuItem={item => <span>自定义-{item.title}</span>}
        />
      </Card>
      <Card title="测试自定义 footerRender">
        <DropDownSelect
          dataSource={data}
          valueProps={{ label: '测试自定义 footerRender' }}
          footerRender="测试用的, 啥也不干"
        />
      </Card>
      <Card title="测试自定义 value format">
        <DropDownSelect
          dataSource={data}
          mode="multiple"
          valueProps={{
            label: 'value formatter',
            formatter: values => {
              return (
                <Tooltip title={values.join(', ')}>{values.join('<>')}</Tooltip>
              );
            },
          }}
        />
      </Card>
      <Card title="表单多选">
        <Form
          form={form}
          initialValues={initValue}
          onValuesChange={(changedValues, allValues) => {
            console.log(allValues, '>>>>>>>>>..');
            setInitValue(allValues);
          }}
        >
          <Form.Item label="单选" name="single">
            <DropDownSelect dataSource={data} valueProps={{ label: '单选' }} />
          </Form.Item>
          <Form.Item label="多选" name="multiple">
            <DropDownSelect
              mode="multiple"
              dataSource={data}
              valueProps={{ label: '多选' }}
            />
          </Form.Item>
        </Form>
        <pre>{JSON.stringify(initValue, null, 2)}</pre>
      </Card>
    </Fragment>
  );
};
```

### API

- 可单独使用

| 属性             | 说明                                      | 类型                            | 默认值   |
| :--------------- | :---------------------------------------- | :------------------------------ | -------- |
| `value`          | 展示值                                    | `string[]\|string`              | `[]`     |
| `valueProps`     | 选中后显示的内容                          | `参考 ValueContent`             | `-`      |
| `onChange`       | 修改回调                                  | `(keys: ValueType) => void`     | `-`      |
| `dataSource`     | 渲染数据                                  | `ItemData[]`                    | `[]`     |
| `renderMenuItem` | 自定义渲染单个 `Menu.Item` 内容           | `(item: ItemData): JSX.Element` | `-`      |
| `checkable`      | 节点前是否展示 `checkbox`(只在多选时可用) | `boolean`                       | `false`  |
| `mode`           | 选择模式                                  | `ModeType`                      | `single` |
| `showTick`       | 选中是否打勾                              | `boolean`                       | `true`   |
| `showSearch`     | 是否支持搜索(`@todo`)                     | `boolean`                       | `false`  |

```ts
/** 其他类型: 自定义 footer */
footerRender?: ((actions?: ActionType) => JSX.Element) | boolean;

/** 数据类型 */
type ItemData = {
  /** 唯一的 key, 必须要有, 不做兼容 */
  key: string;
  /** 标题及文本 */
  title: string;
  /** 是否禁选 */
  disabled?: boolean;
  children?: ItemData[];
};

```

### Bugs

- TypeError: onItemHover is not a function: 可能是 Menu.Divider 引起的 待排查
