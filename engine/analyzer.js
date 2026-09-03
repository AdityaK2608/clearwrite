// ClearWrite Engine — linguistic analyzer
(function(){
  window.CWEngine=window.CWEngine||{};
  const has=(t,r)=>r.test(t);
  CWEngine.analyze=function(text){
    const sentences=text.split(/(?<=[.!?])\s+|\n+/).map(s=>s.trim()).filter(Boolean);
    const words=text.match(/\b[\w'-]+\b/g)||[];
    const lower=text.toLowerCase();
    const signals={
      abbreviation:has(lower,/\b(pls|asap|u|ur|btw|fyi)\b/),
      filler:has(lower,/\b(just wanted to|i wanted to let you know|at this point in time|basically|actually)\b/),
      vague:has(lower,/\b(this|that|it|thing|stuff)\b/),
      request:has(lower,/\b(please|kindly|could you|can you|request|need you to|share|provide|check|review)\b/),
      followup:has(lower,/\b(following up|follow up|pending|awaiting|waiting for|reminder)\b/),
      escalation:has(lower,/\b(urgent|critical|escalat|blocker|blocked|impact|incident|issue)\b/),
      status:has(lower,/\b(status|progress|completed|in progress|update|current status|next step)\b/),
      deadline:has(lower,/\b(today|tomorrow|by \w+|before \w+|eod|end of day|as soon as possible|deadline)\b/),
      ownership:has(lower,/\b(i will|we will|you will|please .*\b(owner|team)\b|assigned)\b/),
      question:has(lower,/(\?|\b(could|can|would|when|what|where|why|how)\b)/)
    };
    return {sentences,wordCount:words.length,signals};
  };
})();
