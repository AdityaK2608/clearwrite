// ClearWrite V11 — intent + entity fusion
(function(){
  window.CWEngine=window.CWEngine||{};
  CWEngine.buildSemanticFrame=function(text,context){
    const intent=CWEngine.detectIntent(text);
    const entities=CWEngine.extractEntities(text);
    const get=t=>entities.filter(e=>e.type===t).map(e=>e.value);
    const has=t=>get(t).length>0;
    const actions=[];
    if(/\b(check|review|verify|validate|investigate|look into)\b/i.test(text))actions.push('review');
    if(/\b(share|send|provide|forward|submit)\b/i.test(text))actions.push('share');
    if(/\b(update|confirm|inform|let us know)\b/i.test(text))actions.push('update');
    if(/\b(resolve|fix|address|close)\b/i.test(text))actions.push('resolve');
    const frame={
      context:context?context.key:null,
      intent:intent.primary,
      intentConfidence:intent.confidence,
      alternativeIntents:intent.alternatives,
      entities,
      actions,
      urgency:has('urgency')?'high':'normal',
      deadline:has('deadline')||has('date_or_deadline')?get('deadline').concat(get('date_or_deadline')):[],
      objects:get('system_or_object'),
      actors:get('actor'),
      temporal:get('time').concat(get('time_range')),
      hasQuestion:has('question'),
      hasOwner:/\b(i|we|you|team|owner|assigned)\b/i.test(text),
      hasNextStep:/\b(next step|follow up|update|resolve|share|provide|confirm)\b/i.test(text)
    };
    return frame;
  };
})();
