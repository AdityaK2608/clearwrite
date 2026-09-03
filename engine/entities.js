// ClearWrite Engine V10 — workplace entity extraction
(function(){
  window.CWEngine=window.CWEngine||{};
  const push=(out,type,value,confidence)=>{if(value&&!out.some(e=>e.type===type&&e.value.toLowerCase()===value.toLowerCase()))out.push({type,value,confidence})};
  CWEngine.extractEntities=function(text){
    const out=[];
    const email=text.match(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g)||[];email.forEach(v=>push(out,'email',v,.99));
    const urls=text.match(/(?:https?:\/\/|www\.)[^\s]+/gi)||[];urls.forEach(v=>push(out,'url',v,.99));
    const dates=text.match(/\b(?:today|tomorrow|yesterday|monday|tuesday|wednesday|thursday|friday|saturday|sunday|eod|end of day)\b/gi)||[];dates.forEach(v=>push(out,'date_or_deadline',v,.95));
    const times=text.match(/\b\d{1,2}(?::\d{2})?\s?(?:am|pm)\b/gi)||[];times.forEach(v=>push(out,'time',v,.98));
    const ranges=text.match(/\b\d{1,2}(?::\d{2})?\s?(?:am|pm)\s*(?:to|-|–)\s*\d{1,2}(?::\d{2})?\s?(?:am|pm)\b/gi)||[];ranges.forEach(v=>push(out,'time_range',v,.97));
    const quantities=text.match(/\b\d+(?:\.\d+)?\s?(?:days?|hours?|minutes?|months?|weeks?|GB|MB|%)\b/gi)||[];quantities.forEach(v=>push(out,'quantity',v,.96));
    const systems=text.match(/\b(?:firewall|SIEM|PAM|server|database|VPN|network|application|portal|API|ARCON)\b/gi)||[];systems.forEach(v=>push(out,'system_or_object',v,.9));
    const actors=text.match(/\b(?:customer|client|infra team|security team|network team|support team|vendor|management)\b/gi)||[];actors.forEach(v=>push(out,'actor',v,.9));
    const deadlines=text.match(/\b(?:by\s+(?:today|tomorrow|eod|end of day)|before\s+\w+|within\s+\d+\s+(?:hours?|days?))\b/gi)||[];deadlines.forEach(v=>push(out,'deadline',v,.94));
    const urgency=text.match(/\b(?:urgent|urgently|critical|high priority|priority|as soon as possible|asap)\b/gi)||[];urgency.forEach(v=>push(out,'urgency',v,.95));
    return out;
  };
})();
