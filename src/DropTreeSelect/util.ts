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
// /** 获取选中的 列表 */
// export const getCheckedList = (flatData: any[], keys: string[]) => {
//   if ((Array.isArray(keys) && keys.length === 0) || !keys) return [];
//   return flatData.filter((item: any) => keys.includes(item.key));
// };

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
export const generateFlatDataList = (treeData: ItemData[]) => {
  const dataList: ItemData[] = [];
  const generateList = (data: ItemData[]) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      dataList.push(node as ItemData);
      if (node.children) {
        generateList(node.children);
      }
    }
  };

  generateList(treeData);

  return dataList;
};

/** 获取展开的 keys */
// @ts-ignore
export const getParentKey = (key: string, tree: ItemData[]) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

/** 展开的 keys */
export const getExpandedKeys = (treeData: ItemData[], value: string) => {
  /** 扁平化后的数据 */
  const dataList = generateFlatDataList(treeData);
  return dataList
    .map(item => {
      if (item.title.indexOf(value) > -1) {
        return getParentKey(item.key, treeData);
      }
      return null;
    })
    .filter((item, i, self) => item && self.indexOf(item) === i);
};
