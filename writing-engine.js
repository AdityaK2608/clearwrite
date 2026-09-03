// ClearWrite V6 — Rewrite Intelligence
// Browser-safe deterministic rewrite layer. Preserves intent and protected tokens.

const CW_PROTECTED = /(?:https?:\/\/[^\s]+|www\.[^\s]+|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|\b[A-Z]{2,}(?:[-_][A-Z0-9]+)*\b|\b\d+(?:[./:-]\d+)*\b)/g;
function cwProtect(text){const tokens=[];const value=text.replace(CW_PROTECTED,m=>{const key=`__CW_${tokens.length}__`;tokens.push([key,m]);return key});return{value,tokens}}
function cwRestore(text,tokens){return tokens.reduce((r,[k,v])=>r.replaceAll(k,v),text)}
function cwNormalize(text){const p=cwProtect(text);let v=p.value.replace(/\r\n?/g,'\n').replace(/[ \t]+/g,' ').replace(/[ \t]+\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim();return cwRestore(v,p.tokens)}
const CW_RULES=[
{id:'lowercase-i',pattern:/\bi\b/g,replacement:'I',explanation:'Capitalized the pronoun “I”.'},
{id:'pls',pattern:/\bpls\b/gi,replacement:'please',explanation:'Expanded “pls” into professional wording.'},
{id:'asap',pattern:/\basap\b/gi,replacement:'as soon as possible',explanation:'Expanded “ASAP” into a clearer phrase.'},
{id:'revert-back',pattern:/\brevert back\b/gi,replacement:'get back',explanation:'Removed the redundant “back”.'},
{id:'discuss-about',pattern:/\bdiscuss about\b/gi,replacement:'discuss',explanation:'Removed the unnecessary preposition.'},
{id:'request-for',pattern:/\brequest for you to\b/gi,replacement:'request that you',explanation:'Improved the request construction.'},
{id:'do-the-needful',pattern:/\bdo the needful\b/gi,replacement:'take the necessary action',explanation:'Replaced an ambiguous phrase with clearer wording.'},
{id:'kindly-check',pattern:/\bkindly check it and revert back to me\b/gi,replacement:'please review it and let me know',explanation:'Made the follow-up request more natural.'},
{id:'please-find-attached',pattern:/\bplease find attached\b/gi,replacement:'please find the attached',explanation:'Improved the attachment phrase.'},
{id:'revert-to-me',pattern:/\brevert to me\b/gi,replacement:'get back to me',explanation:'Used natural workplace wording.'},
{id:'check-once',pattern:/\bcheck this once\b/gi,replacement:'review this',explanation:'Removed unnecessary wording.'},
{id:'duplicate-word',pattern:/\b(\w+)(?:\s+\1\b)+/gi,replacement:'$1',explanation:'Removed a duplicated word.'}
];
function cwApplyRules(text){const p=cwProtect(text);let v=p.value;const changes=[];CW_RULES.forEach(rule=>{rule.pattern.lastIndex=0;if(rule.pattern.test(v)){rule.pattern.lastIndex=0;v=v.replace(rule.pattern,(...a)=>{changes.push({id:rule.id,original:a[0],replacement:rule.replacement,explanation:rule.explanation,type:'grammar'});return rule.replacement})}rule.pattern.lastIndex=0});return{text:cwRestore(v,p.tokens),changes}}
function cwPunctuation(text){return text.split('\n').map(line=>{const t=line.trim();if(!t||/^[-•*]/.test(t)||/^https?:\/\//i.test(t))return line;return /[.!?…:]$/.test(t)?t:`${t}.`}).join('\n')}
function cwCapitalize(text){return text.replace(/(^|[.!?]\s+)([a-z])/g,(_,p,l)=>`${p}${l.toUpperCase()}`)}
function clearwriteCore(text){const ruled=cwApplyRules(cwNormalize(text));let result=cwCapitalize(ruled.text);result=cwPunctuation(result);return{text:result,changes:ruled.changes}}
function cwRewrite(result, rules){const changes=[];rules.forEach(rule=>{if(rule.pattern.test(result.text)){rule.pattern.lastIndex=0;result.text=result.text.replace(rule.pattern,(...a)=>{changes.push({id:rule.id,original:a[0],replacement:rule.replacement,explanation:rule.explanation,type:'rewrite'});return rule.replacement})}rule.pattern.lastIndex=0});result.text=cwPunctuation(result.text);result.changes.push(...changes);return result}
function clearwriteImprove(text){let result=clearwriteCore(text);return cwRewrite(result,[
{id:'remove-filler',pattern:/\bjust wanted to let you know\b/gi,replacement:'I would like to inform you',explanation:'Removed conversational filler while preserving the intent.'},
{id:'remove-filler-2',pattern:/\bI wanted to let you know\b/gi,replacement:'I would like to inform you',explanation:'Made the opening more direct.'},
{id:'hey',pattern:/\bhey\b/gi,replacement:'Hi',explanation:'Adjusted the greeting for workplace communication.'},
{id:'get-back',pattern:/\bget back to me\b/gi,replacement:'share your feedback',explanation:'Made the request sound more natural and collaborative.'},
{id:'check-this',pattern:/\bcheck this\b/gi,replacement:'review this',explanation:'Used more precise workplace wording.'}
])}
function clearwriteConcise(text){let result=clearwriteCore(text);return cwRewrite(result,[
{id:'filler',pattern:/\b(I just wanted to let you know|I wanted to let you know|I would like to inform you)\b[,:]?\s*/gi,replacement:'',explanation:'Removed introductory filler to make the message more direct.'},
{id:'in-order',pattern:/\bin order to\b/gi,replacement:'to',explanation:'Shortened the phrase without changing its meaning.'},
{id:'at-this-point',pattern:/\bat this point in time\b/gi,replacement:'currently',explanation:'Replaced a wordy phrase with a concise alternative.'},
{id:'due-to-fact',pattern:/\bdue to the fact that\b/gi,replacement:'because',explanation:'Replaced a wordy construction with a concise alternative.'}
])}
function clearwriteTone(text,tone){let result=clearwriteImprove(text);const rules=[];if(tone==='formal')rules.push({id:'formal-greeting',pattern:/\bHi Team\b/gi,replacement:'Dear Team',explanation:'Raised the greeting formality.'},{id:'formal-hi',pattern:/\bHi\b/g,replacement:'Hello',explanation:'Raised the greeting formality.'},{id:'formal-please',pattern:/\bplease\b/gi,replacement:'kindly',explanation:'Used more formal request wording.'},{id:'formal-thanks',pattern:/\bthanks\b/gi,replacement:'thank you',explanation:'Used a more formal closing.'});if(tone==='friendly')rules.push({id:'friendly-kindly',pattern:/\bkindly\b/gi,replacement:'please',explanation:'Softened formal wording for a warmer tone.'},{id:'friendly-inform',pattern:/\bI would like to inform you\b/gi,replacement:'I wanted to let you know',explanation:'Made the phrasing warmer and more conversational.'},{id:'friendly-hello',pattern:/\bHello\b/g,replacement:'Hi',explanation:'Used a warmer greeting.'});if(tone==='assertive')rules.push({id:'assertive-could',pattern:/\bcould you please\b/gi,replacement:'please',explanation:'Made the request more direct and confident.'},{id:'assertive-issues',pattern:/\bif you encounter any issues\b/gi,replacement:'if there are any issues',explanation:'Made the wording more direct.'});return cwRewrite(result,rules)}