let nombre = document.getElementById("nombre")
let altura = document.getElementById("altura")
let peso = document.getElementById("peso")
let sexo = document.getElementById("sexo")
let resultado = document.getElementById("resultado-imc")
let historial = document.getElementById("historial-btn")
let historialContenedor = document.getElementById("historial-contenedor")
let eliminar = document.getElementById("eliminar-btn")
let historialIMC = JSON.parse(localStorage.getItem("historialIMC")) || [];
let historialList = document.getElementById("historial")

function calcularImc(altura, peso) {
    let estatura = parseFloat(altura)
    let pesokg = parseFloat(peso)

    if (isNaN(pesokg) || isNaN(estatura) || pesokg <= 0 || estatura <= 0) {
        return "Ingrese valores válidos"
    } else {
        return pesokg / (estatura * estatura)
    }
}

function clasificacionImc(imc) {
    if (typeof imc === "string") {
        return "" 
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

function verHistorial() {

    if (historialIMC.length === 0) {
        historialContenedor.style.display = "none" 
        return
    }

    historialContenedor.style.display = "block"

    historialList.innerHTML = "<h2>Historial de cálculos</h2>"

    historialIMC.forEach((registro, index) => {
        historialList.innerHTML += `<p>${index + 1}. Nombre: <strong>${registro.nombre}</strong> - IMC: ${registro.imc} (${registro.clasificacion})</p>`
    })
}

let calcular = document.getElementById("calcular-btn")

calcular.onclick = () => {
    let imc = calcularImc(altura.value, peso.value)
    let clasificacion = clasificacionImc(imc)

    if (typeof imc === "string") {
        resultado.innerHTML = imc
    } else {
        let imcRedondeado = imc.toFixed(2)

        resultado.style.display = "flex"
        historialContenedor.style.display = "none"
        resultado.innerHTML = `Su IMC es: ${imc.toFixed(2)} <br> Clasificación: ${clasificacion}`

        let nuevoRegistro = {
            nombre: nombre.value,
            altura: altura.value,
            peso: peso.value,
            sexo: sexo.value,
            imc: imcRedondeado,
            clasificacion: clasificacion
        }

        historialIMC.push(nuevoRegistro)
        localStorage.setItem("historialIMC", JSON.stringify(historialIMC))
    }
};

let limpiar = document.getElementById("limpiar-btn")

limpiar.onclick = () => {
    nombre.value = ""
    altura.value = ""
    peso.value = ""
    sexo.value = ""
    resultado.innerHTML = ""
    resultado.style.display = "none"
};

historial.onclick = () => {
    verHistorial()
    resultado.style.display = "none"
};



eliminar.onclick = function () {
    if (confirm("¿Estás seguro de que deseas eliminar todo el historial?")) {
        historialIMC = []
        localStorage.removeItem("historialIMC")
        alert("Historial eliminado correctamente.")
        historialContenedor.style.display = "none"
    }
}
