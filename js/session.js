// Cerrar sesión al cerrar la ventana o navegar fuera
window.addEventListener('beforeunload', function() {
    // Llamada síncrona para asegurar que se ejecute
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/php/auto_logout.php', false);
    xhr.send();
});

// También cerrar sesión si la pestaña queda inactiva por mucho tiempo
let inactivityTimeout, warningTimeout, countdownInterval;
const INACTIVITY_TIME = 1200; // 15 minutos en segundos
let currentTime = INACTIVITY_TIME;

function clearTimers() {
    console.log('🔄 Limpiando timers existentes');
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
    
    // Resetear el tiempo
    currentTime = INACTIVITY_TIME;
    console.log(`⏰ Iniciando nuevo timer: ${currentTime} segundos`);
    
    // Iniciar contador en la consola
    countdownInterval = setInterval(() => {
        currentTime--;
        if (currentTime % 60 === 0) { // Mostrar cada minuto
            console.log(`⏳ Tiempo restante: ${currentTime} segundos (${Math.floor(currentTime/60)} minutos)`);
        }
        
        // Mostrar advertencia cuando quede 1 minuto
        if (currentTime === 60) {
            console.log('⚠️ ¡ADVERTENCIA! Queda 1 minuto');
            showInactivityWarning();
        }
        
        // Cerrar sesión cuando se acabe el tiempo
        if (currentTime <= 0) {
            console.log('🚪 Cerrando sesión por inactividad');
            clearInterval(countdownInterval);
            window.location.href = '/php/logout.php';
        }
    }, 1000);
}

// Función para manejar cualquier actividad del usuario
function handleUserActivity() {
    console.log('👤 Actividad detectada - Reiniciando timer');
    startTimers();
}

// Reiniciar timer en cualquier actividad
document.addEventListener('mousemove', handleUserActivity);
document.addEventListener('keypress', handleUserActivity);
document.addEventListener('click', handleUserActivity);
document.addEventListener('scroll', handleUserActivity);

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

        let warningTime = 60; // 1 minuto de advertencia
    const msg = document.getElementById('inactivityMessage');
    console.log('⚠️ Mostrando modal de advertencia');
    
    function updateWarningMessage() {
        if (warningTime <= 0) {
            console.log('⏰ Tiempo de advertencia agotado');
            clearInterval(countdownInterval);
            return;
        }
        msg.textContent = `Se cerrará la sesión por inactividad en ${warningTime} segundos.`;
        warningTime--;
    }
    
    updateWarningMessage(); // Mostrar mensaje inicial
    countdownInterval = setInterval(updateWarningMessage, 1000);
}

function hideInactivityWarning() {
    const modal = document.getElementById('inactivityWarningModal');
    if (modal) modal.remove();
    clearInterval(countdownInterval);
}

// Iniciar el timer cuando carga la página
startTimers();