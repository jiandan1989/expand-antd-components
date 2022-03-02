export const hasUnLoadNode = node => {
  let status = false;
  const loop = data =>
    data.forEach(item => {
      if (item.props.children && !status) {
        if (item.props.children.length === 0) {
          status = true;
          return;
        }
        loop(item.props.children);
      }
    });
  loop(node);

  return status;
};

/** 树形扁平化 */
export const treeDataToPlanishData = (list, parent, level = 0, clues = []) => {
  // eslint-disable-line
  return list.reduce((prev, { children = [], ...rest }) => {
    const parentKey = parent || '';
    const keyClues = clues.concat(rest.key);
    return prev.concat(
      {
        ...rest,
        parentKey,
        level,
        isLeaf: !!parentKey,
        keyClues,
      },
      treeDataToPlanishData(children, rest.key, level + 1, keyClues),
    );
  }, []);
};

export const planishDataToTreeData = data => {
  const idMap = {};
  const jsonTree = [];
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

/**
 * @desc: 重置数据结构
 * @param
 * 1. targetKeys: 目标 keys
 * 2. selectedKeys: 源数据 keys
 * 3. dataSource: 源数据
 */
export const getStateValues = ({ targetKeys, selectedKeys, dataSource }) => {
  // 扁平化源数据
  const planishDataSource = treeDataToPlanishData(dataSource);
  const leafKeys = planishDataSource
    .filter(item => item.isLeaf)
    .map(item => item.key);
  // 右侧扁平结构
  const rightPlaishData =
    targetKeys.length > 0
      ? planishDataSource.filter(item =>
          item.keyClues.some(k => targetKeys.includes(k)),
        )
      : [];
  // 右侧树形结构
  const rightDataSource = planishDataToTreeData(rightPlaishData);
  const newTargetKeys = rightPlaishData.map(item => item.key);
  // 左侧扁平数据
  const leftPlanishData = treeDataToPlanishData(dataSource);
  const sdData =
    selectedKeys.length > 0
      ? leftPlanishData.filter(item =>
          item.keyClues.some(k => selectedKeys.includes(k)),
        )
      : [];
  /**
   * @todo
   * 1. targetKeys 中 有 selectedKeys 中的数据时, 应禁用, 现状为使用了 targetKeys, 点击穿梭时,将数据清空了
   */
  return {
    planishDataSource,
    leafKeys,
    selectedKeys,
    targetKeys: newTargetKeys,
    leftDataSource: dataSource,
    leftPlanishData,
    rightDataSource,
    rightPlaishData,
    sdData,
  };
};
