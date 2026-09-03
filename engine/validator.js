// ClearWrite Engine — semantic safety and idempotency validation
(function(){
  window.CWEngine=window.CWEngine||{};
  const tokens=t=>(t.match(/(?:https?:\/\/[^\s]+|www\.[^\s]+|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|\b\d+(?:[./:-]\d+)*\b)/g)||[]);
  CWEngine.validate=function(original,rewritten){
    const a=tokens(original),b=tokens(rewritten);const missing=a.filter(x=>!b.includes(x));
    const result={passed:missing.length===0,missingTokens:missing,warnings:[]};
    if(original.trim()&&(!rewritten||!rewritten.trim())){result.passed=false;result.warnings.push('Rewrite produced empty output.')}
    return result;
  };
  CWEngine.idempotent=function(fn,text){const once=fn(text);const twice=fn(once.text);return{stable:once.text===twice.text,once,twice}};
})();
