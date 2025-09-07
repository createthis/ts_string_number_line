#!/usr/bin/env -S node --import tsx/esm
// ASCII/Unicode number line with ticks on '<' and '>'.
// Uses full-width spaces under '｜' to keep Markdown alignment.
const FW_BAR = '｜';
const FW_SPACE = '　';

function graph(str: string): string {
  const chars = Array.from(str);
  const n = chars.length;

  const line1 = chars.join('');
  const line2 = chars.map(c => (c === '<' || c === '>') ? '|' : (c === FW_BAR ? FW_SPACE : ' ')).join('');

  // Label positions: show 0 and every '>' index, avoiding overlap; shift left at end to fit.
  const labelPositions = [0, ...chars.map((c, i) => c === '>' ? i : -1).filter(i => i >= 0)];
  const idx = chars.map(c => c === FW_BAR ? FW_SPACE : ' ');

  let lastEnd = -1;
  for (const pos of labelPositions) {
    const lab = String(pos);
    let start = Math.min(pos, n - lab.length);
    if (start <= lastEnd) start = Math.min(n - lab.length, lastEnd + 2);
    if (start <= lastEnd) continue; // still no room
    for (let j = 0; j < lab.length && start + j < n; j++) idx[start + j] = lab[j];
    lastEnd = start + lab.length - 1;
  }

  const line3 = idx.join('');
  return [line1, line2, line3].join('\n');
}

// Demo with your string:
const s = `<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>get_time<｜tool▁sep｜>{"city": "Tokyo"}<｜tool▁call▁end｜><｜tool▁calls▁end｜>`;
console.log(graph(s));
