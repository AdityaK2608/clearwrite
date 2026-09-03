// ClearWrite Engine V9 — composable processing pipeline
(function(){
  window.CWEngine=window.CWEngine||{};
  function contextualRewrite(value,context){
    if(!context)return value;
    if(context.key==='request') value=value.replace(/\bplease review\b(?! and share the required action)/gi,'please review and share the required action');
    if(context.key==='followup') value=value.replace(/\bfollowing up\b(?! on the pending item)/gi,'following up on the pending item');
    if(context.key==='escalation') value=value.replace(/\bthe issue\b(?! requiring attention)/gi,'the issue requiring attention');
    return value;
  }
  function toneRewrite(value,tone){
    if(tone==='formal') return value.replace(/\bHi Team\b/gi,'Dear Team').replace(/\bHi\b/g,'Hello').replace(/\bplease\b/gi,'kindly').replace(/\bthanks\b/gi,'thank you');
    if(tone==='friendly') return value.replace(/\bkindly\b/gi,'please').replace(/\bHello\b/g,'Hi');
    if(tone==='assertive') return value.replace(/\bcould you please\b/gi,'please').replace(/\bplease share an update\b/gi,'please provide an update');
    return value;
  }
  function run(text,operation,context,tone){
    const original=text;
    const analysis=CWEngine.analyze(text);
    const scores=CWEngine.issueScore(analysis);
    const applied=CWEngine.apply(text,operation);
    let value=applied.value;
    if(operation==='concise') value=value.replace(/\bin order to\b/gi,'to').replace(/\bat this point in time\b/gi,'currently').replace(/\bdue to the fact that\b/gi,'because').replace(/\bas soon as possible\b/gi,'at the earliest');
    if(operation==='improve'||operation==='tone') value=contextualRewrite(value,context);
    if(operation==='tone') value=toneRewrite(value,tone);
    value=CWEngine.capitalise(CWEngine.punctuation(value));
    const validation=CWEngine.validate(original,value);
    if(!validation.passed)return{text:original,changes:[],analysis,scores,validation,rolledBack:true};
    return{text:value,changes:applied.changes,analysis,scores,validation,rolledBack:false};
  }
  window.clearwriteAnalyze=function(text,context){
    const a=CWEngine.analyze(text),c=context||{key:'email',label:'Email'};
    const suggestions=[];
    if(a.signals.request&&!a.signals.deadline)suggestions.push('Consider adding a deadline or expected response time.');
    if(a.signals.escalation&&!a.signals.deadline)suggestions.push('Consider stating the urgency or required response time.');
    if(a.signals.followup)suggestions.push('Make the pending item and next step explicit.');
    if(a.signals.vague)suggestions.push('Replace vague references such as “this” or “it” with the specific item when useful.');
    return{label:c.label,context:c.key,wordCount:a.wordCount,signals:a.signals,suggestions};
  };
  window.clearwriteCore=function(text){return run(text,'grammar',null,null)};
  window.clearwriteImprove=function(text,context){return run(text,'improve',context,null)};
  window.clearwriteConcise=function(text,context){return run(text,'concise',context,null)};
  window.clearwriteTone=function(text,tone,context){return run(text,'tone',context,tone)};
  CWEngine.process=run;
})();
