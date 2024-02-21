figma.showUI(__html__, { width: 400, height: 220 });

function searchStickyNodes(
  node: SceneNode,
  query: string,
  regexNumbers: RegExp,
  stickyNodes: number[] = [],
) {
  if ("children" in node) {
    for (const child of node.children) {
      searchStickyNodes(child, query, regexNumbers, stickyNodes);
    }
  } else if (node.type === "STICKY" && node.text.characters.includes(query)) {
    const matches = node.text.characters.match(regexNumbers);
    if (matches) {
      matches.forEach((match) => {
        const number = parseFloat(match.slice(1, -1));
        stickyNodes.push(number);
      });
    }
  }
  return stickyNodes;
}

figma.ui.onmessage = (msg) => {
  if (msg.type === "calculate-sum-for-query-in-selection") {
    const query = msg.query;
    const regexNumbers = /\[\d+(\.\d+)?\]/g;
    let sum = 0;

    const selectedNodes = figma.currentPage.selection;
    let numbers = [] as number[];
    selectedNodes.forEach((node) => {
      numbers = numbers.concat(searchStickyNodes(node, query, regexNumbers));
    });

    sum = numbers.reduce((acc, number) => acc + number, 0);

    figma.ui.postMessage({ type: "sum-result", sum });
  }
};
