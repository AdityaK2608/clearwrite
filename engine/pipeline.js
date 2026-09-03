// ClearWrite Engine V10 — analysis + transformation pipeline
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
  function buildAnalysis(text,context){
    const linguistic=CWEngine.analyze(text);
    const intent=CWEngine.detectIntent?CWEngine.detectIntent(text):{primary:'inform',confidence:.35,alternatives:[],scores:{}};
    const entities=CWEngine.extractEntities?CWEngine.extractEntities(text):[];
    const suggestions=[];
    const s=linguistic.signals;
    if((intent.primary==='request'||s.request)&&!s.deadline)suggestions.push({type:'missing_deadline',message:'Consider adding a deadline or expected response time.',priority:'medium'});
    if((intent.primary==='escalation'||s.escalation)&&!s.deadline)suggestions.push({type:'missing_urgency',message:'Consider stating the required response time or urgency.',priority:'high'});
    if(intent.primary==='followup'||s.followup)suggestions.push({type:'next_step',message:'Make the pending item and expected next step explicit.',priority:'medium'});
    if(s.vague)suggestions.push({type:'vague_reference',message:'Replace vague references such as “this” or “it” with the specific item when useful.',priority:'low'});
    if((intent.primary==='request'||intent.primary==='escalation')&&!entities.some(e=>e.type==='actor'))suggestions.push({type:'ownership',message:'Consider identifying who should take the requested action.',priority:'low'});
    return {linguistic,intent,entities,suggestions,label:context&&context.label||'Writing'};
  }
  function run(text,operation,context,tone){
    const original=text;
    const contextResult=context||{key:'email',label:'Email'};
    const analysis=buildAnalysis(text,contextResult);
    const scores=CWEngine.issueScore(analysis.linguistic);
    const applied=CWEngine.apply(text,operation);
    let value=applied.value;
    if(operation==='concise') value=value.replace(/\bin order to\b/gi,'to').replace(/\bat this point in time\b/gi,'currently').replace(/\bdue to the fact that\b/gi,'because').replace(/\bas soon as possible\b/gi,'at the earliest');
    if(operation==='improve'||operation==='tone') value=contextualRewrite(value,contextResult);
    if(operation==='tone') value=toneRewrite(value,tone);
    value=CWEngine.capitalise(CWEngine.punctuation(value));
    const validation=CWEngine.validate(original,value);
    if(!validation.passed)return{text:original,changes:[],analysis,scores,validation,rolledBack:true};
    return{text:value,changes:applied.changes,analysis,scores,validation,rolledBack:false};
  }
  window.clearwriteAnalyze=function(text,context){
    const c=context||{key:'email',label:'Email'};
    const a=buildAnalysis(text,c);
    return {label:c.label,context:c.key,wordCount:a.linguistic.wordCount,signals:a.linguistic.signals,intent:a.intent,entities:a.entities,suggestions:a.suggestions};
  };
  window.clearwriteCore=function(text){return run(text,'grammar',null,null)};
  window.clearwriteImprove=function(text,context){return run(text,'improve',context)};
  window.clearwriteConcise=function(text,context){return run(text,'concise',context)};
  window.clearwriteTone=function(text,tone,context){return run(text,'tone',context,tone)};
  CWEngine.process=run;
})();
