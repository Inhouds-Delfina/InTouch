const sentenceEl = document.getElementById('sentence');
const grid = document.getElementById('pictogramGrid');

function addChip(text) {
  const span = document.createElement('span');
  span.className = 'chip';
  span.textContent = text;
  span.title = 'Click para pronunciar';
  span.addEventListener('click', () => speak(text));
  sentenceEl?.appendChild(span);
}


if (grid) {
  grid.addEventListener('click', (e) => {
    const tile = e.target.closest('.tile');
    if (!tile) return;
    const text = tile.getAttribute('data-say');
    addChip(text);
    speak(text);
  });
}


const speakBtn = document.getElementById('speakSentence');
if (speakBtn) {
  speakBtn.addEventListener('click', () => {
    const sentence = Array.from(sentenceEl.querySelectorAll('.chip'))
      .map(c => c.textContent)
      .join(' ');
    speak(sentence);
  });
}


const clearBtn = document.getElementById('clearSentence');
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    sentenceEl.innerHTML = '';
  });
}
