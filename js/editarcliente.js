(function () {

    //?========================= Variables =========================
    let DB;
    let idCliente;
    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    const formulario = document.querySelector('#formulario');



    document.addEventListener('DOMContentLoaded', () => {

        conectarDB();
        const parametrosURL = new URLSearchParams(window.location.search);
        idCliente = parametrosURL.get('id');
        if (idCliente) {
            setTimeout(() =>{
                obtenerCliente(idCliente);
            },100);
        }

        //! Actualiza el registro
        formulario.addEventListener('submit', actualizarCliente);
    })


    //?========================= Funciones =========================

    function obtenerCliente(id){
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        const cliente = objectStore.openCursor();
        cliente.onsuccess = function(e){
            const cursor = e.target.result;
            if(cursor){
                if(cursor.value.id === Number(id)){
                    llenarFromulario(cursor.value);
                }

                cursor.continue();
            }
        }
    }

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

    function llenarFromulario(cliente){
        const { nombre, email, telefono, empresa } = cliente;

        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;

    }

    function actualizarCliente(e){
        e.preventDefault();

        if(nombreInput.value === '' || emailInput.value === '' || telefonoInput.value === '' || empresaInput.value === ''){
            imprimirAlerta('Todos los Campos son Obligatorios', 'error');

            return;
        }

        const clienteAct = {
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            empresa: empresaInput.value,
            id: Number(idCliente),
        }

        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.put(clienteAct);

        transaction.oncomplete = function() {
            imprimirAlerta('Editado correctamente');
        }

        transaction.onerror = function() {
            imprimirAlerta('Hubo un error en la edicion', 'error');
        }

        setTimeout( () =>{
            window.location.href = 'index.html';
        },2000)
    }


})();