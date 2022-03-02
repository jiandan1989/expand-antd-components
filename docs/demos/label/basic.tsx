import React, { useState } from 'react';
import { Label } from 'expand-antd-components';
import { Input } from 'antd';

export default () => {
  const [value, setValue] = useState('我曾经跨过山和大海');

  return (
    <React.Fragment>
      <Input
        value={value}
        onChange={evt => {
          setValue(evt.target.value);
        }}
      />
      <Label
        value={value}
        label="中国"
        onClear={() => {
          setValue('');
        }}
      />
    </React.Fragment>
  );
};
