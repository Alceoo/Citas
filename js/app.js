//ELIMINAR LAS CITAS
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
    });/*Poner así el evento al crear la base de datos y lo que sigue nos provocó un mm no error, pero
    digamos que no es un resultado esperado, lo que está pasando es que claro, esto se crea, agarra, arroja, imprime
    de la base datos al html con el evento de cuando el documento esté listo, te lo enseño, 
    pero esto lo que hace es cargar los cambios, sólo al momento de recargar la página...*/

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
    /*editarCita(citaActualizada) {
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita)
    }*/

    /*eliminarCita(id) {
        this.citas = this.citas.filter( cita => cita.id !== id);
    }*/
}

class UI {

    constructor({citas}) {
    /*Lo podríamos extraer así o desde arriba...*/ 
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
       
        const fnTextoHeading = this.textoHeading;
        /*Aquí estamos solucionando el error
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
/*A ver, aquí lo que está pasando es, 
creamos un btn de eliminar, después lo que hacemos es
mandar llamar una funcion de eliminarCita al hacer un click en el btn de eliminar,
en esta función le pasaremos un parámetro, el valor de este parámetro 
será  lo que le pongamos al mandar llamar la función, o sea aquí en el mismo evento
pero, qué queremos mandar llamar?

Claro que lo que queremos mandar llamar es el id, pero, ¿Por qué el id?

De alguna manera necesitmos identificar al producto al que le hemos dado click, claro
que para eso antes debemos de extraer el valor del id del objeto que lo tiene...

En este punto ya al tener el valor identificado de lo que le estamos dando click
lo que necesitamos es...
En esa función de eliminar cita, le pasamos la instancia de la clase, esto para hacerlo 
orientado a objetos básicamente, que es la mejor manera...

Ahora, mandamos llamar la instancia y creamos el nombre del método que vamos a usar, 
este método va a ser eliminarCita y le pasamos el id.

En este punto ya debimos de haberle puesto el valor del id que extrajimos anteriormente, 
ya debimos de haberle puesto ese id a nuestra cita que manda llamar el evento.

Significa que estamos mnadando el id de cada cita desde nuestro btnEliminar

Ahora, en la clase, en el método igual le vamos a poner un parámetro,
EL VALOR DE ESE PARÁMETRO DE NUESTRO MÉTODO EN LA CLASE YA ESTÁ 
DEFINIDO, ESE VALOR ES EL OBJETO, PERO, POR QUÉ ES EL OBJETO?
COMO TAL NO ES EL OBJETO, SINO EL ARREGLO, EL ARREGLO DE ADMINISTRARCITAS
esto pasa o se asigna al momento que elejimos con qué datos vamos a trabajar
en la misma clase, porque allí estamos haciendo una extracción del arreglo de citas
, nosotros le decimos que, a ese arreglo lo filtre, y ahí viene la comparación.
le decimos, le ponemos un parámetro porque todo método para array necesita
un parámetro ya que son arrow functions y ese tomará el lugar de cada
elemento en el arrelgo(cada objeto o cita).

NO, ya vi una cosa, el valor del id(parámetro que le colocamos a la clase)
es como igualarlo al id de abajo de la función, de esta manera es como se 
comunica el valor del id de cada cita con el parámetro del método de la clase de citas, 
esto es sencillamente bueno la vdd...

Le decimos, traeme todos, excepto el que acabo de presionar, pero esto igual es una fomra
de comparar y hacer excepciones...

(veamos el video de porque funciona así)

Pues vaya, claro que le estamos pasando el id de cada cita por cada iteración
o sea, es como empaquetar la información por así decirlo.

A ver, es básicamente, traeme todas excepto las que sean iguales al id que te estemos pasando
del objeto, es eso.

Después en la función, no en la clase, le decimos que nos vuelva a imprimir el html...
---------------------------------

Ahora, esto como lo haríamos para pasarlo a una base de datos?

Debemos tener en cuenta varias cosas....

1.La base de datos trabaja sobre y con informacion
2.La información que maneja con las tablas se puede entender como un arreglo al convertirlo
con los métodos que tenemos
3.Entonces la base de datos toma el lugar de un arreglo básicamente...
4.Toma el lugar del arreglo de citas...

Premisa:
        En mi programa lo que quiero en este momento es eliminar, eliminamos por el id, 
        para ello necesitamos varias cosas, la función de eliminar citas después del evento
        se queda.
                //FUNCION ELIMIANRCITAS SE VUELVE ESTÁTICA...
        
        La función eliminarCitas sigue tomando el id(como forma de extraer ese valor de cada cita)
        Se le coloca un parámetro, que pss podría ser el mismo que el id.
        Pero lo siguiente que sería instanciarlo con la clase citas ya no.
        ¿Qué podría hacer para quitar esa instancia de citas?
        EN primera, el código que se queda es el ui.imprimirCitas, ya que necesitaremos
        imprimirCitas para cuando se complete la transaccion...


        quizás un objectStore como se acostumbra, se accede a la base de datos
        con los métodos, le pasamos lo que queremos eliminar quizás y después viene lo demás.

        Pero claro, para esto tenemos que hacer una transición, 
        
        const transaction = DB.transaction(['citas'], 'readwrite');

        //Creamos el objectStore.
        const objectStore = transaction.objectStore('citas');

        //Eliminar un objeto por completo de la base de datos
        objectStore.delete(id);

        ui.imprimirCitas();

        Pero aún así, esto no remplaza en lo absoluto a la clase
        de CITAS.
*/


                // Añade un botón de editar...
                const btnEditar = document.createElement('button');
            
/*Esta variable se crea porque al poner sólo el cursor.value que es lo que suplantó
 a nuestro arreglo de citas al hacer la iteracion, me arroja al editar una cita habiendo más,
 me arroja el último aunque le haya dado al primero, o sea me regresa el editado con la última cita, no con
 la primera que fue la que puse, LO QUE PENSARÍA A INICIOS DE ESTO SERÍA QUE DE ALGUNA MANERA TIENE 
 QUE RECONOCER A LO QUE LE ESTOY DANDO CLICK, PERO EN ESTE CASO YA SE SABE POR EL VALUE Y EL ID, LA
 VERIFICACION YA ESTÁ ARRIBA.
 Ahora, entoncces le paso una variable que guarde ese valor, la creo con const para que no sea dinámica
 no pueda cambiar y se quede con el valor que yo le he colocado después de la validacion del id, esta misma
 variable no puede ser la misma que la que ya he creado arriba, si lo intentamos nos va a llenar
 todos los campos, pero con undefined, por lo que tenemos que de nueva cuenta, ponerle ahora el valor
 de cursor.value que ya tenemos arriba y lo igualamos a cita...*/
                const cita = cursor.value; 

                btnEditar.onclick = () => cargarEdicion(cita);
            /*Este cargar edicion se activa al momento de hacer click, después sigue
            la función que carga la edicion como
            tal, en esete punto reiniciams el objeto, llenamos los inputs con el valor que el usuario
            ya haya colocado y cambiamos la variable editando que está en false en global y 
            la cambiamos a true... 
            También le cambiamos el mensaje del boton, le ponemos guardar cambios para que vuelva
            a agregar la cita básicamente...
            
            Es por eso que le colocamos una validacion, si editando es igual a verdadero, o sea
            si ya presionó este boton, mandamos llamar la instancia administrarCitas, ya que esta tiene
            la información en el arreglo que vamos a utilizar y el método que vamos a usar(crear) 
            que es editarCita...
            
            En este editarCita le pasamos un parámetro el cuál nos permitirá poner un argumento 
            al mandar llamar esto en la validacion, accedemos al arreglo, iteramos sobre este mismo y
            se lo asignamos.
            Decimos, si el id de la cita, es igual a la citaActualizada.id(que esto es el parámetro que le acabamos
            de agregar, el argumento que tomará el lugar de este será el objeto de citaObj
            que es el que está recibiendo todos los datos que estoy llenando...)
            Al decir, si este es igual a este, entonces...
            Pasamos a otra validacion y decimos, si citaAcutalizada.id que es el objeto de citaObj 
            entonces, haz la otra parte que no sé que significa...pero bueno ahorita la veo(
                ( cita => cita.id === citaActualizada.id ? citaActualizada : cita)
            )

            Entonces en teoría, en ese punto de estar editando en la validacion de editando es true.
            ese objeto que le pasamos ya es el objeto actualizado.

            Por lo que le colocamos ya, la transicion, accedemos a citas, los permisos
            creamos el objectStore y hacemos referencia a citas...

            Entonces, le ponemos objectStore.put(), este put es lo que nos permite editar un registro
            y le pasamos citaObj, que es el objeto ya actualizado.

            Ahora, le ponemos transaction.oncomplete
            este si podemos recordar es, si todo salió bien, entonces haz esto básicamente

                
                ui.imprimirAlerta('Guardado Correctamente');
                    
                formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';
                    
                editando = false;

            Y en caso de error, de que realemnte no se esté editando lo que tendríamos que hacer sería ammm
            
            Ahora, nos sigue soltando un error, este se debe al iterador, a que antes
            estabamos iterando sobre citas con el forEach, ya que citas, tomaba el lugar del arreglo
            pero en este caso el que toma el lugar del arrelgo va a ser 
            el e.target.result, que es lo mismo al cursor.value, entonces sólo lo
            cambiamos 

            Pero ahora, al hacer esto, al colocarle esto y darle en editar a una cita cuando hay varias
            lo que sucede  es que me coloca la última cita, esto se debe a que ese cursor.value es dinámico, cada
            iteracion va a ir cambiando.

            Lo que podemos hacer es crear una variable para cursor.value y después pasarle esa variable en lugar
            de el cursor.value, es por eso que es bueno guardar valores o demás en una variable y no colocarlos
            directamente...*/
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

        /*Yo creo que sería por aquí, al editar lo tendríamos que mandar primero
        esto a la base de datos y después imprimir en el html
        
        Se coloca aquí
        ...*/

        //Edita en indexDB
        const transaction = DB. transaction(['citas'], 'readwrite');
        const objectStore = transaction.objectStore('citas');

        objectStore.put(citaObj);

        transaction.oncomplete = function(){
            console.log('se completo');
       
            ui.imprimirAlerta('Guardado Correctamente');

            formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';
    
            editando = false;
        }
        transaction.onerror = function(){
            console.log('la cago maestro');
        }
       

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
   
             reiniciarObjeto();

             formulario.reset();
        }// Mostrar mensaje de que todo esta bien...
        //ui.imprimirAlerta('Se agregó correctamente')
   
    }


/*
    //Imprimir el HTML de citas (administrarCitas esto ya no esta)
    ui.imprimirCitas();

    // Reinicia el objeto para evitar futuros problemas de validación
    reiniciarObjeto();

    // Reiniciar Formulario
    formulario.reset();*/

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
    //Crear la transición, darle los permisos y hacer referencia a la DB
    const transaction = DB.transaction(['citas'], 'readwrite');
    const objectStore = transaction.objectStore('citas');

    //Eliminar desde el id
    objectStore.delete(id);

    transaction.oncomplete = function(){
        console.log(`eliminando la cita ${id}`);
        ui.imprimirCitas();
    }
    transaction.onerror = function(){
        console.log('No se pudo borrar esta wea');
    }
    
}

function cargarEdicion(cita) {
/*Aquí supongo que lo que tendría que hacer sería algo parecido a lo anterior...
lo que podría ser igual, crear una variable y todo eso, cambiar eso y aquello*/
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
