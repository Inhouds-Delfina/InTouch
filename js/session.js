// Cerrar sesión al cerrar la ventana o navegar fuera
window.addEventListener('beforeunload', function() {
    // Llamada síncrona para asegurar que se ejecute
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/php/auto_logout.php', false);
    xhr.send();
});

// También cerrar sesión si la pestaña queda inactiva por mucho tiempo
let inactivityTimeout, warningTimeout, countdownInterval;
const INACTIVITY_TIME = 900 * 1000; // 15 minutos
const WARNING_TIME = 840 * 1000; // 14 minutos: mostrar aviso (1 minuto antes)

function clearTimers() {
    if (inactivityTimeout) clearTimeout(inactivityTimeout);
    if (warningTimeout) clearTimeout(warningTimeout);
    if (countdownInterval) clearInterval(countdownInterval);
    inactivityTimeout = null;
    warningTimeout = null;
    countdownInterval = null;
}

function startTimers() {
    // Limpiar timers existentes primero
    clearTimers();
    
    // Mostrar aviso 1 minuto antes del logout
    warningTimeout = setTimeout(() => {
        showInactivityWarning();
    }, WARNING_TIME);

    // Logout después de 15 minutos
    inactivityTimeout = setTimeout(() => {
        window.location.href = '/php/logout.php';
    }, INACTIVITY_TIME);
}

// Reiniciar timer en cualquier actividad
document.addEventListener('mousemove', startTimers);
document.addEventListener('keypress', startTimers);
document.addEventListener('click', startTimers);
document.addEventListener('scroll', startTimers);

// Inactividad: mostrar modal de advertencia
function showInactivityWarning() {
    // Si ya existe, no crear duplicados
    if (document.getElementById('inactivityWarningModal')) return;

    const modal = document.createElement('div');
    modal.id = 'inactivityWarningModal';
    modal.style.position = 'fixed';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.background = 'rgba(0,0,0,0.4)';
    modal.style.zIndex = '100000';

    const box = document.createElement('div');
    box.style.background = '#fff';
    box.style.padding = '20px';
    box.style.borderRadius = '8px';
    box.style.boxShadow = '0 6px 18px rgba(0,0,0,0.2)';
    box.style.maxWidth = '90%';
    box.style.textAlign = 'center';

    const title = document.createElement('h3');
    title.textContent = 'Aviso de inactividad';
    box.appendChild(title);

    const message = document.createElement('p');
    message.id = 'inactivityMessage';
    message.textContent = 'Se cerrará la sesión por inactividad en 15 segundos.';
    box.appendChild(message);

    const btnStay = document.createElement('button');
    btnStay.textContent = 'Quedarme conectado';
    btnStay.style.margin = '10px';
    btnStay.style.padding = '8px 12px';
    btnStay.style.borderRadius = '6px';
    btnStay.style.border = 'none';
    btnStay.style.background = '#4ecdc4';
    btnStay.style.color = '#fff';
    btnStay.style.cursor = 'pointer';
    btnStay.onclick = function() {
        // Reset timers y ocultar modal
        startTimers();
        hideInactivityWarning();
    };
    box.appendChild(btnStay);

    const btnLogout = document.createElement('button');
    btnLogout.textContent = 'Cerrar sesión ahora';
    btnLogout.style.margin = '10px';
    btnLogout.style.padding = '8px 12px';
    btnLogout.style.borderRadius = '6px';
    btnLogout.style.border = '1px solid #ccc';
    btnLogout.style.background = '#fff';
    btnLogout.style.cursor = 'pointer';
    btnLogout.onclick = function() {
        window.location.href = '/php/logout.php';
    };
    box.appendChild(btnLogout);

    modal.appendChild(box);
    document.body.appendChild(modal);

    // Countdown: mostrar segundos restantes hasta logout
    let remaining = 60; // 1 minuto de advertencia
    const msg = document.getElementById('inactivityMessage');
    
    function updateMessage() {
        if (remaining <= 0) {
            clearInterval(countdownInterval);
            return;
        }
        msg.textContent = `Se cerrará la sesión por inactividad en ${remaining} segundos.`;
        remaining--;
    }
    
    updateMessage(); // Mostrar mensaje inicial
    countdownInterval = setInterval(updateMessage, 1000);
}

function hideInactivityWarning() {
    const modal = document.getElementById('inactivityWarningModal');
    if (modal) modal.remove();
    clearInterval(countdownInterval);
}

// Iniciar el timer cuando carga la página
startTimers();