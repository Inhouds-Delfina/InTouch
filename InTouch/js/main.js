
const synth = window.speechSynthesis;
let voices = [];
let voicesLoaded = false;

function pickSpanishVoice(vlist) {
  const byLang = (lang) => vlist.filter(v => (v.lang || '').toLowerCase().startsWith(lang));
  return byLang('es-ar')[0] || byLang('es-')[0] || vlist[0] || null;
}

function loadVoices() {
  voices = synth.getVoices();
  const sel = document.getElementById('voiceSelect');
  if (sel) {
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
  voicesLoaded = true;
  console.log(`✅ Voces cargadas: ${voices.length}`);
}

function initVoices() {
  if (synth.getVoices().length !== 0) {
    loadVoices();
  } else {
    synth.onvoiceschanged = loadVoices;
  }
}

function speak(text) {
  if (!text) return;

  if (!voicesLoaded) {
    initVoices();
    setTimeout(() => speak(text), 500);
    return;
  }

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

document.addEventListener("DOMContentLoaded", initVoices);
