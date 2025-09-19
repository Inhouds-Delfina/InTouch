const synth = window.speechSynthesis;
let voices = [];


function pickSpanishVoice(vlist) {
  const byLang = (lang) => vlist.filter(v => (v.lang || '').toLowerCase().startsWith(lang));
  return byLang('es-ar')[0] || byLang('es-')[0] || vlist[0] || null;
}


function loadVoices() {
  voices = synth.getVoices();
  const sel = document.getElementById('voiceSelect');
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

loadVoices();
if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = loadVoices;
}


function speak(text) {
  if (!text) return;

  if (!voices.length) {
    voices = synth.getVoices();
  }

  const utter = new SpeechSynthesisUtterance(text);
  const sel = document.getElementById('voiceSelect');
  const rate = parseFloat(document.getElementById('rate').value);
  const pitch = parseFloat(document.getElementById('pitch').value);
  const selected = voices[sel.selectedIndex] || pickSpanishVoice(voices);

  if (selected) utter.voice = selected;
  utter.rate = rate;
  utter.pitch = pitch;


  synth.cancel();
  synth.speak(utter);
}


const sentenceEl = document.getElementById('sentence');
const grid = document.getElementById('pictogramGrid');


function addChip(text) {
  const span = document.createElement('span');
  span.className = 'chip';
  span.textContent = text;
  span.tabIndex = 0;
  span.title = 'Click para pronunciar';
  span.addEventListener('click', () => speak(text));
  sentenceEl.appendChild(span);
}


function sentenceText() {
  return Array.from(sentenceEl.querySelectorAll('.chip')).map(c => c.textContent).join(' ');
}


grid.addEventListener('click', (e) => {
  const tile = e.target.closest('.tile');
  if (!tile) return;
  const text = tile.getAttribute('data-say');
  addChip(text);
  speak(text);
  tile.blur();
});


grid.querySelectorAll('.tile').forEach(tile => {
  tile.tabIndex = 0;
  tile.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      tile.click();
    }
  });
});


document.getElementById('speakSentence').addEventListener('click', () => {
  speak(sentenceText());
});

document.getElementById('clearSentence').addEventListener('click', () => {
  sentenceEl.innerHTML = '';
});

document.getElementById('speakText').addEventListener('click', () => {
  const text = document.getElementById('freeText').value.trim();
  speak(text);
});

document.getElementById('stopSpeech').addEventListener('click', () => {
  synth.cancel();
});


const categorySelect = document.getElementById('categorySelect');
categorySelect.addEventListener('change', () => {
  const cat = categorySelect.value;
  grid.querySelectorAll('.tile').forEach(tile => {
    const tcat = tile.getAttribute('data-cat');
    if (cat === 'all' || tcat === cat) {
      tile.style.display = '';
    } else {
      tile.style.display = 'none';
    }
  });
});


const addBtn = document.getElementById('addPictoBtn');
addBtn.addEventListener('click', () => {
  const label = document.getElementById('pictoLabel').value.trim();
  const cat = document.getElementById('pictoCategory').value;
  const fileInput = document.getElementById('pictoImage');
  if (!label || !fileInput.files[0]) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const imgSrc = e.target.result;


    const btn = document.createElement('button');
    btn.className = 'tile';
    btn.setAttribute('data-say', label);
    btn.setAttribute('data-cat', cat);
    btn.innerHTML = `<img src="${imgSrc}" alt="${label}" class="picto-img"><div class="label">${label}</div>`;
    grid.appendChild(btn);

    // 🚀 (Opcional) Enviar a tu servidor
    /*
    const formData = new FormData();
    formData.append("texto", label);
    formData.append("categoria", cat);
    formData.append("imagen", fileInput.files[0]);

    fetch("https://TU-SERVIDOR.com/api.php", {
      method: "POST",
      body: formData
    })
    .then(res => res.json())
    .then(data => console.log("Guardado en DB:", data))
    .catch(err => console.error("Error al guardar:", err));
    */
  };

  reader.readAsDataURL(fileInput.files[0]);


  document.getElementById('pictoLabel').value = '';
  fileInput.value = '';
});


if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .then(reg => console.log("Service Worker registrado:", reg))
      .catch(err => console.log("Error al registrar Service Worker:", err));
  });
}
