// ClearWrite Engine — diagnostics and confidence model
(function(){
  window.CWEngine=window.CWEngine||{};
  CWEngine.diagnostic=function(id,category,original,replacement,explanation,confidence,risk){return{id,category,original,replacement,explanation,confidence,risk}};
  CWEngine.issueScore=function(analysis){const s=analysis.signals;let grammar=1,clarity=1,conciseness=1,professionalism=1;
    if(s.abbreviation)professionalism-=.18;
    if(s.filler){conciseness-=.18;clarity-=.08}
    if(s.vague)clarity-=.08;
    if(s.request&&!s.deadline)clarity-=.04;
    if(s.escalation&&!s.deadline)clarity-=.06;
    return{grammar:Math.round(grammar*100),clarity:Math.max(0,Math.round(clarity*100)),conciseness:Math.max(0,Math.round(conciseness*100)),professionalism:Math.max(0,Math.round(professionalism*100))};
  };
})();
