/** 树形结构扁平化 */
export const treeDataToPlanishData = (
  list: any,
  parent?: any,
  level = 0,
  clues = [],
) => {
  return list.reduce((prev: any, { children = [], ...rest }) => {
    const parentKey = parent || '';
    const keyClues = clues.concat(rest.key);
    return prev.concat(
      { ...rest, parentKey, level, isLeaf: !!parentKey, keyClues },
      treeDataToPlanishData(children, rest.key, level + 1, keyClues),
    );
  }, []);
};

export type FlatData = {
  key: string;
  parentKey: string;
};

/** 扁平数据转树形 */
export const planishDataToTreeData = (data: FlatData[]) => {
  const idMap: { [key: string]: any } = {};
  const jsonTree: any[] = [];
  data.forEach(v => {
    idMap[v.key] = v;
  });
  data.forEach(v => {
    const parent = idMap[v.parentKey];
    if (parent) {
      parent.children = parent.children || [];
      parent.children.push(v);
    } else {
      jsonTree.push(v);
    }
  });

  return jsonTree;
};
