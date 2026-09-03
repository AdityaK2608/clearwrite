// ClearWrite V5 — Core Writing Engine
// Browser-safe deterministic writing corrections.

const CW_PROTECTED = /(?:https?:\/\/[^\s]+|www\.[^\s]+|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|\b[A-Z]{2,}(?:[-_][A-Z0-9]+)*\b|\b\d+(?:[./:-]\d+)*\b)/g;
function cwProtect(text){const tokens=[];const value=text.replace(CW_PROTECTED,m=>{const key=`__CW_${tokens.length}__`;tokens.push([key,m]);return key});return{value,tokens}}
function cwRestore(text,tokens){return tokens.reduce((r,[k,v])=>r.replaceAll(k,v),text)}
function cwNormalize(text){const p=cwProtect(text);let v=p.value.replace(/\r\n?/g,'\n').replace(/[ \t]+/g,' ').replace(/[ \t]+\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim();return cwRestore(v,p.tokens)}
const CW_RULES=[
{id:'lowercase-i',pattern:/\bi\b/g,replacement:'I',explanation:'Capitalized the pronoun “I”.'},
{id:'pls',pattern:/\bpls\b/gi,replacement:'please',explanation:'Expanded “pls” for professional writing.'},
{id:'asap',pattern:/\basap\b/gi,replacement:'as soon as possible',explanation:'Expanded “ASAP” into a clearer phrase.'},
{id:'revert-back',pattern:/\brevert back\b/gi,replacement:'get back',explanation:'Removed the redundant “back” from “revert back”.'},
{id:'discuss-about',pattern:/\bdiscuss about\b/gi,replacement:'discuss',explanation:'Removed the unnecessary preposition after “discuss”.'},
{id:'request-for',pattern:/\brequest for you to\b/gi,replacement:'request that you',explanation:'Improved the request construction.'},
{id:'do-the-needful',pattern:/\bdo the needful\b/gi,replacement:'take the necessary action',explanation:'Replaced an ambiguous workplace phrase with clearer wording.'},
{id:'kindly-check',pattern:/\bkindly check it and revert back to me\b/gi,replacement:'please review it and let me know',explanation:'Made the follow-up request more natural.'},
{id:'please-find-attached',pattern:/\bplease find attached\b/gi,replacement:'please find the attached',explanation:'Improved the attachment phrase.'},
{id:'revert-to-me',pattern:/\brevert to me\b/gi,replacement:'get back to me',explanation:'Used natural workplace wording.'},
{id:'check-once',pattern:/\bcheck this once\b/gi,replacement:'review this',explanation:'Removed unnecessary wording.'},
{id:'duplicate-word',pattern:/\b(\w+)(?:\s+\1\b)+/gi,replacement:'$1',explanation:'Removed a duplicated word.'}
];
function cwApplyRules(text){const p=cwProtect(text);let v=p.value;const changes=[];CW_RULES.forEach(rule=>{rule.pattern.lastIndex=0;if(rule.pattern.test(v)){rule.pattern.lastIndex=0;v=v.replace(rule.pattern,(...a)=>{changes.push({id:rule.id,original:a[0],replacement:rule.replacement,explanation:rule.explanation});return rule.replacement})}rule.pattern.lastIndex=0});return{text:cwRestore(v,p.tokens),changes}}
function cwPunctuation(text){return text.split('\n').map(line=>{const t=line.trim();if(!t||/^[-•*]/.test(t)||/^https?:\/\//i.test(t))return line;return /[.!?…:]$/.test(t)?t:`${t}.`}).join('\n')}
function cwCapitalize(text){return text.replace(/(^|[.!?]\s+)([a-z])/g,(_,p,l)=>`${p}${l.toUpperCase()}`)}
function clearwriteCore(text){const ruled=cwApplyRules(cwNormalize(text));let result=cwCapitalize(ruled.text);result=cwPunctuation(result);return{text:result,changes:ruled.changes}}
function clearwriteImprove(text){let r=clearwriteCore(text).text;r=r.replace(/\bhey\b/gi,'Hi').replace(/\bjust wanted to let you know\b/gi,'I would like to inform you').replace(/\bI wanted to let you know\b/gi,'I would like to inform you').replace(/\bget back to me\b/gi,'share your feedback').replace(/\bcheck this\b/gi,'review this');return cwPunctuation(r)}
function clearwriteConcise(text){let r=clearwriteCore(text).text;r=r.replace(/\b(I just wanted to let you know|I wanted to let you know|I would like to inform you)\b[,:]?\s*/gi,'').replace(/\bin order to\b/gi,'to').replace(/\bat this point in time\b/gi,'currently').replace(/\bdue to the fact that\b/gi,'because');return cwPunctuation(r)}
function clearwriteTone(text,tone){let r=clearwriteImprove(text);if(tone==='formal')r=r.replace(/\bHi Team\b/gi,'Dear Team').replace(/\bHi\b/g,'Hello').replace(/\bplease\b/gi,'kindly').replace(/\bthanks\b/gi,'thank you');if(tone==='friendly')r=r.replace(/\bkindly\b/gi,'please').replace(/\bI would like to inform you\b/gi,'I wanted to let you know').replace(/\bHello\b/g,'Hi');if(tone==='assertive')r=r.replace(/\bcould you please\b/gi,'please').replace(/\bif you encounter any issues\b/gi,'if there are any issues');return cwPunctuation(r)}