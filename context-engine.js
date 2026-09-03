// ClearWrite V7 — Context Engine
// Deterministic context detection for workplace writing.

const CW_CONTEXTS={
 email:{label:'Email',description:'Structured workplace email',hints:['greeting','subject','sign-off']},
 reply:{label:'Reply',description:'Direct response to an existing message',hints:['acknowledgement','response','next step']},
 request:{label:'Request',description:'Action-oriented request',hints:['request','owner','deadline']},
 followup:{label:'Follow-up',description:'Follow-up on a pending item',hints:['previous request','status','next step']},
 escalation:{label:'Escalation',description:'Issue requiring attention or resolution',hints:['issue','impact','action required']},
 status:{label:'Status update',description:'Progress or operational update',hints:['progress','blocker','next step']},
 meeting:{label:'Meeting communication',description:'Meeting coordination or follow-up',hints:['agenda','time','action items']},
 conversation:{label:'Conversation',description:'Teams, Slack, or chat-style message',hints:['direct','concise','conversational']}
};

function cwContextScore(text){
 const t=text.toLowerCase();
 const scores=Object.fromEntries(Object.keys(CW_CONTEXTS).map(k=>[k,0]));
 const add=(keys,points)=>keys.forEach(k=>{if(k in scores)scores[k]+=points});
 if(/\b(dear|hi|hello)\b/.test(t)&&/\b(regards|thanks|thank you|sincerely)\b/.test(t))scores.email+=5;
 if(/\b(subject|attached|attachment|please find)\b/.test(t))scores.email+=2;
 if(/\b(reply|respond|response|as discussed|your email)\b/.test(t))scores.reply+=4;
 if(/\b(could you|can you|please|request|need you to|kindly)\b/.test(t))scores.request+=3;
 if(/\b(follow up|following up|reminder|pending|awaiting|waiting for)\b/.test(t))scores.followup+=5;
 if(/\b(escalat|urgent|critical|impact|blocked|blocker|issue|incident)\b/.test(t))scores.escalation+=4;
 if(/\b(status|progress|completed|in progress|update|current status|next step)\b/.test(t))scores.status+=4;
 if(/\b(meeting|agenda|minutes|mom|calendar|schedule|reschedule|discussion)\b/.test(t))scores.meeting+=4;
 if(/\b(hi|hey|hello|pls|asap|lol|thanks)\b/.test(t)&&!scores.email)scores.conversation+=2;
 if(text.split(/\s+/).length<45)scores.conversation+=1;
 return scores;
}

function clearwriteDetectContext(text,mode='email'){
 const scores=cwContextScore(text);
 if(mode==='conversation')scores.conversation+=4;
 if(mode==='email')scores.email+=2;
 const ordered=Object.entries(scores).sort((a,b)=>b[1]-a[1]);
 const key=ordered[0][1]>0?ordered[0][0]:mode;
 return {key, ...CW_CONTEXTS[key],scores};
}

function clearwriteContextGuidance(context){
 const guidance={
 email:'Keep a clear subject, professional opening, focused body, and appropriate sign-off.',
 reply:'Acknowledge the message, answer directly, and make the next step explicit.',
 request:'State the requested action clearly and include the owner or deadline when available.',
 followup:'Reference the pending item, ask for the current status, and clarify the next step.',
 escalation:'State the issue, business impact, urgency, and action required without unnecessary emotion.',
 status:'Lead with the current state, then highlight progress, blockers, and next steps.',
 meeting:'Make the purpose, timing, participants, decisions, and action items easy to scan.',
 conversation:'Keep the message direct, natural, and concise while preserving the conversational tone.'
 };
 return guidance[context.key]||guidance.email;
}
