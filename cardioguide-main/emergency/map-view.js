import {mapLayout} from './map-layout.js';
// Draw only clear, local forward arrows. Loops and distant branches remain explicit destination chips.
export function drawMapConnections(canvas,algorithm){
 const svg=canvas.querySelector('.cg-connections'),{edges}=mapLayout(algorithm);
 const boxes=new Map([...canvas.querySelectorAll('[data-map-node]')].map(el=>[el.dataset.mapNode,{left:el.offsetLeft+28,right:el.offsetLeft+28+el.offsetWidth,top:el.offsetTop+28,bottom:el.offsetTop+28+el.offsetHeight,x:el.offsetLeft+28+el.offsetWidth/2}]));
 svg.setAttribute('viewBox','0 0 '+canvas.offsetWidth+' '+canvas.offsetHeight);
 svg.innerHTML='<defs><marker id="cg-arrow" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="7" markerHeight="7" orient="auto"><path d="M2 2 L10 6 L2 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>';
 for(const edge of edges){const s=boxes.get(edge.from),t=boxes.get(edge.to);if(!s||!t||t.top<s.bottom||t.top-s.bottom>180)continue;
 const blocked=[...boxes.values()].some(b=>b!==s&&b!==t&&b.top>=s.bottom&&b.bottom<=t.top&&b.left<Math.max(s.x,t.x)&&b.right>Math.min(s.x,t.x));if(blocked)continue;
 const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d','M'+s.x+' '+s.bottom+' C'+s.x+' '+(s.bottom+18)+' '+t.x+' '+(t.top-18)+' '+t.x+' '+(t.top-5));path.setAttribute('marker-end','url(#cg-arrow)');path.dataset.from=edge.from;path.dataset.to=edge.to;svg.append(path);}
}
