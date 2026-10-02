export function mapLayout(algorithm) {
  const nodes=Object.values(algorithm.nodes).filter(n=>n.map);
  const columns=Math.max(1,...nodes.map(n=>n.map.col+1));
  const placed=nodes.map((node,index)=>({node,ref:String.fromCharCode(65+index),col:node.map.col,row:node.map.row,span:Math.min(node.map.span||1,columns-node.map.col)}));
  const edges=nodes.flatMap(node=>[
    ...(node.next?[{from:node.id,to:node.next,label:node.primaryLabel||'Continue'}]:[]),
    ...(node.choices||[]).map(choice=>({from:node.id,to:choice.to,label:choice.label})),
  ]);
  for(const edge of edges)if(!algorithm.nodes[edge.to])throw Error('Missing map destination: '+edge.to);
  return {columns,placed,edges};
}
