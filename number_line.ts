#!/usr/bin/env -S node --import tsx/esm
const FW_BAR='｜', FW_SPACE='　';

function graph(str:string):string{
  const chars=[...str], n=chars.length;

  // line1: the string
  const line1=chars.join('');

  // line2: ticks + full-width spaces under FW bars; suppress '<' when preceded by '>'
  const tickArr=chars.map((c,i)=>{
    if(c===FW_BAR) return FW_SPACE;
    if(c==='<' && i>0 && chars[i-1]==='>') return ' ';
    return (c==='<'||c==='>') ? '|' : ' ';
  });
  const line2=tickArr.join('');

  // line3: labels for every tick; propagate FW spaces per rule 3/4
  const labelArr=Array.from({length:n},(_,i)=> tickArr[i]===FW_SPACE ? FW_SPACE : ' ');
  const tickPositions=tickArr.map((c,i)=> c==='|'?i:-1).filter(i=>i>=0);

  for(const pos of tickPositions){
    const lab=String(pos);
    let start=Math.min(pos, n-lab.length);
    // write label digits
    for(let j=0;j<lab.length;j++) labelArr[start+j]=lab[j];
    // if any FW space sits under the label span, move one FW space to immediately after the label
    const overlapped=Array.from({length:lab.length},(_,j)=> start+j)
      .some(k=> tickArr[k]===FW_SPACE);
    if(overlapped && start+lab.length<n) labelArr[start+lab.length]=FW_SPACE;
  }

  return [line1,line2,labelArr.join('')].join('\n');
}

// Demo
const s=`<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>get_time<｜tool▁sep｜>{"city": "Tokyo"}<｜tool▁call▁end｜><｜tool▁calls▁end｜>`;
console.log(graph(s));
