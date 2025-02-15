function calcularIMC(peso, estatura){
    return imc = peso / (estatura * estatura)
}

let continuar = true
const clasificacion = ["🟦 Estás bajo de peso.", "🟩 Tienes un peso normal.", "🟧 Estás sobrepeso.", "🟥 Tienes obesidad."]

while (continuar) {
    let peso = parseFloat(prompt("Introduce tu peso en kilogramos: "));
    
    let altura = parseFloat(prompt("Introduce tu altura en metros: (Ejemplo: 1.56)"));

    if (isNaN(peso) || isNaN(altura) || peso <= 0 || altura <= 0) {
        alert("Por favor, introduce valores válidos para peso y altura.");
    } else {
        let imc = calcularIMC(peso, altura);
        console.log(`Tu IMC es: ${imc.toFixed(2)}`);
        
        if (imc < 18.5) {
            console.log(clasificacion[0]);
        } else if (imc >= 18.5 && imc < 24.9) {
            console.log(clasificacion[1]);
        } else if (imc >= 25 && imc < 29.9) {
            console.log(clasificacion[2]);
        } else {
            console.log(clasificacion[3]);
        }

        let confirmar = prompt("¿Quieres calcular otro IMC? (si/no): ");

        if (confirmar == "no") {
        continuar = false
        break;
        }
    }
    
}

console.log("¡Gracias por usar la calculadora de IMC!");