# 最终版

> 思前想后还是使用 Popover 和 Menu 以及 Tree 三者的结合

```tsx
import React, { useState, Fragment } from 'react';
import { Form, Card, Tooltip } from 'antd';
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

export default () => {
  const [form] = Form.useForm();
  const [initValue, setInitValue] = useState({
    single: defaultValue[0],
    multiple: defaultValue,
  });

  return (
    <Fragment>
      <DropTreeSelect valueProps={{ label: '占位' }} dataSource={data} />
    </Fragment>
  );
};
```
