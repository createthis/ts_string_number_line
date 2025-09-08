#!/usr/bin/env -S node --import tsx/esm
const FW_BAR = '｜', FW_SPACE = '　';

export function graphBytes(str: string): string {
  const chars = Array.from(str);
  const n = chars.length;

  // byte offset for each character (start byte of that code point)
  const enc = new TextEncoder();
  const byteStart: number[] = [];
  let off = 0;
  for (const ch of chars) { byteStart.push(off); off += enc.encode(ch).length; }

  // line1
  const line1 = chars.join('');

  // line2: ticks + FW spaces; suppress '<' when immediately preceded by '>'
  const tickArr = chars.map((c, i) => {
    if (c === FW_BAR) return FW_SPACE;
    if (c === '<' && i > 0 && chars[i - 1] === '>') return ' ';
    return (c === '<' || c === '>') ? '|' : ' ';
  });
  const line2 = tickArr.join('');

  // line3: labels per tick using BYTE offsets; propagate FW spaces with overlap rules
  const labelArr = Array.from({ length: n }, (_, i) => tickArr[i] === FW_SPACE ? FW_SPACE : ' ');
  const tickPos = tickArr.map((c, i) => c === '|' ? i : -1).filter(i => i >= 0);

  for (let t = 0; t < tickPos.length; t++) {
    const pos = tickPos[t];
    const lab = String(byteStart[pos]);
    let start = Math.min(pos, n - lab.length);

    let overlapped = false;
    for (let j = 0; j < lab.length; j++) {
      if (tickArr[start + j] === FW_SPACE) overlapped = true;
      labelArr[start + j] = lab[j];
    }

    if (overlapped) {
      const after = start + lab.length;
      const last = (t === tickPos.length - 1);
      if (after < n) {
        labelArr[after] = FW_SPACE;            // put FW space AFTER label
      } else if (last && start > 0) {
        labelArr[start - 1] = FW_SPACE;        // no room after: BEFORE label
      }
    }
  }

  return [line1, line2, labelArr.join('')].join('\n');
}

// Demo:
const s = `<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>get_time<｜tool▁sep｜>{"city": "Tokyo"}<｜tool▁call▁end｜><｜tool▁calls▁end｜>`;
console.log(graphBytes(s));

