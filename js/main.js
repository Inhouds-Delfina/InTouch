const synth = window.speechSynthesis;
let voices = [];

function pickSpanishVoice(vlist) {
  const byLang = (lang) => vlist.filter(v => (v.lang || '').toLowerCase().startsWith(lang));
  return byLang('es-ar')[0] || byLang('es-')[0] || vlist[0] || null;
}

function loadVoices() {
  voices = synth.getVoices();
  const sel = document.getElementById('voiceSelect');
  if (!sel) return;
  sel.innerHTML = '';
  const preferred = pickSpanishVoice(voices);
  voices.forEach((v, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `${v.name} — ${v.lang}${v.default ? ' (predeterminada)' : ''}`;
    if (v === preferred) opt.selected = true;
    sel.appendChild(opt);
  });
}

function speak(text) {
  if (!text) return;
  if (!voices.length) voices = synth.getVoices();

  const utter = new SpeechSynthesisUtterance(text);
  const sel = document.getElementById('voiceSelect');
  const rate = parseFloat(document.getElementById('rate')?.value || 1);
  const pitch = parseFloat(document.getElementById('pitch')?.value || 1);
  const selected = voices[sel?.selectedIndex] || pickSpanishVoice(voices);

  if (selected) utter.voice = selected;
  utter.rate = rate;
  utter.pitch = pitch;

  synth.cancel();
  synth.speak(utter);
}

loadVoices();
if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = loadVoices;
}
