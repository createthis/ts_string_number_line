#!/usr/bin/env -S node --import tsx/esm
const FW_BAR='｜', FW_SPACE='　';

function graph(str:string):string{
  const chars=[...str], n=chars.length;

  // line1
  const line1=chars.join('');

  // line2: ticks + FW spaces; suppress '<' if preceded by '>'
  const tickArr=chars.map((c,i)=>{
    if(c===FW_BAR) return FW_SPACE;
    if(c==='<' && i>0 && chars[i-1]==='>') return ' ';
    return (c==='<'||c==='>') ? '|' : ' ';
  });
  const line2=tickArr.join('');

  // line3 base: carry FW spaces through; rest spaces
  const labelArr=Array.from({length:n},(_,i)=> tickArr[i]===FW_SPACE?FW_SPACE:' ');
  const ticks=tickArr.map((c,i)=>c==='|'?i:-1).filter(i=>i>=0);

  for(let t=0;t<ticks.length;t++){
    const pos=ticks[t];
    const lab=String(pos);
    let start=Math.min(pos, n-lab.length);

    // write label & detect overlap with FW spaces
    let overlapped=false;
    for(let j=0;j<lab.length;j++){
      if(tickArr[start+j]===FW_SPACE) overlapped=true;
      labelArr[start+j]=lab[j];
    }

    if(overlapped){
      const after=start+lab.length;
      const isLast = t===ticks.length-1;
      if(!isLast && after<n){
        labelArr[after]=FW_SPACE;        // rule 4: put FW space after label
      }else if(after<n){
        labelArr[after]=FW_SPACE;        // not last, room exists
      }else{
        // last label & no room after: put FW space BEFORE label
        if(start>0) labelArr[start-1]=FW_SPACE; // replaces a regular space
      }
    }
  }

  return [line1,line2,labelArr.join('')].join('\n');
}

// Demo
const s=`<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>get_time<｜tool▁sep｜>{"city": "Tokyo"}<｜tool▁call▁end｜><｜tool▁calls▁end｜>`;
console.log(graph(s));
