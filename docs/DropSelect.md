## 下拉树形搜索

### 正常模式

```tsx
import React, { useState } from 'react';
import { DropSelect } from 'expand-antd-components';
import treeData from './_mock.ts';

const defaultValue = ['0-0-0', '0-0-0-1'];

export default () => {
  const [value, setValue] = useState<string[]>(defaultValue);
  return (
    <DropSelect
      value={value}
      onChange={val => {
        setValue(val);
      }}
      actions={{ clean: true }}
      treeData={treeData}
      valueProps={{
        className: 'test',
        label: '左侧',
        formatter: val => val.join('ab'),
      }}
    />
  );
};
```

### 表单使用

```tsx
import React, { useState } from 'react';
import { Form } from 'antd';
import { DropSelect } from 'expand-antd-components';
import treeData from './_mock.ts';

const defaultValue = ['0-0-0', '0-0-0-1'];
const layout = {
  wrapperCol: { span: 16 },
  labelCol: { span: 8 },
};

export default () => {
  const [value, setValue] = useState<string[]>(defaultValue);
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      onValuesChange={changedValues => {
        setValue(changedValues.data);
      }}
      {...layout}
      initialValues={{ data: value }}
    >
      <Form.Item label="测试" name="data">
        <DropSelect
          treeData={treeData}
          valueProps={{
            label: '描述信息: ',
          }}
          actions={{ clean: true }}
        />
      </Form.Item>
      <Form.Item label="表单值">
        <pre>{JSON.stringify(value, null, 2)}</pre>
      </Form.Item>
    </Form>
  );
};
```

### API

| 属性            | 说明                                  | 类型                                                        | 默认值  |
| :-------------- | :------------------------------------ | :---------------------------------------------------------- | ------- |
| `okButtonProps` | 确定按钮                              | [ButtonProps](https://ant.design/components/button-cn/#API) | `-`     |
| `trigger`       | 触发类型(`有bug`)                     | 可参考 `Tooltip 类型`                                       | `click` |
| `showSearch`    | 是否允许搜索(`@todo`)                 | `boolean`                                                   | `true`  |
| `treeData`      | 树形结构数据                          | `TreeData`                                                  | `[]`    |
| `value`         | `默认值 对应的是 Tree 的 checkedKeys` | `string[]`                                                  | `[]`    |
| `valueProps`    | 选中后显示的内容                      | `参考 ValueContent`                                         | `-`     |
| `onChange`      | 修改回调                              | `(keys: ValueType) => void`                                 | `-`     |
| `disabled`      | 是否允许点击确定(`有bug`)             | `boolean`                                                   | `false` |

### ValueContent

- 可单独使用

| 属性             | 说明                       | 类型                           | 默认值         |
| :--------------- | :------------------------- | :----------------------------- | -------------- |
| `value`          | 展示值                     | `string[]`                     | `[]`           |
| `label`          | 左侧描述文案或自定义组件   | `ReactNode`                    | `-`            |
| `formatter`      | 自定义格式化               | `(value: string[]) => string;` | `-`            |
| `tokenSeparator` | 传递数组时支持自定义分割符 | `string`                       | `,(英文逗号)`  |
| `placeholder`    | 占位符(`value`为空时展示)  | `ReactNode`                    | `请选择`       |
| `suffixIcon`     | 后缀 Icon                  | `ReactNode | boolean`          | `DownOutlined` |
| `maxWidth`       | 展示区域最大宽度           | `number`                       | `300`          |

### SearchTree

- 可单独使用

| 属性         | 说明         | 类型                       | 默认值 |
| :----------- | :----------- | :------------------------- | ------ |
| `showSearch` | 是否支持搜索 | `boolean`                  | `true` |
| `treeData`   | 树形结构的值 | `TreeData`                 | `-`    |
| `value`      | 默认值       | `string[]`                 | `-`    |
| `onChange`   | 监听选择事件 | `(keys: string[]) => void` | `-`    |

### 其他问题

- 这里为什么不使用 `TreeSelect` 呢 ?

> 其实 TreeSelect 如果没有记错的话有一个可以控制自动展开 `autoFocus`的属性, 但是 API 中并没有体现出来,使用 TreeSelect 也是可以的
