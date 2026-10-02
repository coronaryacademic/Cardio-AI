const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const ts=require('../../../app/node_modules/typescript');
const source=fs.readFileSync(path.join(__dirname,'../wct/main-P3FB4ZU5.js'),'utf8');
const tree=ts.createSourceFile('cardio.js',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);
let fn,warning;
for(const statement of tree.statements){
  if(ts.isFunctionDeclaration(statement)&&statement.name?.text==='Gt')fn=statement.getText(tree);
  if(ts.isVariableStatement(statement))for(const d of statement.declarationList.declarations)if(d.name.getText(tree)==='R')warning='var '+d.getText(tree)+';';
}
if(!fn||!warning)throw Error('Original Cardio arrest graph not found');
const context={};vm.runInNewContext(warning+fn+'; result=Gt("acls-md");',context);
fs.writeFileSync(path.join(__dirname,'cardio-arrest.original.json'),JSON.stringify(context.result,null,2));
const nodes=Object.fromEntries(context.result.map((n,i)=>[n.id,{id:n.id,kind:n.type==='question'?'decision':n.type==='terminal'?'outcome':'action',title:n.title,question:n.question,bullets:n.info?[[n.info]]:n.disposition?[[n.disposition]]:[],choices:n.answers?.map(a=>({label:a.text,to:a.nextNodeId})),next:n.nextNodeId||undefined,primaryLabel:'Continue',detail:n.warning,map:{col:0,row:i},original:n}]));
const algorithm={id:'cardio-cardiac-arrest',title:'Adult Cardiac Arrest',short:'Cardiac Arrest',guideline:'Original Cardio Guide protocol',source:'cardio',entry:context.result[0].id,nodes,codeMode:false,blurb:'Original Cardio Guide cardiac arrest pathway'};
for(const n of Object.values(nodes))for(const id of [n.next,...(n.choices||[]).map(c=>c.to)].filter(Boolean))if(!nodes[id])throw Error('Broken Cardio edge: '+id);
fs.writeFileSync(path.join(__dirname,'cardio-arrest.json'),JSON.stringify(algorithm,null,2));
console.log('Preserved original Cardio Guide arrest graph: '+context.result.length+' nodes.');
