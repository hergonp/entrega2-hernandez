let nombre = document.getElementById("nombre");
let altura = document.getElementById("altura");
let peso = document.getElementById("peso");
let resultado = document.getElementById("resultado-imc");
let historial = document.getElementById("historial-btn");
let historialContenedor = document.getElementById("historial-contenedor");
let eliminar = document.getElementById("eliminar-btn");
let historialList = document.getElementById("historial");
let formulario = document.querySelector(".calculo-imc");
let datosRecomendaciones = null;
let historialIMC = [];

    (async function cargarDatosIniciales() {
        try {
            const response = await fetch("./db/data.json");
            datosRecomendaciones = await response.json();

            const historialGuardado = localStorage.getItem("historialIMC");
            if (historialGuardado) {
                historialIMC = JSON.parse(historialGuardado);
            }
        } catch (error) {
            await Swal.fire("Error", "No se pudieron cargar los datos iniciales", "error");
        }
    })();

function calcularImc(altura, peso) {
    let estatura = parseFloat(altura);
    let pesokg = parseFloat(peso);

    if (isNaN(pesokg) || isNaN(estatura) || pesokg <= 0 || estatura <= 0) {
        return "Ingrese valores válidos";
    } else {
        return pesokg / (estatura * estatura);
    }
}

function clasificacionImc(imc) {
    if (typeof imc === "string") {
        return "";
    }

    switch (true) {
        case imc <= 18.5:
            return "Bajo peso"
        case imc <= 25.0:
            return "Normal"
        case imc <= 30.0:
            return "Sobrepeso"
        default:
            return "Obesidad"
    }
}

function mostrarDatosIMC(clasificacion) {
    if (!datosRecomendaciones) {
        return null;
    }

    const categoria = datosRecomendaciones.clasificaciones.find(item => item.tipo === clasificacion);

    if (!categoria) {
        return null;
    }

    return {
        descripcion: categoria.descripcion,
        rango: categoria.rango,
        ejercicios: categoria.ejercicios,
        dieta: categoria.dieta
    };
}

function recomendacionesIMC(datos) {
    if (!datos) return "<p>No hay recomendaciones disponibles</p>";

    let html = `
    <div class="seccion-json">
        <h3>Descripción</h3>
        <p>${datos.descripcion}</p>
        <p><strong>Rango:</strong> ${datos.rango}</p>
        
        <h3>Plan de Ejercicios</h3>
    `;

    // Ejercicios
    datos.ejercicios.forEach(ejercicio => {
        html += `
        <div class="recomendacion-item">
        <h4>${ejercicio.nombre} (${ejercicio.frecuencia})</h4>
        <p>${ejercicio.descripcion}</p>
        <p><strong>Ejemplos:</strong> ${ejercicio.ejemplos.join(", ")}</p>
        </div>
    `;
    });

    // Dieta
    html += `
        <h3>Plan Alimenticio</h3>
        <p>${datos.dieta.descripcion}</p>
    `;

    if (datos.dieta.macronutrientes) {
        html += `
        <h4>Distribución de Macronutrientes</h4>
        <ul>
        <li><strong>Proteínas:</strong> ${datos.dieta.macronutrientes.proteinas}</li>
        <li><strong>Carbohidratos:</strong> ${datos.dieta.macronutrientes.carbohidratos}</li>
        <li><strong>Grasas:</strong> ${datos.dieta.macronutrientes.grasas}</li>
        </ul>
    `;
    }

    if (datos.dieta.alimentos_recomendados) {
        html += `
        <h4>Alimentos Recomendados</h4>
        <ul>
        ${datos.dieta.alimentos_recomendados.map(alimento => `<li>${alimento}</li>`).join("")}
        </ul>
    `;
    }

    if (datos.dieta.comidas_ejemplo) {
        html += `
        <h4>Ejemplo de Comidas</h4>
        <ul>
        ${datos.dieta.comidas_ejemplo.map(comida => `<li>${comida}</li>`).join("")}
        </ul>
    `;
    }

    html += `</div>`;
    return html;
}

function guardarEnHistorial(registro) {
    historialIMC.push(registro);
    localStorage.setItem("historialIMC", JSON.stringify(historialIMC));
}

function verHistorial() {

    if (historialIMC.length === 0) {
        Swal.fire("Historial vacío", "No hay registros guardados", "info");
        return;
    }

    formulario.style.display = "none";
    resultado.style.display = "none";
    historialContenedor.style.display = "block";

    historialList.innerHTML = `<h2>Historial de cálculos</h2> 
    <div class="historial-items">
    ${historialIMC.map((reg, i) => `
        <div class="historial-item">
        <p><strong>${i + 1}. ${reg.nombre}</strong> (${reg.sexo})</p>
        <p>IMC: ${reg.imc} (${reg.clasificacion})</p>
        <p>Altura: ${reg.altura}m - Peso: ${reg.peso}kg</p>
        </div>
    `).join("")}
    </div>
    <button class="btn volver-btn">Volver</button>`;

    historialList.querySelector('.volver-btn').addEventListener('click', () => {
        historialContenedor.style.display = "none";
        formulario.style.display = "block";
    });
}

//Evento Calcular

let calcular = document.getElementById("calcular-btn");

calcular.onclick = () => {
    if (!nombre.value || !altura.value || !peso.value) {
        Swal.fire("Error", "Complete todos los campos", "error");
        return;
    }

    let sexo = document.querySelector('input[name="sexo"]:checked')?.value;

    if (!sexo) {
        Swal.fire("Error", "Seleccione su sexo", "error");
        return;
    }

    let imc = calcularImc(altura.value, peso.value);

    if (typeof imc === "string") {
        resultado.textContent = imc;
        resultado.style.display = "block";
        return;
    }

    let imcRedondeado = imc.toFixed(2);
    let clasificacion = clasificacionImc(imc);
    let datosIMC = mostrarDatosIMC(clasificacion);
    let recomendaciones = recomendacionesIMC(datosIMC);

    formulario.style.display = "none";
    resultado.style.display = "block";
    resultado.innerHTML = `
        <div class="resultado-container">
            <h2>Resultado para ${nombre.value}</h2>
            <div class="resumen-imc">
                <p><strong>IMC:</strong> ${imcRedondeado}</p>
                <p><strong>Clasificación:</strong> ${clasificacion}</p>
                <p><strong>Sexo:</strong> ${sexo === "femenino" ? "Femenino" : "Masculino"}</p>
    </div>
        
    ${recomendaciones}
    
    <button class="btn volver-btn">Volver</button>
    </div>`;

    document.querySelector('#resultado-imc .volver-btn').addEventListener('click', () => {
        resultado.style.display = "none";
        formulario.style.display = "block";
    });

    guardarEnHistorial({
        nombre: nombre.value,
        altura: altura.value,
        peso: peso.value,
        sexo: sexo,
        imc: imcRedondeado,
        clasificacion: clasificacion
    });
}

//Evento Limpiar

let limpiar = document.getElementById("limpiar-btn");

limpiar.onclick = () => {
    nombre.value = "";
    altura.value = "";
    peso.value = "";
    document.querySelectorAll('input[name="sexo"]').forEach(r => r.checked = false);
    resultado.style.display = "none";
    formulario.style.display = "block";
}

historial.onclick = () => {
    verHistorial();
}

eliminar.onclick = () => {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "No será posible revertir esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            historialIMC = [];
            localStorage.removeItem("historialIMC");
            historialContenedor.style.display = "none";
            formulario.style.display = "block";
            Swal.fire("Éxito", "Historial eliminado", "success");
            Swal.fire({
                title: "¡Eliminado!",
                text: "El historial ha sido eliminado con éxito.",
                icon: "success"
            });
        }
    });
}
