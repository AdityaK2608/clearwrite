// ClearWrite Engine V10 — intent detection
(function(){
  window.CWEngine=window.CWEngine||{};
  const PATTERNS={
    request:[/\bplease\b/,/\bcould you\b/,/\bcan you\b/,/\bneed you to\b/,/\bkindly\b/,/\brequest(?:ed)?\b/,/\bshare\b/,/\bprovide\b/,/\bcheck\b/,/\breview\b/],
    followup:[/\bfollow(?:ing)? up\b/,/\bpending\b/,/\bawaiting\b/,/\bwaiting for\b/,/\breminder\b/,/\bno update\b/],
    escalation:[/\bescalat\w*\b/,/\burgent\b/,/\bcritical\b/,/\bblock(?:ed|er)\b/,/\bincident\b/,/\bhigh priority\b/,/\bimpact\b/],
    status:[/\bstatus\b/,/\bprogress\b/,/\bin progress\b/,/\bcompleted\b/,/\bcurrently\b/,/\bupdate\b/,/\bnext step\b/],
    question:[/\?$/, /\bwhat\b/,/\bwhen\b/,/\bwhere\b/,/\bwhy\b/,/\bhow\b/,/\bcan you confirm\b/],
    confirm:[/\bconfirm\b/,/\bconfirmation\b/,/\bplease confirm\b/,/\bkindly confirm\b/],
    inform:[/\bfor your information\b/,/\bplease note\b/,/\bwould like to inform\b/,/\bthis is to inform\b/],
    meeting:[/\bmeeting\b/,/\bagenda\b/,/\bschedule\b/,/\breschedule\b/,/\bminutes\b/,/\bcalendar\b/]
  };
  CWEngine.detectIntent=function(text){
    const t=text.toLowerCase();
    const scores={};
    Object.entries(PATTERNS).forEach(([intent,patterns])=>{scores[intent]=patterns.reduce((n,r)=>n+(r.test(t)?1:0),0)});
    const ordered=Object.entries(scores).sort((a,b)=>b[1]-a[1]);
    const max=ordered[0][1];
    const total=Object.values(scores).reduce((a,b)=>a+b,0)||1;
    const primary=max?ordered[0][0]:'inform';
    return {primary,confidence:max?Math.min(.99,.5+(max/Math.max(total,1))*.5):.35,alternatives:ordered.filter(x=>x[1]>0&&x[0]!==primary).slice(0,3).map(x=>({intent:x[0],confidence:Math.min(.95,.35+(x[1]/total)*.6)})),scores};
  };
})();
