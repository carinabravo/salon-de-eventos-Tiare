/***** FORMULARIO DE CONTACTO *****/

const id_form_contactanos = "formulario__contactanos";

const form_contactanos = document.getElementById(`${id_form_contactanos}`);
const inputs = [
  ...document.querySelectorAll(`#${id_form_contactanos} input,textarea`),
]; // Uso de Spread - (transforma de nodeList a arrays, ya que nodeList no tiene foreach).

recuperarDatos();

/** RegExp */
const expresiones = {
  nombre: /^[a-zA-ZÀ-ÿ\s]{5,30}$/, // Letras y espacios, pueden llevar acentos.
  correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
  telefono: /^\d.{10}$/, // Número de área más números.
  consulta: /^[a-zA-ZÀ-ÿ\s]{10,200}$/, // Letras y espacios, pueden llevar acentos.
};

const nombreElementos = ["nombre", "correo", "telefono", "consulta"];

/** Indica si el campo fue validado */
const campos = {
  nombre: undefined,
  correo: undefined,
  telefono: undefined,
  consulta: undefined,
};

/** Validación de formulario de contacto - (Resume todo el switch en una sola linea) */
const validarFormulario = (e) => {
  validarCampo(expresiones[e.target.name], e.target, e.target.name);
};

/** Validación de campos de formulario */
const validarCampo = (expresion, input, campo) => {
  if (expresion == undefined) {
    campos[campo] = true;
    return;
  }
  const campoInput = document.getElementById(`grupo__${campo}`);
  const iconInput = document.querySelector(`#grupo__${campo} i`);
  const parrafoError = document.querySelector(
    `#grupo__${campo} .formulario__input-error`
  );

  /** Valida si la expresión regular es correcta o no */
  if (expresion.test(input.value)) {
    campoInput.classList.remove("formulario__grupo-incorrecto");
    campoInput.classList.add("formulario__grupo-correcto");

    iconInput.classList.add("fa-check-circle");
    iconInput.classList.remove("fa-times-circle");

    parrafoError.classList.remove("formulario__input-error-activo");

    campos[campo] = true;
  } else {
    campoInput.classList.add("formulario__grupo-incorrecto");
    campoInput.classList.remove("formulario__grupo-correcto");

    iconInput.classList.remove("fa-check-circle");
    iconInput.classList.add("fa-times-circle");

    parrafoError.classList.add("formulario__input-error-activo");

    campos[campo] = false;
  }
};

inputs.forEach((input) => {
  input.addEventListener("keyup", validarFormulario);
  input.addEventListener("blur", validarFormulario);
});

form_contactanos.addEventListener("submit", (e) => {
  e.preventDefault();

  /** Valida el campo para todos los inputs que aún no fueron validados */
  inputs
    .filter((name) => campos[name] == undefined) // desestructuración en parámetros.
    .forEach((input) => {
      const { name } = input; // desestructuración.
      validarCampo(expresiones[name], input, name);
    });

  /** Implementa Storage y Json en formulario de contacto - datos personales */
  const camposParaGuardar = {
    nombre: inputs.find((i) => i.id == "nombre").value,
    correo: inputs.find((i) => i.id == "correo").value,
    telefono: inputs.find((i) => i.id == "telefono").value,
  };

  localStorage.setItem("form_contactanos", JSON.stringify(camposParaGuardar));

  if (campos.nombre && campos.telefono && campos.correo && campos.consulta) {
    form_contactanos.reset();

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
      title: "Error",
      text: "Debe completar el formulario correctamente!", //uso del sweet alert
    });
  }
});

/** Recupera datos del Local Storage */
function recuperarDatos() {
  const camposGuardados = JSON.parse(localStorage.getItem("form_contactanos"));
  if (camposGuardados !== null) {
    inputs.find((i) => i.id == "nombre").value = camposGuardados.nombre;
    inputs.find((i) => i.id == "correo").value = camposGuardados.correo;
    inputs.find((i) => i.id == "telefono").value = camposGuardados.telefono;
  } else {
    // Si no hay datos, no hago nada.
  }
}

/** Retorna limpieza de formulario de contacto */
function limpiarFormContacto() {
  document.getElementById("formulario__contactanos").reset();

  /** Limpia campo e íconos del formulario de contacto */
  nombreElementos.forEach((campo) => {
    const campoInput = document.getElementById(`grupo__${campo}`);
    const iconInput = document.querySelector(`#grupo__${campo} i`);
    const parrafoError = document.querySelector(
      `#grupo__${campo} .formulario__input-error`
    );
    if (iconInput) {
      campoInput.classList.remove("formulario__grupo-incorrecto");
      campoInput.classList.remove("formulario__grupo-correcto");
      iconInput.classList.remove("fa-check-circle");
      iconInput.classList.remove("fa-times-circle");
      parrafoError.classList.remove("formulario__input-error-activo");
    }
  });
}
