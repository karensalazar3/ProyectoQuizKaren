const startButton = document.getElementById("start-btn");
const nextButton = document.getElementById("next-btn");
const questionContainerElement = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const botonSiguiente = document.querySelector(".boton-siguiente")
const finContenedor = document.querySelector("#fin")

let questions = [];
let currentQuestionIndex;

// Función para obtener preguntas de la API
const getQuestions = async () => {
  const res = await axios.get(
    "https://opentdb.com/api.php?amount=10&difficulty=easy"
  );
  questions = res.data.results.map((questionObj) => {
    // Guardar respuestas incorrectas y correctas
    let answers = questionObj.incorrect_answers.map((answer) => ({
      text: answer,
      correct: false,
    }));
    answers.push({ text: questionObj.correct_answer, correct: true });

    // Mezclar respuestas
    answers = shuffle(answers);

    // Devolver el objeto pregunta
    return {
      question: questionObj.question,
      answers: answers,
    };
  });
  console.log(questions);
};

// Función para mezclar elementos de un array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Iniciar el juego
function startGame() {
  startButton.classList.add("hide");
  currentQuestionIndex = 0;
  questionContainerElement.classList.remove("hide");
  setNextQuestion();
}

// Mostrar pregunta actual
function showQuestion(question) {
  questionElement.innerText = question.question;
  answerButtonsElement.innerHTML = ""; // Limpiar respuestas previas
  question.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    if (answer.correct) {
      button.dataset.correct = true;
    }
    button.addEventListener("click", selectAnswer);
    answerButtonsElement.appendChild(button);
  });
}

// Configurar siguiente pregunta
function setNextQuestion() {
  resetState();
  showQuestion(questions[currentQuestionIndex]);
}

// Reiniciar el estado de los botones y contenedores
function resetState() {
  nextButton.classList.add("hide");
  answerButtonsElement.innerHTML = "";
}

// Marcar respuestas como correctas o incorrectas
function setStatusClass(element, correct) {
  element.classList.remove("correct", "wrong");
  if (correct) {
    element.classList.add("correct");
  } else {
    element.classList.add("wrong");
  }
}

// Seleccionar respuesta
function selectAnswer(e) {
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct === "true";
  setStatusClass(selectedButton, correct);

  Array.from(answerButtonsElement.children).forEach((button) => {
    setStatusClass(button, button.dataset.correct === "true");
  });

  if (questions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove("hide");
  } else {
    startButton.innerText = "Restart";
    startButton.classList.remove("hide");
  }
}

// Event listeners
startButton.addEventListener("click", startGame);
nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  setNextQuestion();
});

// Cargar preguntas de la API
getQuestions();

  
