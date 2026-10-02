// Shared pointer gestures for chart and map; zoom stays anchored to the fingers.
export function panZoom(field,content,tools,photo=false){
 const abort=new AbortController(),opts={signal:abort.signal},points=new Map();let scale=1,x=0,y=0,base,dragged=false,suppressUntil=0;
 const size=()=>({w:content.offsetWidth,h:content.offsetHeight});
 const paint=()=>{content.style.transform='translate('+x+'px,'+y+'px) scale('+scale+')';field.dataset.zoom=scale.toFixed(3);};
 const fit=()=>{const {w,h}=size();scale=Math.min(1,(field.clientWidth-32)/w,photo?(field.clientHeight-32)/h:1);scale=Math.max(.08,scale);x=(field.clientWidth-w*scale)/2;y=photo?(field.clientHeight-h*scale)/2:20;paint();};
 const local=e=>{const r=field.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top};};
 const geometry=()=>{const a=[...points.values()];return a.length>1?{x:(a[0].x+a[1].x)/2,y:(a[0].y+a[1].y)/2,d:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)}:{...a[0],d:0};};
 const anchor=()=>{if(points.size)base={...geometry(),scale,x0:x,y0:y};};
 const zoom=(factor,cx=field.clientWidth/2,cy=field.clientHeight/2)=>{const next=Math.max(.08,Math.min(6,scale*factor));x=cx-(cx-x)*next/scale;y=cy-(cy-y)*next/scale;scale=next;paint();};
 field.addEventListener('pointerdown',e=>{if(e.button!==0)return;points.set(e.pointerId,local(e));dragged=false;anchor();},opts);
 field.addEventListener('pointermove',e=>{if(!points.has(e.pointerId))return;points.set(e.pointerId,local(e));const g=geometry();if(Math.hypot(g.x-base.x,g.y-base.y)>5||points.size>1){dragged=true;field.setPointerCapture(e.pointerId);}if(!dragged)return;const next=base.d&&g.d?Math.max(.08,Math.min(6,base.scale*g.d/base.d)):base.scale;x=g.x-(base.x-base.x0)*next/base.scale;y=g.y-(base.y-base.y0)*next/base.scale;scale=next;paint();},opts);
 const end=e=>{points.delete(e.pointerId);if(dragged)suppressUntil=Date.now()+300;anchor();};
 field.addEventListener('pointerup',end,opts);field.addEventListener('pointercancel',end,opts);
 field.addEventListener('click',e=>{if(Date.now()<suppressUntil){e.preventDefault();e.stopImmediatePropagation();}}, {...opts,capture:true});
 field.addEventListener('wheel',e=>{e.preventDefault();const c=local(e);zoom(Math.exp(-e.deltaY*.002),c.x,c.y);},{...opts,passive:false});
 field.addEventListener('keydown',e=>{if(e.target!==field)return;const moves={ArrowLeft:[40,0],ArrowRight:[-40,0],ArrowUp:[0,40],ArrowDown:[0,-40]};if(moves[e.key]){e.preventDefault();x+=moves[e.key][0];y+=moves[e.key][1];paint();}else if(['+','=','-','0'].includes(e.key)){e.preventDefault();e.key==='0'?fit():zoom(e.key==='-'?.8:1.25);}},opts);
 tools.addEventListener('click',e=>{const b=e.target.closest('[data-scale]');if(b)b.dataset.scale==='fit'?fit():zoom(b.dataset.scale==='in'?1.25:.8);},opts);
 const resize=new ResizeObserver(()=>fit());resize.observe(field);fit();return ()=>{abort.abort();resize.disconnect();};
}
