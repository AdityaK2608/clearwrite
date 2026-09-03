const input = document.getElementById('inputText');
const output = document.getElementById('resultArea');
const resultHint = document.getElementById('resultHint');
const resultMeta = document.getElementById('resultMeta');
const charCount = document.getElementById('charCount');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');
const sampleBtn = document.getElementById('sampleBtn');
const modeHint = document.getElementById('modeHint');
let lastResult = '';
let mode = 'email';

const samples = {
  email: 'Hi Team,\n\nPlease find attached the report. Kindly check it and revert back to me if there is any issue.\n\nThanks & Regards,\nAditya',
  conversation: 'hi, can you please check this once and let me know if there is any issue. i need this asap'
};

const replacements = [
  [/\bpls\b/gi, 'please'],
  [/\basap\b/gi, 'as soon as possible'],
  [/\bkindly check it and revert back to me\b/gi, 'please review it and let me know'],
  [/\brevert back\b/gi, 'get back'],
  [/\bi need this asap\b/gi, 'I need this as soon as possible'],
  [/\bcan you please check this once\b/gi, 'could you please check this'],
  [/\bif there is any issue\b/gi, 'if you encounter any issues'],
  [/\bplease find attached\b/gi, 'please find the attached'],
];

function normalize(text) {
  let result = text.trim();
  replacements.forEach(([pattern, replacement]) => { result = result.replace(pattern, replacement); });
  result = result.replace(/\bi\b/g, 'I');
  result = result.replace(/\b(i|we|you|the customer|customer)\s+([a-z])/g, (_, a, b) => `${a} ${b.toUpperCase()}`);
  result = result.replace(/[ \t]+/g, ' ');
  result = result.replace(/\s+\n/g, '\n');
  return result;
}

function sentences(text) {
  return text.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);
}

function ensurePunctuation(text) {
  return text.split('\n').map(line => {
    const trimmed = line.trim();
    if (!trimmed || /^[A-Z][^:]{0,60}:$/.test(trimmed) || /^[-•]/.test(trimmed)) return line;
    if (!/[.!?]$/.test(trimmed)) return `${trimmed}.`;
    return trimmed;
  }).join('\n');
}

function professional(text) {
  let result = normalize(text);
  result = result.replace(/\bhey\b/gi, 'Hi');
  result = result.replace(/\bjust wanted to\b/gi, 'I would like to');
  result = result.replace(/\bget back to me\b/gi, 'share your feedback');
  result = result.replace(/\bcheck this\b/gi, 'review this');
  result = result.replace(/\bneed this\b/gi, 'require this');
  return ensurePunctuation(result);
}

function formal(text) {
  let result = professional(text);
  result = result.replace(/\bHi Team\b/gi, 'Dear Team');
  result = result.replace(/\bHi\b/gi, 'Hello');
  result = result.replace(/\bplease\b/gi, 'kindly');
  result = result.replace(/\bthanks\b/gi, 'thank you');
  return result;
}

function friendly(text) {
  let result = normalize(text);
  result = result.replace(/\bkindly\b/gi, 'please');
  result = result.replace(/\bI would like to\b/gi, 'I wanted to');
  result = result.replace(/\bHello\b/g, 'Hi');
  return ensurePunctuation(result);
}

function concise(text) {
  const normalized = normalize(text);
  const parts = sentences(normalized);
  const filtered = parts.filter(s => !/^I just wanted to let you know/i.test(s));
  return (filtered.length ? filtered : parts).join(' ');
}

function grammar(text) {
  let result = normalize(text);
  result = result.replace(/,\s*(and|but|or)\s*/gi, ', $1 ');
  result = ensurePunctuation(result);
  return result;
}

function applyAction(action) {
  const source = input.value.trim();
  if (!source) {
    output.innerHTML = '<div class="empty-state"><div class="spark">✦</div><p>Add some text first.</p><span>Paste an email or conversation, then choose an action.</span></div>';
    resultHint.textContent = 'Waiting for your draft.';
    copyBtn.disabled = true;
    lastResult = '';
    resultMeta.textContent = '';
    return;
  }

  const handlers = { grammar, professional, concise, formal, friendly };
  lastResult = handlers[action](source);
  output.textContent = lastResult;
  resultHint.textContent = `${action[0].toUpperCase()}${action.slice(1)} pass complete.`;
  resultMeta.textContent = `${lastResult.length} characters · demo correction layer`;
  copyBtn.disabled = false;
}

input.addEventListener('input', () => {
  charCount.textContent = `${input.value.length} / 5000`;
  if (!input.value) {
    output.innerHTML = '<div class="empty-state"><div class="spark">✦</div><p>Your improved text will appear here.</p><span>Start with Grammar or Professional.</span></div>';
    resultHint.textContent = 'Choose an action to preview the result.';
    resultMeta.textContent = '';
    copyBtn.disabled = true;
    lastResult = '';
  }
});

document.querySelectorAll('.action').forEach(button => {
  button.addEventListener('click', () => applyAction(button.dataset.action));
});

document.querySelectorAll('.mode').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.mode').forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });
    button.classList.add('active');
    button.setAttribute('aria-selected', 'true');
    mode = button.dataset.mode;
    modeHint.textContent = mode === 'email' ? 'Paste an email, note, or reply.' : 'Paste a Slack, Teams, or chat-style message.';
  });
});

sampleBtn.addEventListener('click', () => {
  input.value = samples[mode];
  input.dispatchEvent(new Event('input'));
});

clearBtn.addEventListener('click', () => {
  input.value = '';
  input.dispatchEvent(new Event('input'));
  input.focus();
});

copyBtn.addEventListener('click', async () => {
  if (!lastResult) return;
  try {
    await navigator.clipboard.writeText(lastResult);
    const previous = copyBtn.textContent;
    copyBtn.textContent = 'Copied';
    setTimeout(() => { copyBtn.textContent = previous; }, 1200);
  } catch {
    resultMeta.textContent = 'Copy unavailable — select the text manually.';
  }
});
