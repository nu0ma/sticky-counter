figma.showUI(__html__, { width: 240, height: 140 });

figma.ui.onmessage = msg => {
  if (msg.type === 'calculate-sum-for-query-in-selection') {
    const query = msg.query as string;
    const selectedNodes = figma.currentPage.selection.filter(node => node.type === 'STICKY' && node.text.characters.includes(query)) as StickyNode[];
    let sum = 0;

    console.log("selectedNodes", selectedNodes);
    if(selectedNodes.length === 0) {
      figma.notify("No stickies found with the query");
      return;
    }

    selectedNodes.forEach(node => {
      const matches = node.text.characters.match(/\[\d+\]/g);
      if (matches) {
        matches.forEach((match: string) => {
          // 抽出した文字列から数字部分を取得し、整数に変換
          const number = parseInt(match.match(/\d+/)![0], 10);
          sum += number;
        });
      }
    });

    // 計算結果をUIに送信
    figma.ui.postMessage({ type: 'sum-result', sum });
  }
};


figma.showUI(__html__, { width: 240, height: 100 });

