document.addEventListener('DOMContentLoaded', function() {
  // Configurar controles de rango para mostrar valores
  const rateInput = document.getElementById('rate');
  const pitchInput = document.getElementById('pitch');
  const rateValue = document.getElementById('rateValue');
  const pitchValue = document.getElementById('pitchValue');

  if (rateInput && rateValue) {
    rateInput.addEventListener('input', function() {
      rateValue.textContent = this.value;
    });
  }

  if (pitchInput && pitchValue) {
    pitchInput.addEventListener('input', function() {
      pitchValue.textContent = this.value;
    });
  }

  // Configurar botones de TTS
  document.getElementById('speakText')?.addEventListener('click', () => {
    const text = document.getElementById('freeText').value.trim();
    if (!text) {
      mostrarNotificacionTTS('Por favor escribe algún texto', 'warning');
      return;
    }

    try {
      speak(text);
      mostrarEstadoTTS('Reproduciendo...', 'playing');
    } catch (error) {
      console.error('Error al reproducir:', error);
      mostrarNotificacionTTS('Error al reproducir el texto', 'error');
    }
  });

  document.getElementById('stopSpeech')?.addEventListener('click', () => {
    try {
      window.speechSynthesis.cancel();
      mostrarEstadoTTS('', 'stopped');
    } catch (error) {
      console.error('Error al detener:', error);
    }
  });

  // Configurar eventos de síntesis de voz
  if (window.speechSynthesis) {
    window.speechSynthesis.onstart = function() {
      mostrarEstadoTTS('Reproduciendo...', 'playing');
    };

    window.speechSynthesis.onend = function() {
      mostrarEstadoTTS('', 'stopped');
    };

    window.speechSynthesis.onerror = function(event) {
      console.error('Error de síntesis:', event);
      mostrarEstadoTTS('Error de reproducción', 'error');
    };
  }
});

function mostrarNotificacionTTS(mensaje, tipo = 'info') {
  // Crear elemento de notificación
  const notif = document.createElement('div');
  notif.className = `tts-notification ${tipo}`;
  notif.innerHTML = `
    <span>${mensaje}</span>
    <button onclick="this.parentElement.remove()">&times;</button>
  `;

  // Agregar estilos inline
  notif.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: slideInRight 0.3s ease;
    ${tipo === 'success' ? 'background: #4ecdc4;' : ''}
    ${tipo === 'error' ? 'background: #ff6b6b;' : ''}
    ${tipo === 'warning' ? 'background: #f39c12;' : ''}
    ${tipo === 'info' ? 'background: #667eea;' : ''}
  `;

  document.body.appendChild(notif);

  // Auto-remover después de 3 segundos
  setTimeout(() => {
    if (notif.parentElement) {
      notif.remove();
    }
  }, 3000);
}

function mostrarEstadoTTS(mensaje, estado) {
  const statusDiv = document.getElementById('ttsStatus');
  const statusText = document.getElementById('ttsStatusText');
  const statusIcon = document.getElementById('ttsStatusIcon');

  if (!statusDiv) return;

  if (mensaje) {
    statusDiv.style.display = 'flex';
    if (statusText) statusText.textContent = mensaje;

    if (estado === 'playing') {
      if (statusIcon) statusIcon.textContent = '🔊';
    } else if (estado === 'error') {
      if (statusIcon) statusIcon.textContent = '❌';
    }
  } else {
    statusDiv.style.display = 'none';
  }
}
