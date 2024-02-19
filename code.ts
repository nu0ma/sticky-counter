figma.showUI(__html__, { width: 400, height: 220 });

figma.ui.onmessage = (msg) => {
  if (msg.type === "calculate-sum-for-query-in-selection") {
    const regexNumbers = /\[\d+\]/g;

    const selectedNodes = figma.currentPage.selection.filter(
      (node) =>
        node.type === "STICKY" && node.text.characters.includes(msg.query),
    ) as StickyNode[];

    let sum = 0;

    for (const node of selectedNodes) {
      const matches = node.text.characters.match(regexNumbers);
      if (matches) {
        for (const match of matches) {
          const number = parseInt(match.slice(1, -1), 10);
          sum += number;
        }
      }
    }

    figma.ui.postMessage({ type: "sum-result", sum });
  }
};
