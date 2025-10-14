 function mostrarMenu() {
    const menuButton = document.getElementById('menufloat');
    const subButtons = document.querySelector('.subButton-container');
    const buttons = subButtons.querySelectorAll('.buttonChild');
    if (subButtons.style.display === 'flex') {
        // Del, esn esta parte recorro los botones y oculto el que corresponda
        buttons.forEach((btn, i) => {
            btn.classList.remove('visible');
            btn.style.bottom = '0px';
        });
        setTimeout(() => {
            subButtons.style.display = 'none';
            menuButton.classList.remove('rotar45');
        }, 300);
    } else {
        subButtons.style.display = 'flex';
        menuButton.classList.add('rotar45');
        buttons.forEach((btn, i) => {
            setTimeout(() => {
                btn.classList.add('visible');
                btn.style.bottom = `${i * 84}px`;
            }, i * 50); //  el 50 indica el retraso entre cada botón en ms, cambialo como quieras Delfi
        });
    }
 }