import { DataNode } from 'rc-tree/lib/interface';

export type ExpandedDataNode = Omit<DataNode, 'title' | 'key'> & {
  title: string;
  key: string;
};

/** 转换为列表 */
export const generateFlatDataList = (treeData: DataNode[]) => {
  const dataList: ExpandedDataNode[] = [];
  const generateList = (data: DataNode[]) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      dataList.push(node as ExpandedDataNode);
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
export const getParentKey = (key: string, tree: DataNode[]) => {
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
export const getExpandedKeys = (treeData: DataNode[], value: string) => {
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

/** 获取选中的 列表 */
export const getCheckedList = (flatData: any[], keys: string[]) => {
  if ((Array.isArray(keys) && keys.length === 0) || !keys) return [];
  return flatData.filter((item: any) => keys.includes(item.key));
};
