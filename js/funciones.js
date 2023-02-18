function conectarDB() {
    const abrirConexion = window.indexedDB.open('crm', 1);

    //! Si hay algun error
    abrirConexion.onerror = function () {
        console.log('Error Conectando la BD');
    }
    //! Si se creo bien
    abrirConexion.onsuccess = function () {
        DB = abrirConexion.result;
    }
}

function imprimirAlerta(mensaje, tipo) {

    const alerta = document.querySelector('.alerta');
    /**
     * Primero compruebo que la alerta no se ha creado para entoces mostrarla en el HTML
     * y que no se muestre varias veces
     */
    if (!alerta) {
        //! Crear alerta
        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border', 'alerta');
        if (tipo === 'error') {
            divMensaje.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
        } else {
            divMensaje.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
        }

        divMensaje.textContent = mensaje;
        formulario.appendChild(divMensaje);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000)
    }

    
}