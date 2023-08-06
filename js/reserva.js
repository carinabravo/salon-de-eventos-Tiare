/***** FORMULARIO DE PAGO DE RESERVA *****/
const id_form_reservar = "formulario__reservar";

const form_reservar = document.getElementById(`${id_form_reservar}`);
const inputs = [...document.querySelectorAll(`#${id_form_reservar} input`)]; // Uso de Spread.

recuperarDatos();
recuperarReserva();

/** RegExp */
const expresiones = {
  nombre__dos: /^[a-zA-ZÀ-ÿ\s]{5,30}$/, // Letras y espacios, pueden llevar acentos.
  nombre__tres: /^[a-zA-ZÀ-ÿ\s]{5,30}$/, // Letras y espacios, pueden llevar acentos.
  dni: /^[\d]{1,3}\.?[\d]{3,3}\.?[\d]{3,3}$/, // Números del 0 al 9.
  correo__dos: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
  telefono__dos: /^\d.{10}$/, // Número de área más números.
  tarjeta: /^\d{13,18}$/, // Números de 13 a 18.
  mesAnio: /^(0[1-9]|1[0-2])\/(0[1-9]|1[1-9]|2[1-9])$/, // Número del mes/año.
  clave: /^\d{3,4}$/, // Números de 3 a 4.
  monto: /^\d{4,9}$/, // Números de 4 a 9.
};

const nombreElementos = [
  "nombre__dos",
  "nombre__tres",
  "dni",
  "correo__dos",
  "telefono__dos",
  "tarjeta",
  "mesAnio",
  "clave",
  "monto",
];

/** Indica si el campo fue validado */
const campos = {
  nombre__dos: undefined,
  nombre__tres: undefined,
  dni: undefined,
  correo__dos: undefined,
  telefono__dos: undefined,
  tarjeta: undefined,
  mesAnio: undefined,
  clave: undefined,
  monto: undefined,
};

/** Validación de formulario de reserva - (Resume todo el switch en una sola linea) */
const validarFormulario = (e) => {
  validarCampo(expresiones[e.target.name], e.target, e.target.name);
};

/** Validación de campos de formulario de reserva */
const validarCampo = (expresion, input, nombre) => {
  if (expresion == undefined) {
    campos[nombre] = true;
    return;
  }
  const campoInput = document.getElementById(`grupo__${nombre}`);
  const iconInput = document.querySelector(`#grupo__${nombre} i`);
  const parrafoError__dos = document.querySelector(
    `#grupo__${nombre} .formulario__input-error__dos`
  );

  /** Valida si la expresión regular es correcta o no */
  if (expresion.test(input.value)) {
    campoInput.classList.remove("formulario__grupo-incorrecto__dos");
    campoInput.classList.add("formulario__grupo-correcto__dos");

    iconInput.classList.add("fa-check-circle");
    iconInput.classList.remove("fa-times-circle");

    parrafoError__dos.classList.remove("formulario__input-error-activo__dos");

    campos[nombre] = true;
  } else {
    campoInput.classList.add("formulario__grupo-incorrecto__dos");
    campoInput.classList.remove("formulario__grupo-correcto__dos");

    iconInput.classList.remove("fa-check-circle");
    iconInput.classList.add("fa-times-circle");

    parrafoError__dos.classList.add("formulario__input-error-activo__dos");

    campos[nombre] = false;
  }
};

inputs.forEach((input) => {
  input.addEventListener("keyup", validarFormulario);
  input.addEventListener("blur", validarFormulario);
});

form_reservar.addEventListener("submit", (e) => {
  e.preventDefault();

  /** Valida el campo para todos los inputs que aún no fueron validados */
  inputs
    .filter(({ name }) => campos[name] == undefined) // desestructuración en parámetros.
    .forEach((input) => {
      const { name } = input; // desestructuración.
      validarCampo(expresiones[name], input, name);
    });

  if (
    campos.nombre__dos &&
    campos.nombre__tres &&
    campos.dni &&
    campos.correo__dos &&
    campos.telefono__dos &&
    campos.tarjeta &&
    campos.mesAnio &&
    campos.clave &&
    campos.monto
  ) {
    /** Implementa Storage y Json en formulario de reserva - Datos personales */
    const camposParaGuardar = {
      nombre: inputs.find((i) => i.id == "nombre__dos").value,
      correo: inputs.find((i) => i.id == "correo__dos").value,
      telefono: inputs.find((i) => i.id == "telefono__dos").value,
    };

    localStorage.setItem("form_reserva", JSON.stringify(camposParaGuardar));

    form_reservar.reset();

    Swal.fire({
      icon: "success",
      title: "Perfecto",
      text: "El formulario se envió correctamente!", //uso del sweet alert
    });
    /** Se elimina el local storage.*/
    localStorage.clear();
  } else {
    Swal.fire({
      icon: "error",
      text: "Debe completar el formulario correctamente!", //uso del sweet alert
    });
  }
});

/** Recupera datos del Local Storage */
function recuperarDatos() {
  const camposGuardados = JSON.parse(localStorage.getItem("form_reserva"));
  if (camposGuardados !== null) {
    inputs.find((i) => i.id == "nombre__dos").value = camposGuardados.nombre;
    inputs.find((i) => i.id == "telefono__dos").value =
      camposGuardados.telefono;
    inputs.find((i) => i.id == "correo__dos").value = camposGuardados.correo;
  } else {
    // Si no hay datos, no se hace nada.
  }
}

/** Recupera datos de reserva del formulario de cotización - del Local Storage*/
function recuperarReserva() {
  const camposGuardados = JSON.parse(localStorage.getItem("formulario"));
  if (camposGuardados !== null) {
    document.getElementById("monto").value = camposGuardados.reserva;
  } else {
    // si no hay datos de reserva
  }
}

/** Retorna limpieza de formulario de reserva */
function limpiarFormReservar() {
  document.getElementById("formulario__reservar").reset();

  /** Limpia campo e íconos del formulario de reserva */
  nombreElementos.forEach((campo) => {
    const campoInput = document.getElementById(`grupo__${campo}`);
    const iconInput = document.querySelector(`#grupo__${campo} i`);
    const parrafoError__dos = document.querySelector(
      `#grupo__${campo} .formulario__input-error__dos`
    );
    if (iconInput) {
      campoInput.classList.remove("formulario__grupo-incorrecto__dos");
      campoInput.classList.remove("formulario__grupo-correcto__dos");
      iconInput.classList.remove("fa-check-circle");
      iconInput.classList.remove("fa-times-circle");
      parrafoError__dos.classList.remove("formulario__input-error-activo__dos");
    }
  });
}
