// DOM Elements
const questionInput = document.getElementById('questionText');
const optionInputs = [
  document.getElementById('option1'),
  document.getElementById('option2'),
  document.getElementById('option3'),
  document.getElementById('option4')
];
const correctAnswerInput = document.getElementById('correctAnswer');
const addQuestionBtn = document.querySelector('.add');
const startExamBtn = document.querySelector('.start');
const questionsContainer = document.querySelector('.questions div');
const examSection = document.querySelector('.exam');
const examQuestionsContainer = document.querySelector('.exam-questions');
const resultSection = document.querySelector('.result');
const scoreDisplay = document.querySelector('.score');
const timerDisplay = document.getElementById('timer');
const submitExamBtn = document.querySelector('.submit-exam');
const themeSwitch = document.getElementById('themeSwitch');
const progressBar = document.querySelector('.progress-bar');
const difficultySelector = document.getElementById('difficulty');
const OtherErr = document.querySelector('.other-error');
const QuestionErr = document.querySelector('.error-question');
const OptErr = document.querySelector('.error-options');
const AnswerErr = document.querySelector('.error-answer');
let questions = [];
let timer;
let timeLimit = 120; // Default 2 minutes based on Medium difficulty

// Adjust time limit based on difficulty
difficultySelector.addEventListener('change', (e) => {
  const difficulty = e.target.value;
  if (difficulty === 'easy') {
    timeLimit = 180; // 3 minutes
  } else if (difficulty === 'medium') {
    timeLimit = 120; // 2 minutes
  } else if (difficulty === 'hard') {
    timeLimit = 60; // 1 minute
  }
});

// Add question function with error handling
const addQuestion = (event) => {
  event.preventDefault();
  // Clear previous error messages
  QuestionErr.textContent = '';
  OptErr.textContent = '';
  AnswerErr.textContent = '';
  OtherErr.textContent = '';

  const questionText = questionInput.value.trim();
  const options = optionInputs.map(input => input.value.trim());
  const correctAnswer = parseInt(correctAnswerInput.value.trim(), 10);

  let isValid = true;

  if (!isNonEmpty(questionText)) {
    QuestionErr.textContent = 'Please add a question.';
    isValid = false;
  }

  if (!options.every(isNonEmpty)) {
    OptErr.textContent = 'Make sure you added all options correctly.';
    isValid = false;
  }

  if (!(correctAnswer >= 1 && correctAnswer <= 4)) {
    AnswerErr.textContent = "Please enter a valid answer between 1 and 4.";
    isValid = false;
  }

  if (isValid) {
    questions.push({ questionText, options, correctAnswer });
    clearInputs();
    updateProgressBar();
  }
};

// Helper function to check if a string is non-empty
const isNonEmpty = (str) => str.length > 0;

// Clear inputs
const clearInputs = () => {
  questionInput.value = '';
  optionInputs.forEach(input => input.value = '');
  correctAnswerInput.value = '';
};

// Start exam
const startExam = () => {
  if (questions.length === 0) {
    OtherErr.textContent = 'Please add some questions before starting the exam';
    return;
  }

  document.querySelector('.question-input').style.display = 'none';
  examSection.style.display = 'block';
  examSection.classList.add('fade-in'); // Add fade-in animation

  examQuestionsContainer.innerHTML = questions.map((q, i) => `
    <div class="question-item fade-in">
      <p>${i + 1}. ${q.questionText}</p>
      ${q.options.map((option, index) => `
        <div class="option-item">
          <input type="radio" name="question${i}" id="option${index}${i}" value="${index + 1}">
          <label for="option${index}${i}">${option}</label>
        </div>
      `).join('')}
    </div>
  `).join('');

  // Attach event listeners to disable radio buttons after selection
  questions.forEach((_, i) => {
    const options = document.querySelectorAll(`input[name="question${i}"]`);
    options.forEach(option => {
      option.addEventListener('change', () => {
        options.forEach(opt => opt.disabled = true);
      });
    });
  });

  startTimer(timeLimit);
};
// Start timer
const startTimer = (seconds) => {
  let remainingTime = seconds;
  timerDisplay.textContent = formatTime(remainingTime);

  timer = setInterval(() => {
    remainingTime--;
    timerDisplay.textContent = formatTime(remainingTime);

    if (remainingTime <= 0) {
      clearInterval(timer);
      submitExam();
    }
  }, 1000);
};

// Format time for display
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

// Submit exam
const submitExam = () => {
  clearInterval(timer);
  let score = 0;

  questions.forEach((question, i) => {
    const selectedAnswer = document.querySelector(`input[name="question${i}"]:checked`);
    const correctLabel = document.querySelector(`#option${question.correctAnswer - 1}${i} + label`);

    // Show checkmark next to correct answers
    if (correctLabel) {
      correctLabel.textContent += " ✓";
    }

    // Disable all options after submission
    const allOptions = document.querySelectorAll(`input[name="question${i}"]`);
    allOptions.forEach(option => option.disabled = true);

    if (selectedAnswer && parseInt(selectedAnswer.value, 10) === question.correctAnswer) {
      score++;
    }
  });

  displayResult(score);
};

// Display result and feedback
const displayResult = (score) => {
  resultSection.style.display = 'block';
  scoreDisplay.textContent = `You scored ${score} out of ${questions.length}`;

  // Display feedback for each question
  questions.forEach((question, i) => {
    const selectedAnswer = document.querySelector(`input[name="question${i}"]:checked`);
    selectedAnswer.setAttribute('disabled', 'true');
    const feedbackElement = document.createElement('p');
    feedbackElement.classList.add('feedback');

    if (selectedAnswer) {
      const answerValue = parseInt(selectedAnswer.value, 10);
      if (answerValue === question.correctAnswer) {
        feedbackElement.textContent = "Correct!";
        feedbackElement.classList.add('correct');
      } else {
        feedbackElement.textContent = "Incorrect!";
        feedbackElement.classList.add('incorrect');
      }
    }

    const questionItem = document.querySelector(`.question-item:nth-child(${i + 1})`);
    if (questionItem) {
      questionItem.appendChild(feedbackElement);
    }
  });

  timerDisplay.style.display = 'none';
  submitExamBtn.style.display = 'none';
};

// Update progress bar
const updateProgressBar = () => {
  const progressPercentage = (questions.length / 10) * 100; // Assuming 10 questions as max
  progressBar.style.width = `${progressPercentage}%`;
};

// Event Listeners
addQuestionBtn.addEventListener('click', addQuestion);
startExamBtn.addEventListener('click', startExam);
submitExamBtn.addEventListener('click', submitExam);

// Theme toggle
themeSwitch.addEventListener('change', (e) => {
  document.body.classList.toggle('dark-theme');
});