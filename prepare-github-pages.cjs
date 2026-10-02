const fs=require('node:fs'),path=require('node:path');
const repo=process.argv[2]||'Cardio-AI';
if(!/^[a-zA-Z0-9_.-]+$/.test(repo))throw Error('Use the repository name only.');
const base='/'+repo+'/',source=path.join(__dirname,'cardioguide-main'),out=path.join(__dirname,'docs');
fs.mkdirSync(out,{recursive:true});
function copy(dir,target){for(const item of fs.readdirSync(dir,{withFileTypes:true})){if(item.name.startsWith('.')||/^(download|prepare|import-cardio)|\.source\.ts$|\.cjs$|\.cmd$|\.ps1$|\.md$|inspection|phone\.jpg$|icons\.jpg$|fixed\.jpg$|footer\.jpg$|button\.jpg$/.test(item.name))continue;const src=path.join(dir,item.name),dest=path.join(target,item.name);if(item.isDirectory()){fs.mkdirSync(dest,{recursive:true});copy(src,dest);}else{if(/\.(html|js|css|json)$/.test(item.name)){let text=fs.readFileSync(src,'utf8');text=text.replace(/(["'`])\/(emergency\/|wct\/|svt\/|home-link\.css|phone\.css|navigation\.js|i18n\/|assets\/|fonts\/|#\/)/g,(_,quote,route)=>quote+base+route);if(item.name==='index.html')text=text.replace(/<base href="\/">/g,'<base href="'+base+'">');fs.writeFileSync(dest,text);}else fs.copyFileSync(src,dest);}}}
copy(source,out);fs.writeFileSync(path.join(out,'.nojekyll'),'');console.log('Ready to upload: '+out+' (site base '+base+')');
