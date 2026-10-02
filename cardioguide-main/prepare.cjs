const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('../../app/node_modules/typescript');
const root = __dirname;
const source = fs.readFileSync(path.join(root, '../../app/lib/acls/algorithms.ts'), 'utf8');
const compiled = ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const context = {exports:{}};
vm.runInNewContext(compiled, context);
fs.mkdirSync(path.join(root,'emergency/photos'), {recursive:true});
fs.writeFileSync(path.join(root,'emergency/algorithms.json'), JSON.stringify(context.exports.ALGORITHMS,null,2));
fs.copyFileSync(path.join(root,'../../app/lib/acls/algorithms.ts'),path.join(root,'emergency/algorithms.source.ts'));
for (const a of context.exports.ALGORITHMS) {
  if (!a.nodes[a.entry]) throw Error('Missing entry '+a.id);
  for (const n of Object.values(a.nodes)) for (const id of [n.next,n.goto?.to,...(n.choices||[]).map(c=>c.to)].filter(Boolean)) if (!a.nodes[id]) throw Error('Broken edge '+a.id+'/'+id);
  fs.copyFileSync(path.join(root,'../../data/acls/img',a.id+'.jpg'),path.join(root,'emergency/photos',a.id+'.jpg'));
}
fs.cpSync(path.join(root,'../cardioguide-wct'),path.join(root,'wct'),{recursive:true});
fs.mkdirSync(path.join(root,'i18n'),{recursive:true});
fs.copyFileSync(path.join(root,'en.json'),path.join(root,'i18n/en.json'));
for (const section of ['', 'wct','svt']) {
  const file = path.join(root,section,'index.html');
  let html = fs.readFileSync(file,'utf8').replace('<base href="/">',`<base href="/${section ? section+'/' : ''}">`);
  if (!html.includes('/emergency/addon.js')) html = html.replace('</head>','<link rel="stylesheet" href="/emergency/addon.css"></head>').replace('</body>','<script type="module" src="/emergency/addon.js"></script></body>');
  fs.writeFileSync(file,html);
}
const main = path.join(root,'main-7MDN5LRY.js');
fs.writeFileSync(main,fs.readFileSync(main,'utf8').replace('https://wct.cardioguide.ai','/wct/#/').replace('https://svt.cardioguide.ai','/svt/#/'));
console.log('Copied 5 unchanged MedOS graphs and posters; verified all graph edges.');
