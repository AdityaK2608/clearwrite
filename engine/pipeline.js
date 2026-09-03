// ClearWrite Engine V9 — composable processing pipeline
(function(){
  window.CWEngine=window.CWEngine||{};
  function run(text,operation,context,tone){
    const original=text;
    const analysis=CWEngine.analyze(text);
    const scores=CWEngine.issueScore(analysis);
    let applied=CWEngine.apply(text,operation);
    let value=applied.value;
    if(operation==='concise') value=value.replace(/\bin order to\b/gi,'to').replace(/\bat this point in time\b/gi,'currently').replace(/\bdue to the fact that\b/gi,'because').replace(/\bas soon as possible\b/gi,'at the earliest');
    if(operation==='improve'||operation==='tone'){
      if(context&&context.key==='request') value=value.replace(/\bplease review\b/gi,'please review and share the required action');
      if(context&&context.key==='followup') value=value.replace(/\bfollowing up\b/gi,'following up on the pending item');
      if(context&&context.key==='escalation') value=value.replace(/\bthe issue\b/gi,'the issue requiring attention');
    }
    if(operation==='tone'){
      if(tone==='formal') value=value.replace(/\bHi Team\b/gi,'Dear Team').replace(/\bHi\b/g,'Hello').replace(/\bplease\b/gi,'kindly').replace(/\bthanks\b/gi,'thank you');
      if(tone==='friendly') value=value.replace(/\bkindly\b/gi,'please').replace(/\bHello\b/g,'Hi');
      if(tone==='assertive') value=value.replace(/\bcould you please\b/gi,'please').replace(/\bplease share an update\b/gi,'please provide an update');
    }
    value=CWEngine.capitalise(CWEngine.punctuation(value));
    const validation=CWEngine.validate(original,value);
    if(!validation.passed){return{text:original,changes:[],analysis,scores,validation,rolledBack:true};}
    return{text:value,changes:applied.changes,analysis,scores,validation,rolledBack:false};
  }
  function expose(name,operation){window[name]=function(text,contextOrTone,tone){let context=contextOrTone;if(operation==='tone'){context=tone?contextOrTone:null;tone=tone||contextOrTone}return run(text,operation,context,tone)}}
  expose('clearwriteCore','grammar');
  window.clearwriteImprove=function(text,context){return run(text,'improve',context)};
  window.clearwriteConcise=function(text,context){return run(text,'concise',context)};
  window.clearwriteTone=function(text,tone,context){return run(text,'tone',context,tone)};
  CWEngine.process=run;
})();
