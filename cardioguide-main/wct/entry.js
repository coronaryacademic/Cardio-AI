// Retain the requested topic through Cardio Guide's original role selection.
const requested = new URL(location.href).searchParams.get('entry');
if (['cardiac-arrest-original','wct'].includes(requested)) sessionStorage.setItem('cg_requested_topic',requested);
function resumeTopic(){
  const topic=sessionStorage.getItem('cg_requested_topic');if(!topic)return;
  const mode=localStorage.getItem('jcs_mode');
  if(!['ems','physician'].includes(mode)){
    if(location.hash!=='#/select-mode')location.hash='/select-mode';
    return;
  }
  const destination=topic==='wct'?`wct-${mode}`:topic;
  sessionStorage.removeItem('cg_requested_topic');
  location.hash=`/protocols/${destination}`;
}
window.addEventListener('hashchange',resumeTopic);
// Run once after a role is chosen; observing every Angular render causes churn.
document.addEventListener('click',event=>{
  const button=event.target.closest('button');
  if(location.hash==='#/select-mode'&&button){setTimeout(resumeTopic,0);}
});
resumeTopic();
