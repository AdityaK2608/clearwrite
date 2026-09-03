// ClearWrite Engine — token protection
(function(){
  const PATTERN=/(?:https?:\/\/[^\s]+|www\.[^\s]+|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|\b[A-Z]{2,}(?:[-_][A-Z0-9]+)*\b|\b\d+(?:[./:-]\d+)*\b)/g;
  window.CWEngine=window.CWEngine||{};
  CWEngine.protect=function(text){const tokens=[];const value=text.replace(PATTERN,m=>{const key=`\u0001CW${tokens.length}\u0002`;tokens.push([key,m]);return key});return{value,tokens}};
  CWEngine.restore=function(text,tokens){return tokens.reduce((r,[k,v])=>r.split(k).join(v),text)};
  CWEngine.normalize=function(text){const p=CWEngine.protect(text);const value=p.value.replace(/\r\n?/g,'\n').replace(/[ \t]+/g,' ').replace(/[ \t]+\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim();return CWEngine.restore(value,p.tokens)};
})();
