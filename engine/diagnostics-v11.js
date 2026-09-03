// ClearWrite V11 — semantic diagnostics
(function(){
  window.CWEngine=window.CWEngine||{};
  CWEngine.semanticDiagnostics=function(frame,analysis){
    const out=[];
    const add=(id,category,severity,message,suggestion,confidence)=>out.push({id,category,severity,message,suggestion,confidence});
    const s=analysis.signals;
    if(s.abbreviation)add('abbr','professionalism','medium','Informal abbreviations reduce workplace clarity.','Use the full phrase.',.99);
    if(s.vague)add('vague','clarity','medium','A reference such as “this” or “it” may be ambiguous.','Name the specific item when useful.',.86);
    if(frame.intent==='request'&&!frame.deadline)add('missing-deadline','completeness','medium','The request has no explicit response time.','Add a deadline or expected response time if one exists.',.91);
    if((frame.intent==='followup'||frame.context==='followup')&&!frame.hasNextStep)add('missing-next-step','completeness','medium','The follow-up does not clearly state the next action.','State who needs to act and what happens next.',.9);
    if(frame.intent==='escalation'&&!frame.urgency)add('missing-urgency','completeness','medium','The escalation does not clearly communicate urgency.','State the required response time if known.',.84);
    if(frame.intent==='request'&&!frame.actions.length)add('missing-action','intent','high','The request intent is detected but no concrete action was extracted.','State the action explicitly.',.82);
    return out;
  };
})();
