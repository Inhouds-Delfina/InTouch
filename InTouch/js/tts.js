document.getElementById('speakText')?.addEventListener('click', () => {
  const text = document.getElementById('freeText').value.trim();
  speak(text);
});

document.getElementById('stopSpeech')?.addEventListener('click', () => {
  window.speechSynthesis.cancel();
});
