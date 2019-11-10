/**
 * INICIALIZAR MODAL
 */
$('.modal').modal({
    onCloseEnd: function () {
        document.inscripcionPersonalizadaForm.reset();
        editar = false;
        codigoEdicion = null;
    },
    onOpenEnd: function () {
        document.inscripcionPersonalizadaForm.nombres.focus();
    }
});

/**
 * INICIALIZAR ICHECK
 */
$('.tipo input').iCheck({
    checkboxClass: 'icheckbox_flat-green',
    radioClass: 'iradio_flat-green'
});

/**
 * INICIALIZAR CARRUSEL
 */
var flickForm = $('.main-carousel').flickity({
    // options
    cellAlign: 'left',
    contain: true,
    draggable: false,
    prevNextButtons: false,
    pageDots: false
});
/**
 * INICIALIZAR SELECT DEL FORMULARIO REGISTRO INDIVIDUAL
 */
$('select').formSelect();



/**
 * ELEGIR TIPO DE INSCRIPCION [PERSONAL O DELEGACION]
 */
$(".tipo label").click(function () {

    if (document.querySelector("#delegqacionrdr").checked) {
        limpiarCajas();
        desabilitarCajas();
        $(".row.fila-estudiante > div.col").fadeOut(300);
        $(".row.fila-empresa > div.col:last-child").fadeOut(300);

        $("#contendor-delegacion").fadeIn();
        $("#inscripcionPersonalForm").fadeOut();
        M.toast({ html: 'La delegacion debe estar conformada por 10 alumnos como minimo.' });
        modalidad = "DELEGACION";
        document.querySelector("#modal1 .aviso").classList.remove("oculto");
    } else {
        $("#contendor-delegacion").fadeOut();
        $("#inscripcionPersonalForm").fadeIn();
        modalidad = "PERSONAL";
        contadorDelegacion = 0;
        datosDelegacion = [];
        editar = false;
        codigoEdicion = null;
        document.querySelector(".main-carousel .carousel-cell:nth-child(2) .contenedor-tabla").innerHTML = "";
        document.querySelector("#modal1 .aviso").classList.remove("oculto");
    }
    cambiarPaso(4);
    cambiarPaso(1);
});

/**
 * PASAR AL PASO 2
 * =====================================================================
 */
document.inscripcionPersonalForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (modalidad != "PERSONAL") {
        if (contadorDelegacion >= 1) {
            crearFilas();
            flickForm.flickity('select', 1);
            cambiarPaso(2);
        } else {
            M.toast({ html: 'La delegacion debe estar conformada por 10 alumnos como minimo.' });
        }
    } else {
        if (eval(this.perfil.value) != 0) {
            cambiarPaso(2);
            crearFila(eval(this.perfil.value));
            flickForm.flickity('select', 1);
        } else {
            M.toast({ html: 'Seleccione un perfil valido!' });
        }
    }
}, false);

/**
 * HABILITAR CAMPOS PARA INSCRIPCION PERSONAL
 * ==========================================================================
 */
document.inscripcionPersonalForm.perfil.addEventListener("change", function () {
    let f = document.inscripcionPersonalForm;
    switch (eval(this.value)) {
        case 1:
            f.carnet.setAttribute("required", "");
            f.universidad.setAttribute("required", "");
            f.empresa.removeAttribute("required");
            $(".row.fila-estudiante > div.col").fadeIn(300);
            $(".row.fila-empresa > div.col:last-child").fadeOut(300, () => { document.inscripcionPersonalForm.nombres.focus(); });

            break;
        case 2:
            f.carnet.removeAttribute("required");
            f.universidad.removeAttribute("required");
            f.empresa.setAttribute("required", "");
            $(".row.fila-empresa > div.col:last-child").fadeIn(300);
            $(".row.fila-estudiante > div.col").fadeOut(300, () => { document.inscripcionPersonalForm.nombres.focus(); });
            break;
    }
    habilitarCajas();
}, false);
/**
 * RETROCEDER AL PASO 1 INSCRIPCION PERSONAL
 */
document.getElementById("btn-atras-paso2").addEventListener("click", function () {
    let tabla = document.querySelector(".main-carousel .carousel-cell:nth-child(2) .contenedor-tabla");
    flickForm.flickity('select', 0);
    tabla.innerHTML = "";
    cambiarPaso(4);
});
/**
 * RETROCEDER AL PASO 2 INSCRIPCION PERSONAL
 */
document.getElementById("btn-atras-paso3").addEventListener("click", function () {
    flickForm.flickity('select', 1);
    cambiarPaso(2);
    validacionForm.reset();
});

/**
 * PASAR AL PASO 3
 */
document.getElementById("btn-irPaso3").addEventListener("click", function () {
    flickForm.flickity('select', 2);
    cambiarPaso(3);
});


/**
 * Delegacion
 * ========================================
 */

var contadorDelegacion,
    datosDelegacion,
    editar,
    codigoEdicion,
    modalidad;//PERSONAL, DELEGACION

contadorDelegacion = 0;
datosDelegacion = [];
editar = false;
codigoEdicion = null;
modalidad = "PERSONAL";

/**
 * Abrir modal delegacion
 */
document.getElementById("btn-agregar-delegacion").addEventListener("click", function () {
    let modal = document.querySelector("#modal1 .aviso");
    if (contadorDelegacion >= 1) {
        modal.classList.add("oculto");
    } else {
        modal.classList.remove("oculto");
    }
    $('.modal').modal('open');
});

/**
 * GUARDAR DATOS DE INSCRIPCION PERSOPNALIZADA EN LOCAL
 */
document.inscripcionPersonalizadaForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let tarjetas = document.querySelector("#contendor-delegacion .cartas"),
        f = document.inscripcionPersonalizadaForm;
    if (editar) {
        datosDelegacion.forEach(function (elemento, index) {
            if (elemento.codigo == codigoEdicion) {
                elemento.apellidos = f.apellidos.value;
                elemento.nombres = f.nombres.value;
                elemento.dni = f.dni.value;
                elemento.correo = f.correo.value;
                elemento.carnet = f.carnet.value;
                elemento.universidad = f.universidad.value;
                elemento.carrera = f.carrera.value;
                elemento.celular = f.celular.value;
                document.querySelector(".cartas .carta[data-index='" + codigoEdicion + "'] .head span").innerHTML = f.apellidos.value.concat(" ", f.nombres.value);
            }
        });
        cerrarModal();
        f.reset();
        editar = false;
        codigoEdicion = null;

    } else {
        contadorDelegacion++;
        tarjetas.innerHTML += agregarCarta(f.apellidos.value.concat(" ", f.nombres.value), contadorDelegacion);
        agregarDatos();
    }
    cerrarModal();
    f.reset();
});

function agregarDatos() {
    let f = document.inscripcionPersonalizadaForm;
    datosDelegacion.push(
        {
            codigo: contadorDelegacion,
            apellidos: f.apellidos.value,
            nombres: f.nombres.value,
            dni: f.dni.value,
            correo: f.correo.value,
            carnet: f.carnet.value,
            universidad: f.universidad.value,
            carrera: f.carrera.value,
            celular: f.celular.value,
            tipo: contadorDelegacion <= 1 ? 'DELEGADO' : 'ESTUDIANTE'
        }
    );
}

function cerrarModal() {
    $('.modal').modal('close');
}

function deleteCarta(codigo) {
    let padre = document.querySelector("#contendor-delegacion .cartas");
    let carta = padre.querySelector(".carta[data-index='" + codigo + "']");
    padre.removeChild(carta);
    deleteDatos(codigo);
    contadorDelegacion--;
}
function deleteDatos(codigo) {
    datosDelegacion.splice(eval(codigo - 1), 1);
}
function deleteAlldelegacion() {
    let respuesta = window.confirm("¿Quieres eliminar todos los datos?");
    if (respuesta) {
        contadorDelegacion = 0;
        datosDelegacion = [];
        document.querySelector("#contendor-delegacion .cartas").innerHTML = "";
    }
}
function editarDelegacion(codigo) {
    let f = document.inscripcionPersonalizadaForm;
    f.apellidos.value = datosDelegacion[eval(codigo - 1)].apellidos;
    f.nombres.value = datosDelegacion[eval(codigo - 1)].nombres;
    f.correo.value = datosDelegacion[eval(codigo - 1)].correo;
    f.dni.value = datosDelegacion[eval(codigo - 1)].dni;
    f.universidad.value = datosDelegacion[eval(codigo - 1)].universidad;
    f.carnet.value = datosDelegacion[eval(codigo - 1)].carnet;
    f.carrera.value = datosDelegacion[eval(codigo - 1)].carrera;
    f.celular.value = datosDelegacion[eval(codigo - 1)].celular;
    editar = true;
    codigoEdicion = codigo;
    agregarClaseActive();
    $('.modal').modal('open');
}
function agregarCarta(nombres, codigo) {
    let html = "";
    html += `<div class='carta z-depth-3' data-index='${codigo}'>`;
    html += `<div class='head'><span>${nombres}</span></div>`;
    html += "<div class='body'>";
    html += `<button class='black-text btn waves-effect' style='background: transparent;' onclick='deleteCarta(${codigo})' ><span class='fas fa-trash fa-2x'></span></button>`;
    html += "&nbsp;&nbsp;";
    html += `<button class='black-text btn waves-effect' style='background: transparent;' onclick='editarDelegacion(${codigo})' ><span class='fas fa-edit fa-2x'></span></button>`;
    html += "</div>";
    html += "</div>";
    return html;
}
function cambiarPaso(paso = 1) {
    let paso1,
        paso2,
        pase3;

    paso1 = document.querySelector(".pasos .uno");
    paso2 = document.querySelector(".pasos .dos");
    paso3 = document.querySelector(".pasos .tres");
    switch (paso) {
        case 1:
            paso1.classList.add("active");
            break;
        case 2:
            paso2.classList.add("active");
            paso1.classList.remove("active");
            paso1.classList.add("echo");

            paso3.classList.remove("active");
            paso2.classList.remove("echo");
            break;
        case 3:
            paso3.classList.add("active");
            paso2.classList.remove("active");
            paso2.classList.add("echo");
            document.validacionForm.operacion.focus();
            break;
        default:
            paso1.classList.remove("active");
            paso2.classList.remove("active");
            paso3.classList.remove("active");
            paso1.classList.remove("echo");
            paso2.classList.remove("echo");
            break;
    }
}
function crearFila(perfil = 1) {
    let html,
        f,
        tabla;
    tabla = document.querySelector(".main-carousel .carousel-cell:nth-child(2) .contenedor-tabla");
    f = document.inscripcionPersonalForm;
    html = "<table class='display' id='t-verificacion' >";
    switch (perfil) {
        case 1:
            html += "<thead><tr><th>Nro</th><th>Nombres y Apellidos</th><th>Tipo</th><th>Dni</th><th>Celular</th><th>Universidad</th><th>Carrera</th><th>Correo</th></tr></thead>";
            html += "<tbody>";
            html += "<tr>";
            html += "<td>1</td>";
            html += `<td>${f.nombres.value} ${f.apellidos.value}</td>`;
            if (eval(f.perfil.value) == 1) {
                html += `<td>ESTUDIANTE</td>`;
            } else {
                html += `<td>PROFESIONAL</td>`;
            }
            html += `<td>${f.dni.value}</td>`;
            html += `<td>${f.celular.value}</td>`;
            html += `<td>${f.universidad.value}</td>`;
            html += `<td>${f.carrera.value}</td>`;
            html += `<td>${f.correo.value}</td>`;
            html += "</tr>";
            html += "</tbody>";
            break;
        case 2:
            html += "<thead><tr><th>Nro</th><th>Nombres y Apellidos</th><th>Tipo</th><th>Dni</th><th>Celular</th><th>Empresa</th><th>Carrera</th><th>Correo</th></tr></thead>";
            html += "<tbody>";
            html += "<tr>";
            html += "<td>1</td>";
            html += `<td>${f.nombres.value} ${f.apellidos.value}</td>`;
            if (eval(f.perfil.value) == 1) {
                html += `<td>ESTUDIANTE</td>`;
            } else {
                html += `<td>PROFESIONAL</td>`;
            }
            html += `<td>${f.dni.value}</td>`;
            html += `<td>${f.celular.value}</td>`;
            html += `<td>${f.empresa.value}</td>`;
            html += `<td>${f.carrera.value}</td>`;
            html += `<td>${f.correo.value}</td>`;
            html += "</tr>";
            html += "</tbody>";
            break;
    }
    html += "</table>";
    tabla.innerHTML = html;
    $("#t-verificacion").DataTable({
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.10.19/i18n/Spanish.json"
        }
    });

}

function crearFilas() {
    let html,
        tabla;
    tabla = document.querySelector(".main-carousel .carousel-cell:nth-child(2) .contenedor-tabla");
    html = "<table class='display' id='t-verificacion' >";
    html += "<thead><tr><th>Nro</th><th>Nombres y Apellidos</th><th>Tipo</th><th>Dni</th><th>Celular</th><th>Universidad</th><th>Carrera</th><th>Correo</th></tr></thead>";
    html += "<tbody>";
    datosDelegacion.forEach(function (element, index) {
        html += "<tr>";
        html += `<td>${index + 1}</td>`;
        html += `<td>${element.nombres} ${element.apellidos}</td>`;
        html += `<td>${index == 0 ? 'DELEGADO' : 'ESTUDIANTE'}</td>`;
        html += `<td>${element.dni}</td>`;
        html += `<td>${element.celular}</td>`;
        html += `<td>${element.universidad}</td>`;
        html += `<td>${element.carrera}</td>`;
        html += `<td>${element.correo}</td>`;
        html += "</tr>";
    });
    html += "</tbody>";
    html += "</table>";
    tabla.innerHTML = html;
    $("#t-verificacion").DataTable({
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.10.19/i18n/Spanish.json"
        }
    });
}

function habilitarCajas() {
    let f = document.inscripcionPersonalForm;
    f.nombres.removeAttribute("disabled");
    f.apellidos.removeAttribute("disabled");
    f.perfil.removeAttribute("disabled");
    f.dni.removeAttribute("disabled");
    f.celular.removeAttribute("disabled");
    f.carrera.removeAttribute("disabled");
    f.correo.removeAttribute("disabled");
}
function desabilitarCajas() {

    let f = document.inscripcionPersonalForm;
    f.nombres.setAttribute("disabled", "");
    f.apellidos.setAttribute("disabled", "");
    f.dni.setAttribute("disabled", "");
    f.celular.setAttribute("disabled", "");
    f.carrera.setAttribute("disabled", "");
    f.correo.setAttribute("disabled", "");
}
function limpiarCajas() {

    let f = document.inscripcionPersonalForm;
    f.nombres.value = "";
    f.apellidos.value = "";
    f.dni.value = "";
    f.celular.value = "";
    f.carrera.value = "";
    f.correo.value = "";
    f.perfil.value = "0";
}
function agregarClaseActive() {
    $("#inscripcionPersonalizadaForm label").addClass("active");
}
/**
 * INICIALIZAR AUTOCOMPLETADO DE UNIVERSIDADES
 */
$('input.autocomplete').autocomplete({
    data: {
        "Universidad Nacional Mayor de San Marcos": null,
        "Universidad Nacional de San Cristóbal de Huamanga": null,
        "Universidad Nacional de San Antonio Abad del Cusco": null,
        "Universidad Nacional de Trujillo": null,
        "Universidad Nacional de San Agustín de Arequipa": null,
        "Universidad Nacional de Ingeniería": null,
        "Universidad Nacional Agraria La Molina": null,
        "Universidad Nacional San Luis Gonzaga": null,
        "Universidad Nacional del Centro del Perú": null,
        "Universidad Nacional de la Amazonía Peruana": null,
        "Universidad Nacional del Altiplano": null,
        "Universidad Nacional de Piura": null,
        "Universidad Nacional de Cajamarca": null,
        "Universidad Nacional Federico Villarreal": null,
        "Universidad Nacional Agraria de la Selva": null,
        "Universidad Nacional Hermilio Valdizán de Huánuco": null,
        "Universidad Nacional de Educación Enrique Guzmán y Valle": null,
        "Universidad Nacional Daniel Alcides Carrión": null,
        "Universidad Nacional del Callao": null,
        "Universidad Nacional José Faustino Sánchez Carrión": null,
        "Universidad Nacional Pedro Ruiz Gallo": null,
        "Universidad Nacional Jorge Basadre Grohmann": null,
        "Universidad Nacional Santiago Antúnez de Mayolo": null,
        "Universidad Nacional de San Martín": null,
        "Universidad Nacional de Ucayali": null,
        "Universidad Nacional de Tumbes": null,
        "Universidad Nacional del Santa": null,
        "Universidad Nacional de Huancavelica": null,
        "Universidad Nacional Amazónica de Madre de Dios": null,
        "Universidad Nacional Toribio Rodríguez de Mendoza de Amazonas": null,
        "Universidad Nacional Micaela Bastidas de Apurímac": null,
        "Universidad Nacional Intercultural de la Amazonía": null,
        "Universidad Nacional Tecnológica de Lima Sur (*1)": null,
        "Universidad Nacional José María Arguedas": null,
        "Universidad Nacional de Moquegua": null,
        "Universidad Nacional de Juliaca": null,
        "Universidad Nacional de Jaén": null,
        "Universidad Nacional de Frontera": null,
        "Universidad Nacional Autónoma de Chota": null,
        "Universidad Nacional de Barranca": null,
        "Universidad Nacional de Cañete": null,
        "Universidad Nacional Intercultural Fabiola Salazar Leguía de Bagua": null,
        "Universidad Nacional Intercultural de la Selva Central Juan Santos Atahualpa": null,
        "Universidad Nacional Intercultural de Quillabamba": null,
        "Universidad Nacional Autónoma de Alto Amazonas": null,
        "Universidad Nacional Autónoma Altoandina de Tarma": null,
        "Universidad Nacional Autónoma de Huanta": null,
        "Universidad Nacional Tecnológica de San Juan de Lurigancho": null,
        "Universidad Autónoma Municipal de Los Olivos": null,
        "Universidad Nacional Autónoma de Tayacaja Daniel Hernández Morillo": null,
        "Universidad Nacional Ciro Alegría": null,
        "Pontificia Universidad Católica del Perú": null,
        "Universidad Peruana Cayetano Heredia": null,
        "Universidad Católica de Santa María": null,
        "Universidad del Pacífico": null,
        "Universidad de Lima": null,
        "Universidad de San Martín de Porres": null,
        "Universidad Femenina del Sagrado Corazón": null,
        "Universidad Inca Garcilaso de la Vega": null,
        "Universidad de Piura": null,
        "Universidad Ricardo Palma": null,
        "Universidad Andina Néstor Cáceres Velásquez": null,
        "Universidad Peruana Los Andes": null,
        "Universidad Peruana Unión": null,
        "Universidad Andina del Cusco": null,
        "Universidad Tecnológica de los Andes": null,
        "Universidad Privada de Tacna": null,
        "Universidad Particular de Chiclayo": null,
        "Universidad San Pedro (*1)": null,
        "Universidad Privada Antenor Orrego": null,
        "Universidad de Huánuco": null,
        "Universidad José Carlos Mariátegui (*2)": null,
        "Universidad Marcelino Champagnat": null,
        "Universidad Científica del Perú (*3)": null,
        "Universidad César Vallejo S.A.C.": null,
        "Universidad Católica Los Ángeles de Chimbote (*4)": null,
        "Universidad Peruana de Ciencias Aplicadas S.A.C.": null,
        "Universidad Privada del Norte S.A.C.": null,
        "Universidad San Ignacio de Loyola S.A.": null,
        "Universidad Alas Peruanas": null,
        "Universidad Privada Norbert Wiener": null,
        "Universidad Católica San Pablo": null,
        "Universidad Privada de Ica S.A. (*5)": null,
        "Universidad Privada San Juan Bautista S.A.C. (*6)": null,
        "Universidad Tecnológica del Perú": null,
        "Universidad Continental S.A.C. (*7)": null,
        "Universidad Científica del Sur S.A.C.": null,
        "Universidad Católica Santo Toribio de Mogrovejo": null,
        "Universidad Privada Antonio Guillermo Urrelo": null,
        "Universidad Católica Sedes Sapientiae": null,
        "Universidad Señor de Sipán": null,
        "Universidad Católica de Trujillo Benedicto XVI (*8)": null,
        "Universidad Peruana de las Américas": null,
        "Universidad ESAN": null,
        "Universidad Antonio Ruiz de Montoya": null,
        "Universidad Peruana de Ciencias e Informática": null,
        "Universidad para el Desarrollo Andino": null,
        "Universidad Privada Telesup": null,
        "Universidad Sergio Bernales S.A.": null,
        "Universidad Privada de Pucallpa S.A.C.": null,
        "Universidad Autónoma de Ica S.A.C. (*9)": null,
        "Universidad Privada de Trujillo": null,
        "Universidad Privada San Carlos": null,
        "Universidad Peruana Simón Bolivar": null,
        "Universidad Peruana de Integración Global S.A.C.": null,
        "Universidad Peruana del Oriente S.A.C.": null,
        "Universidad Autónoma del Perú": null,
        "Universidad de Ciencias y Humanidades": null,
        "Universidad Privada Juan Mejía Baca": null,
        "Universidad Jaime Bausate y Meza": null,
        "Universidad Peruana del Centro": null,
        "Universidad Privada Arzobispo Loayza S.A.C": null,
        "Universidad Le Cordon Bleu S.A.C.": null,
        "Universidad Privada de Huancayo Franklin Roosevelt": null,
        "Universidad de Lambayeque S.A.C.": null,
        "Universidad de Ciencias y Artes de América Latina S.A.C.": null,
        "Universidad Peruana de Arte Orval S.A.C.": null,
        "Universidad Privada de la Selva Peruana (*10)": null,
        "Universidad Ciencias de la Salud": null,
        "Universidad de Ayacucho Federico Froebel": null,
        "Universidad Peruana de Investigación y Negocios S.A.C.": null,
        "Universidad Peruana Austral del Cusco": null,
        "Universidad Autónoma San Francisco": null,
        "Universidad San Andrés": null,
        "Universidad Interamericana para el Desarrollo": null,
        "Universidad Privada Juan Pablo II": null,
        "Universidad Privada Leonardo Da Vinci S.A.C. (*11)": null,
        "Universidad de Ingeniería y Tecnología": null,
        "Universidad La Salle": null,
        "Universidad Latinoamericana CIMA": null,
        "Universidad Privada Autónoma del Sur": null,
        "Universidad María Auxiliadora": null,
        "Universidad Politécnica Amazónica S.A.C.": null,
        "Universidad Santo Domingo de Guzmán": null,
        "Universidad Marítima del Perú": null,
        "Universidad Privada Líder Peruana": null,
        "Universidad Privada Peruano Alemana S.AC.": null,
        "Universidad Global del Cusco": null,
        "Universidad Santo Tomás de Aquino de Ciencia e Integración": null,
        "Universidad Privada SISE": null,
        "Universidad Seminario Evangélico de Lima (*12)": null,
        "Universidad Seminario Bíblico Andino (*12)": null,
        "Universidad Católica San José": null
    },
    limit: 5
});

/**
 * ENVIAR DATOS INSCRIPCION PERSONAL
 */
function enviarDatosPersonal() {
    let f = document.forms.namedItem("inscripcionPersonalForm"),
        v = document.forms.namedItem("validacionForm"),
        data = new FormData(v);
    switch (eval(f.perfil.value)) {
        case 1:
            data.append("perfil", f.perfil.value);
            data.append("apellidos", f.apellidos.value);
            data.append("nombres", f.nombres.value);
            data.append("correo", f.correo.value);
            data.append("dni", f.dni.value);
            data.append("celular", f.celular.value);
            data.append("universidad", f.universidad.value);
            data.append("carnet", f.carnet.value);
            data.append("carrera", f.cerrera.value);
            ajaxPost("",data,
            function(response){
                
            });
            break;
        case 2:
            break;
    }
}

function ajaxPost(url, datos, callback) {
    let req = new XMLHttpRequest();
    req.open("POST", url, true);
    req.addEventListener("load", function () {
        if (req.status == 200) {
            // Llamada ala función callback pasándole la respuesta
            callback(req.response);
        } else {
           error(req.response);
        }
    });
    req.addEventListener("error", function () {
        console.error("Error de red");
    });
    req.send(datos);
}

