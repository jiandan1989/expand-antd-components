import { ModeType, ItemData } from './interface';

/** 判断是否选中 */
export const isChecked = (selectedKeys: string[], key: string) => {
  return selectedKeys.includes(key);
};

/** 选中 keys */
export const getCheckKeys = ({
  selectedKeys,
  mode = 'multiple',
  key,
}: {
  selectedKeys: string[];
  mode?: ModeType;
  key: string;
}) => {
  if (mode === 'single') {
    return selectedKeys.includes(key) ? [] : [key];
  }

  return selectedKeys.includes(key)
    ? selectedKeys.filter(item => item !== key)
    : selectedKeys.concat(key);
};

/** 获取到选中的列表 */
export const getCheckedList = (selectedKeys: string[], data: ItemData[]) =>
  data
    .filter(item => selectedKeys.includes(item.key))
    .map(({ children, ...rest }) => rest);

export const getCheckedTitles = (selectedKeys: string[], data: ItemData[]) =>
  getCheckedList(selectedKeys, data).map(item => item.title);

/** 获取初始值 */
export const getInitValFromProps = (value?: string | string[]) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

/** 转换为列表 */
export const generateFlatDataList = <T extends object & { children?: T[] }>(
  treeData: T[],
) => {
  const dataList: T[] = [];
  const generateList = (data: T[]) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      dataList.push(node as T);
      if (node.children) {
        generateList(node.children);
      }
    }
  };

  generateList(treeData);

  return dataList;
};
