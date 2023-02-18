(function () {
    let DB;
    //! Variables de lectura del HTML
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        formulario.addEventListener('submit', validarCliente);
        
        conectarDB();
    })

    function conectarDB() {
        // ABRIR CONEXIÓN EN LA BD:

        const abrirConexion = window.indexedDB.open('crm', 1);

        // si hay un error, lanzarlo
        abrirConexion.onerror = function() {
            console.log('Hubo un error');
        };
    
        // si todo esta bien, asignar a database el resultado
        abrirConexion.onsuccess = function() {
            // guardamos el resultado
            DB = abrirConexion.result;
        };
    }

    function validarCliente(e) {
        e.preventDefault();

        //! Leer todos los inputs
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        //! Validar los inputs
        if (nombre.trim() === '' || empresa.trim() === '' || telefono.trim() === '' || email.trim() === '' || telefono.trim() === '') {
            imprimirAlerta('Todos los Campos son Obligatorios', 'error');
            return;
        }

        if (validarTelefono(telefono) === false) {
            imprimirAlerta('El Telefono no es Válido', 'error');
            return;
        }

        if (validarEmail(email) === false) {
            imprimirAlerta('El Email no es Válido', 'error');
            return;
        }

        //! Crear un nuevo objeto con la informacion
        const cliente = {
            nombre,
            email,
            telefono,
            empresa,
        }

        cliente.id = Date.now();

        crearNuevoCliente(cliente);
    }


    
    //?========================= Funciones =========================

    function crearNuevoCliente(cliente) {

        // NUEVO: 
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');
        // console.log(objectStore);
        objectStore.add(cliente);

        transaction.oncomplete = () => {
            console.log('Cliente Agregado');

            // Mostrar mensaje de que todo esta bien...
            imprimirAlerta('Se agregó correctamente');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        };

        transaction.onerror = () => {
            console.log('Hubo un error!');
            imprimirAlerta('Hubo un Error', 'error');
        };
    }



    function validarEmail(email) {
        const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
        const resultado = regex.test(email);

        if (!resultado) {
            imprimirAlerta('El email no es correcto', 'error');
            return false;
        }

    }

    function validarTelefono(telefono) {
        const regex = /^\d+$/;
        const resultado = regex.test(telefono);

        if (!resultado) {
            imprimirAlerta('El Teléfono no es correcto', 'error');
            return false;
        }
    }


})();