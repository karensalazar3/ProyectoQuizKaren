const startButton = document.getElementById("start-btn");
const startTitle = document.getElementById("start-title");
const nextButton = document.getElementById("next-btn");
const questionContainerElement = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const finContenedor = document.querySelector("#fin");
const scoreButton = document.getElementById("score-btn");
let questions = [];
let currentQuestionIndex;
let score = 0;
let scoreChart; // Variable para almacenar la instancia de la gráfica

// Función para obtener preguntas de la API
const getQuestions = async () => {
  try {
    const res = await axios.get(
      "https://opentdb.com/api.php?amount=10&difficulty=easy"
    );
    questions = res.data.results.map((questionObj) => {
      let answers = questionObj.incorrect_answers.map((answer) => ({
        text: answer,
        correct: false,
      }));
      answers.push({ text: questionObj.correct_answer, correct: true });
      answers = shuffle(answers);
      return {
        question: questionObj.question,
        answers: answers,
      };
    });
    console.log(questions);
  } catch (error) {
    console.error("Error al obtener preguntas:", error);
  }
};

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startGame() {
  startTitle.classList.add("hide");
  startButton.classList.add("hide");
  scoreButton.classList.add("hide");
  currentQuestionIndex = 0;
  score = 0;
  questionContainerElement.classList.remove("hide");
  document.getElementById("stats-card").classList.add("hide");
  if (scoreChart) {
    scoreChart.destroy();
    scoreChart = null;
  }
  setNextQuestion();
}

function showQuestion(question) {
  questionElement.innerText = question.question;
  answerButtonsElement.innerHTML = "";
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

function setNextQuestion() {
  resetState();
  showQuestion(questions[currentQuestionIndex]);
}

function resetState() {
  nextButton.classList.add("hide");
  answerButtonsElement.innerHTML = "";
}

function setStatusClass(element, correct) {
  element.classList.remove("correct", "wrong");
  if (correct) {
    element.classList.add("correct");
  } else {
    element.classList.add("wrong");
  }
}

function selectAnswer(e) {
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct === "true";
  setStatusClass(selectedButton, correct);

  if (correct) {
    score++;
  }

  Array.from(answerButtonsElement.children).forEach((button) => {
    setStatusClass(button, button.dataset.correct === "true");
  });

  if (questions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove("hide");
  } else {
    questionContainerElement.classList.add("hide");
    scoreButton.innerText = `Puntaje Final: ${score}/${questions.length}`;
    scoreButton.classList.remove("hide");
    startButton.innerText = "Reiniciar";
    startButton.classList.remove("hide");
  }
}

startButton.addEventListener("click", startGame);
nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  setNextQuestion();
});

getQuestions();

// Función para mostrar la tarjeta de la gráfica de porcentaje
function showFinalScoreChart() {
  const statsCard = document.getElementById("stats-card");
  const scoreChartElement = document.getElementById("scoreChart");

  // Verificar si los elementos existen
  if (!statsCard || !scoreChartElement) {
    console.error("Elementos de la tarjeta de estadísticas o gráfico no encontrados.");
    return;
  }

  // Calcular porcentaje de respuestas correctas e incorrectas
  const correctPercentage = (score / questions.length) * 100;
  const incorrectPercentage = 100 - correctPercentage;

  // Configurar los datos para la gráfica
  const chartData = {
    labels: ['Correctas', 'Incorrectas'],
    datasets: [{
      data: [correctPercentage, incorrectPercentage],
      backgroundColor: ['#4CAF50', '#FF5252'] // Colores para correctas e incorrectas
    }]
  };

  // Destruir la gráfica anterior si existe para evitar duplicados
  if (scoreChart) {
    scoreChart.destroy();
  }

  // Crear una nueva gráfica de torta para mostrar el porcentaje
  scoreChart = new Chart(scoreChartElement, {
    type: 'pie',
    data: chartData,
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${context.raw.toFixed(2)}%`;
            }
          }
        }
      }
    }
  });

  // Mostrar la tarjeta de estadísticas
  statsCard.classList.remove("hide");
}

// Evento para mostrar la gráfica al hacer clic en el botón de puntaje final
scoreButton.addEventListener("click", showFinalScoreChart);
