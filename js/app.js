//Mostrar las citas guardadas en indexDB al recargar la página...

/*
1.Buscar todos los de imprimirCitas
y que tengan administrarCitas, o se que estén mandando llamar el arreglo
A esto le vamos a quitar lo de administrarCitas...

Igual en el de imprimir citas, donde extraemos la cita con la manera de objeto, adios..
*/
let DB; 
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

// Contenedor para las citas
const contenedorCitas = document.querySelector('#citas');

// Formulario nuevas citas
const formulario = document.querySelector('#nueva-cita')
formulario.addEventListener('submit', nuevaCita);

// Heading
const heading = document.querySelector('#administra');

let editando = false;

// Eventos
eventListeners();
function eventListeners() {
    mascotaInput.addEventListener('change', datosCita);
    propietarioInput.addEventListener('change', datosCita);
    telefonoInput.addEventListener('change', datosCita);
    fechaInput.addEventListener('change', datosCita);
    horaInput.addEventListener('change', datosCita);
    sintomasInput.addEventListener('change', datosCita);
    document.addEventListener('DOMContentLoaded', () => {
        crearBaseDeDatos();
    });
}

/*Creando la base de datos...
1.evento domcontendloaded y mandar llamar una funcion...
2.método open, nombre y version, 
3.Si hay error
4.Si no hay error 
5.Variable global que guarda el resultado del evento..
pasarle ese esultado e igualarlo a la variable de la base de datos
dentro de la misma funcion de oneSuccess...
6.Crear otra variable en onupgradeneed que guarde a su vez el resultado con
el parámetro de e
7.Crear el objectStore, ponerle el resultado del evento de arriba, con el 
método createObjectStore, el nombre de nuestra base de datos.
8.Le ponemos un keyPath: (este es el índice) cuando se crea una base de datos
de pueden agregarle índices, en este caso le vamos a poner que el indice
va a ser EL ID.
Esto porque cada cita que tenemos se le va agregando un id.
9.Autoincement
10.Definir las columnas, el primero es el nombre y el segundo es el keypath
o sea el como vamos a acceder a los diferentes valores o campos
/
Claro que lo que vamos a guardar en la base de datos son los datos con los que estamos
trabajando, por ejemplo todo lo que engloba el usurio, pero mi pregunta es
si puedo hacer lo de la práctica, que si poníamos amm un usuario completo, lo 
podríamos englobar así, si no me equivoco...

/
*/

function crearBaseDeDatos(){
    //Creando la base de datos
    let crearDB = window.indexedDB.open('citas', 1.0);
    
    //En caso de que la base de datos llegue a fallar...
    crearDB.onerror = function(){
        console.log('Hubo un error al crear la base de datos');
    }
    //Si la base de datos se creo bien
    crearDB.onsuccess = function(){
        console.log('Base de datos creada correctamente');
        DB = crearDB.result;

        //MOSTRAR LAS CITAS AL CARGAR CUANDO INDEXDB YA ESTÉ LISTO
        ui.imprimirCitas();
    } 
    //Configurar la base de datos
    crearDB.onupgradeneeded = function(e){
        /*console.log('configurando base de datos');
        console.log(e.target.result);*/
       //Capturando el evento en una variable
        const db = e.target.result; 
        //CREANDO EL OBJECTSTORE
       const objectStore = db.createObjectStore('citas', {
            keyPath: 'id',
            autoIncrement: true, 

        });
            //Definir todas las columnas..
            objectStore.createIndex('mascota', 'mascota', {unique: false});
            objectStore.createIndex('propietario', 'propietario', {unique: false});
            objectStore.createIndex('telefono', 'telefono', {unique: false});
            objectStore.createIndex('fecha', 'fecha', {unique: false});
            objectStore.createIndex('hora', 'hora', {unique: true});
            objectStore.createIndex('sintomas', 'sintomas', {unique: false});
            objectStore.createIndex('id', 'id', {unique: true});
            console.log('Base de datos creada y lista...');
        
    }

}

const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora:'',
    sintomas: ''
}


function datosCita(e) {
    //  console.log(e.target.name) // Obtener el Input
     citaObj[e.target.name] = e.target.value;
}

// CLasses
class Citas {
    constructor() {
        this.citas = []
    }
    agregarCita(cita) {
        this.citas = [...this.citas, cita];
    }
    editarCita(citaActualizada) {
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita)
    }

    eliminarCita(id) {
        this.citas = this.citas.filter( cita => cita.id !== id);
    }
}

class UI {

    constructor() {
    //const {citas} = citas;Lo podríamos extraer así o desde arriba... 
        this.textoHeading(citas);
    }

    imprimirAlerta(mensaje, tipo) {
        // Crea el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');
        
        // Si es de tipo error agrega una clase
        if(tipo === 'error') {
             divMensaje.classList.add('alert-danger');
        } else {
             divMensaje.classList.add('alert-success');
        }

        // Mensaje de error
        divMensaje.textContent = mensaje;

        // Insertar en el DOM
        document.querySelector('#contenido').insertBefore( divMensaje , document.querySelector('.agregar-cita'));

        // Quitar el alert despues de 3 segundos
        setTimeout( () => {
            divMensaje.remove();
        }, 3000);
   }
   //{citas} antes estaba esta parte porque estabamos extrayendo la cita
   imprimirCitas() { // Se puede aplicar destructuring desde la función...
       
        this.limpiarHTML();

        this.textoHeading(citas);     

        //LEER EL CONTENIDO DE LA BASE DE DATOS
        const objectStore = DB.transaction('citas').objectStore('citas');

        const total = objectStore.count();
       
        const fnTextoHeading = this.textoHeading;/*Aquí estamos solucionando el error
    de que texto heading arriba, manda llamar una función, pero esa función hace referencia a 
    citas nuevamente, por lo que ya no es necesaria y sólo nos trae errores.
    Por lo que vamos al objectStore, entramos a el, creamos una variable y la igualamos
    con textoHeading para que esa variable sea lo mismo que esa funcion y mnadamos llamar
    esa misma variable que guarda la funcion del textoHeading dentro del succes de total.
    
    Y no ocupamos llamar la función exactamente, de hecho, si la llamamos nos da error
    porque aparece que lo que estamos llamando no es una función, es como si
    el mandar a llamar el nombre de la función pero no la función fuera un método 
    para convertir e igualar una función a otra...*/

       total.onsuccess = function(){
           // console.log(total.result); 
            fnTextoHeading(total.result);
        }
       /*Para leer los regsitros, para traernos todo lo que hay en las columnas hacemos...*/
        objectStore.openCursor().onsuccess = function(e){/*.openCursor se encarga
        de ir iterando sobre cada curso...*/
            const cursor = e.target.result;

            if(cursor){
                const {mascota, propietario, telefono, fecha, hora, sintomas, id } = cursor.value;
            /*Aquí le hemos aplicado destructuring para la cita, ahora, esa cita
            es donde le estuvimos aplicando destructurign, pero ya la cambié, por lo que
            ahora lo que está tomando el lugar del resultado del evento después de iterar con
            openCursor, es cursor, por lo que le ponemos cursor.value
            esto para decir que queremos el valor
            entonces sería, cursor.value*/
                const divCita = document.createElement('div');
                divCita.classList.add('cita', 'p-3');
                divCita.dataset.id = id;

                // scRIPTING DE LOS ELEMENTOS...
                const mascotaParrafo = document.createElement('h2');
                mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
                mascotaParrafo.innerHTML = `${mascota}`;

                const propietarioParrafo = document.createElement('p');
                propietarioParrafo.innerHTML = `<span class="font-weight-bolder">Propietario: </span> ${propietario}`;

                const telefonoParrafo = document.createElement('p');
                telefonoParrafo.innerHTML = `<span class="font-weight-bolder">Teléfono: </span> ${telefono}`;

                const fechaParrafo = document.createElement('p');
                fechaParrafo.innerHTML = `<span class="font-weight-bolder">Fecha: </span> ${fecha}`;

                const horaParrafo = document.createElement('p');
                horaParrafo.innerHTML = `<span class="font-weight-bolder">Hora: </span> ${hora}`;

                const sintomasParrafo = document.createElement('p');
                sintomasParrafo.innerHTML = `<span class="font-weight-bolder">Síntomas: </span> ${sintomas}`;

                // Agregar un botón de eliminar...
                const btnEliminar = document.createElement('button');
                btnEliminar.onclick = () => eliminarCita(id); // añade la opción de eliminar
                btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
                btnEliminar.innerHTML = 'Eliminar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'

                // Añade un botón de editar...
                const btnEditar = document.createElement('button');
                btnEditar.onclick = () => cargarEdicion(cita);

                btnEditar.classList.add('btn', 'btn-info');
                btnEditar.innerHTML = 'Editar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>'

                // Agregar al HTML
                divCita.appendChild(mascotaParrafo);
                divCita.appendChild(propietarioParrafo);
                divCita.appendChild(telefonoParrafo);
                divCita.appendChild(fechaParrafo);
                divCita.appendChild(horaParrafo);
                divCita.appendChild(sintomasParrafo);
                divCita.appendChild(btnEliminar)
                divCita.appendChild(btnEditar)

                contenedorCitas.appendChild(divCita);
                /*Sin embargo una vez que todo este html se genera, se va agregando 
                el contenido en el DOM, le tenemos que decir, que vaya al siguiente elemento
                por lo que vamos a iterar*/
                
                //Ve al siguiente elemento
                /*Ese es un iterador que es básicamente, yo ya acabe, ve al siguiente elemento*/
                cursor.continue();

            }
        }
        /*Ahora, si podemos recordar, a imprimirCitas, se le mandaba llamar cuando
        había un error, cuando editabamos una cita, pero no había una que mandara 
        llamar imprimir citas cuando el documento estuviera listo.
        Y como lo que estamos haciendo es al recargar, pos la queremos llamar cuando
        el documento esté listo....
        
        Una manera que se me ocurre es mandar llamar el ui.imprimirCitas()
        al momento de ya tener la base de datos creada y que todo esté saliendo bien

        */

    }

   textoHeading(resultado) {
    console.log(resultado);
        if(resultado > 0 ) {
            heading.textContent = 'Administra tus Citas '
        } else {
            heading.textContent = 'No hay Citas, comienza creando una'
        }
    }

   limpiarHTML() {
        while(contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
   }
}


const administrarCitas = new Citas();
//console.log(administrarCitas);
const ui = new UI(administrarCitas);

function nuevaCita(e) {
    e.preventDefault();

    const {mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

    // Validar
    if( mascota === '' || propietario === '' || telefono === '' || fecha === ''  || hora === '' || sintomas === '' ) {
        ui.imprimirAlerta('Todos los mensajes son Obligatorios', 'error')

        return;
    }

    if(editando) {
        // Estamos editando
        administrarCitas.editarCita( {...citaObj} );

        ui.imprimirAlerta('Guardado Correctamente');

        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

        editando = false;

    } else {
        // Nuevo Registrando

        // Generar un ID único
        citaObj.id = Date.now();
        
        // Añade la nueva cita
        administrarCitas.agregarCita({...citaObj});

        //Insertando en la base de datos de indexDB.
        const transaction = DB.transaction(['citas'], 'readwrite');

        //Habilitar el objectStore 
        const objectStore = transaction.objectStore('citas');

        objectStore.add(citaObj);
        //En caso que la transacción sea completa, lo lógico es imprimir la alerta que da informacion...
        transaction.oncomplete = function(){
             // Mostrar mensaje de que todo esta bien...
             ui.imprimirAlerta('Se agregó correctamente')
   
        }// Mostrar mensaje de que todo esta bien...
        //ui.imprimirAlerta('Se agregó correctamente')
   
    }


    // Imprimir el HTML de citas (administrarCitas esto ya no esta)
    ui.imprimirCitas();

    // Reinicia el objeto para evitar futuros problemas de validación
    reiniciarObjeto();

    // Reiniciar Formulario
    formulario.reset();

}

function reiniciarObjeto() {
    // Reiniciar el objeto
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}


function eliminarCita(id) {
    administrarCitas.eliminarCita(id);

    ui.imprimirCitas();
}

function cargarEdicion(cita) {

    const {mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    // Reiniciar el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    // Llenar los Inputs
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    editando = true;

}
/*Ya no le vamos a pasar las citas...

Por qué?

porque necesitamos ese arreglo como tal, 
*/