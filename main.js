
// Selección de elementos del DOM
const PreguntaPrincipalElemento = document.querySelector(".preguntaPrincipal")
const opcion1 = document.querySelector(".opcion1")
const opcion2 = document.querySelector(".opcion2")
const opcion3 = document.querySelector(".opcion3")
const opcion4 = document.querySelector(".opcion4")
const botonSiguiente = document.querySelector(".boton-siguiente")

let preguntaActual
let preguntaNumero = 0


// Actualizar el DOM con la pregunta y opciones
function actualizarPreguntasDOM(preguntaInfo) {
    PreguntaPrincipalElemento.innerHTML = preguntaInfo.question

    // Mezclar las respuestas y asignarlas
    const respuestas = [
        preguntaInfo.correct_answer,
        ...preguntaInfo.incorrect_answers
    ].sort(() => Math.random() - 0.5)

    opcion1.innerHTML = respuestas[0]
    opcion2.innerHTML = respuestas[1]
    opcion3.innerHTML = respuestas[2]
    opcion4.innerHTML = respuestas[3]
}

// Obtener preguntas de la API
const ConseguirPreguntas = async () => {
    try {
        const respuesta = await fetch('https://opentdb.com/api.php?amount=10&category=15&difficulty=easy&type=multiple')
        const data = await respuesta.json()
        console.log(data.results)

        // Establecer la primera pregunta
        preguntaActual = data.results[preguntaNumero]
        actualizarPreguntasDOM(preguntaActual)

        // Actualizar pregunta al hacer clic en el botón
        botonSiguiente.addEventListener('click', function() {
            preguntaNumero += 1
            if (preguntaNumero < data.results.length) {
                preguntaActual = data.results[preguntaNumero]
                actualizarPreguntasDOM(preguntaActual)
            } else {
                console.log("No hay más preguntas")
            }
        })
    } catch (error) {
        console.error('Error al conseguir preguntas:', error)
    }
}


function navigateToView(viewId){

    document.querySelectorAll('.view').forEach( view => {
        view.classList.remove('active')
    })

    document.getElementById(viewId).classList.add('active')

    ConseguirPreguntas()
}


