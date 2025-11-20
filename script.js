const questionBox = document.getElementById("question");
const optionsContainer = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const scoreBox = document.getElementById("score");

// New: Start + Restart buttons
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

let questions = [];
let currentQuestion = 0;
let score = 0;

// ===============================
//  START QUIZ
// ===============================
startBtn.onclick = () => {
  startBtn.style.display = "none";
  fetchQuestions();
};

// ===============================
//  FETCH QUESTIONS FROM API
// ===============================
async function fetchQuestions() {
  const res = await fetch("https://opentdb.com/api.php?amount=5&type=multiple");
  const data = await res.json();
  
  questions = data.results;
  currentQuestion = 0;
  score = 0;

  showQuestion();
}

// ===============================
//  SHOW QUESTION + OPTIONS
// ===============================
function showQuestion() {
  restartBtn.style.display = "none";
  nextBtn.style.display = "none";
  scoreBox.innerText = "";

  const q = questions[currentQuestion];
  questionBox.innerHTML = decodeHTML(q.question);

  const options = [...q.incorrect_answers, q.correct_answer];
  shuffleArray(options);

  optionsContainer.innerHTML = "";

  options.forEach(option => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.innerHTML = decodeHTML(option);

    btn.onclick = () => checkAnswer(btn, option, q.correct_answer);

    optionsContainer.appendChild(btn);
  });
}

// ===============================
//  CHECK ANSWER
// ===============================
function checkAnswer(selectedBtn, selected, correct) {
  const allBtns = document.querySelectorAll(".option");

  allBtns.forEach(btn => (btn.disabled = true));

  if (selected === correct) {
    score++;
    selectedBtn.classList.add("correct");
  } else {
    selectedBtn.classList.add("wrong");

    allBtns.forEach(btn => {
      if (btn.innerHTML === decodeHTML(correct)) {
        btn.classList.add("correct");
      }
    });
  }

  nextBtn.style.display = "block";
}

// ===============================
//  NEXT QUESTION
// ===============================
nextBtn.onclick = () => {
  currentQuestion++;

  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
};

// ===============================
//  END QUIZ + RESTART OPTION
// ===============================
function endQuiz() {
  questionBox.innerHTML = "🎉 Quiz Completed!";
  optionsContainer.innerHTML = "";
  nextBtn.style.display = "none";

  scoreBox.innerHTML = `Your Score: <strong>${score} / ${questions.length}</strong>`;

  restartBtn.style.display = "block";  // show restart button
}

// ===============================
//  RESTART QUIZ (go to start screen)
// ===============================
restartBtn.onclick = () => {
  restartBtn.style.display = "none";
  scoreBox.innerText = "";
  questionBox.innerText = "Click Start to Begin the Quiz";
  startBtn.style.display = "block";
};

// ===============================
//  UTILITIES
// ===============================
function decodeHTML(text) {
  const txt = document.createElement("textarea");
  txt.innerHTML = text;
  return txt.value;
}

function shuffleArray(arr) {
  arr.sort(() => Math.random() - 0.5);
}
