// ClearWrite Engine — conservative transformation registry
(function(){
  window.CWEngine=window.CWEngine||{};
  const RULES=[
    ['lowercase-i',/\bi\b/g,'I','grammar','Capitalized the pronoun “I”.',.99,'low'],
    ['pls',/\bpls\b/gi,'please','grammar','Expanded “pls” into professional wording.',.99,'low'],
    ['asap',/\basap\b/gi,'as soon as possible','grammar','Expanded “ASAP” into a clear phrase.',.99,'low'],
    ['revert-back',/\brevert back\b/gi,'get back','clarity','Removed redundant wording.',.98,'low'],
    ['discuss-about',/\bdiscuss about\b/gi,'discuss','grammar','Removed an unnecessary preposition.',.99,'low'],
    ['do-needful',/\bdo the needful\b/gi,'take the necessary action','clarity','Replaced an ambiguous workplace phrase.',.96,'low'],
    ['an-issue',/\bwe are facing issue\b/gi,'we are facing an issue','grammar','Added the missing article.',.99,'low'],
    ['customer',/\bcustomer is\b/gi,'the customer is','grammar','Added the article for natural business English.',.98,'low'],
    ['following',/\bcontinuously following up\b/gi,'following up repeatedly','clarity','Made repeated follow-up wording more natural.',.91,'medium'],
    ['priority',/\bcheck on priority\b/gi,'prioritize this','clarity','Replaced awkward wording with a direct request.',.93,'medium'],
    ['indirect-question',/\bwhat is the exact issue\b/gi,'what the exact issue is','grammar','Corrected indirect-question word order.',.99,'low'],
    ['resolution',/\bwhen it will be resolved\b/gi,'when it can be resolved','clarity','Made the resolution timeline more natural.',.88,'medium'],
    ['already-asked',/\bwe already asked\b/gi,'we have already asked','grammar','Used a natural tense for a recent completed action.',.96,'low'],
    ['no-response',/\bthere is no response from their side\b/gi,'we have not received a response from them','clarity','Made the statement clearer and more professional.',.95,'low'],
    ['customer-waiting',/\bcustomer is waiting\b/gi,'the customer is awaiting an update','clarity','Made the customer status more professional.',.92,'medium'],
    ['please-check',/\bplease check\b/gi,'please review','style','Used more precise workplace wording.',.78,'medium'],
    ['filler',/\bjust wanted to let you know\b/gi,'I would like to inform you','style','Removed conversational filler.',.94,'low'],
    ['filler2',/\bi wanted to let you know\b/gi,'I would like to inform you','style','Made the opening more direct.',.94,'low'],
    ['duplicate',/\b(\w+)(?:\s+\1\b)+/gi,'$1','grammar','Removed a duplicated word.',.99,'low']
  ];
  CWEngine.apply=function(text,mode){let value=CWEngine.normalize(text),changes=[];for(const r of RULES){r[1].lastIndex=0;if(r[1].test(value)){r[1].lastIndex=0;value=value.replace(r[1],m=>{changes.push(CWEngine.diagnostic(r[0],r[3],m,r[2],r[4],r[5],r[6]));return r[2]})}}return{value,changes}};
  CWEngine.punctuation=function(text){return text.split('\n').map(line=>{const t=line.trim();if(!t||/^[-•*]/.test(t)||/^https?:\/\//i.test(t))return line;return /[.!?…:;,]$/.test(t)?t:`${t}.`}).join('\n')};
  CWEngine.capitalise=function(text){return text.replace(/(^|[.!?]\s+)([a-z])/g,(_,p,l)=>p+l.toUpperCase())};
})();
