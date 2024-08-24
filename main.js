// DOM Elements
const questionInput = document.querySelector('.question');
const optionsInputs = document.querySelectorAll('.option input[type="text"]');
const answerInput = document.getElementById('answer');
const addQuestionBtn = document.querySelector('.add-question');
const questionsContainer = document.querySelector('.questions');
const examSection = document.querySelector('.exam');
const examQuestionsContainer = document.querySelector('.exam-questions');
const resultSection = document.querySelector('.result');
const scoreDisplay = document.querySelector('.score');
const timerDisplay = document.getElementById('timer');
const submitExamBtn = document.querySelector('.submit-exam');
const themeSwitch = document.getElementById('themeSwitch');

let questions = [];
let timer;
const maxQuestions = 5;
const timeLimit = 120; // 2 minutes

// Add question function
function addQuestion() {
  const questionText = questionInput.value.trim();
  const options = Array.from(optionsInputs).map(input => input.value.trim());
  const correctAnswer = parseInt(answerInput.value.trim());

  // Validate inputs
  if (validateInputs(questionText, options, correctAnswer)) {
    const question = {
      questionText,
      options,
      correctAnswer,
    };
    questions.push(question);

    // Clear inputs and error messages
    clearInputs();

    // Start exam if max questions reached
    if (questions.length === maxQuestions) {
      startExam();
    }
  }
}

// Validate inputs function
function validateInputs(questionText, options, correctAnswer) {
  let isValid = true;

  // Clear previous error messages
  clearErrorMessages();

  // Validate question text
  if (!questionText) {
    displayError('Question cannot be empty.', questionInput);
    isValid = false;
  }

  // Validate options
  optionsInputs.forEach((input, index) => {
    if (!options[index]) {
      displayError(`Option ${index + 1} cannot be empty.`, input);
      isValid = false;
    }
  });

  // Validate correct answer
  if (isNaN(correctAnswer) || correctAnswer < 1 || correctAnswer > 4) {
    displayError('Answer must be a number between 1 and 4.', answerInput);
    isValid = false;
  }

  return isValid;
}

// Display error function
function displayError(message, element) {
  const errorElement = document.createElement('p');
  errorElement.classList.add('error-message');
  errorElement.textContent = message;
  element.parentElement.appendChild(errorElement);
}

// Clear error messages function
function clearErrorMessages() {
  const errorMessages = document.querySelectorAll('.error-message');
  errorMessages.forEach(msg => msg.remove());
}

// Clear input fields function
function clearInputs() {
  questionInput.value = '';
  optionsInputs.forEach(input => input.value = '');
  answerInput.value = '';
}

// Start exam function
function startExam() {
  document.querySelector('.question-input').style.display = 'none';
  examSection.style.display = 'block';

  displayExamQuestions();
  startTimer();
}

// Display exam questions function
function displayExamQuestions() {
  examQuestionsContainer.innerHTML = '';
  questions.forEach((question, index) => {
    const questionItem = document.createElement('div');
    questionItem.classList.add('question-item');
    questionItem.innerHTML = `
      <h3>${index + 1}. ${question.questionText}</h3>
      ${question.options.map((option, optIndex) => `
        <div class="option-item">
          <input type="radio" name="question${index}" id="question${index}option${optIndex + 1}" value="${optIndex + 1}">
          <label for="question${index}option${optIndex + 1}">${option}</label>
        </div>
      `).join('')}
    `;
    examQuestionsContainer.appendChild(questionItem);

    // Add event listener to disable options after selection
    const options = document.querySelectorAll(`input[name="question${index}"]`);
    options.forEach(option => {
      option.addEventListener('change', () => {
        disableOptions(index);
      });
    });
  });
}

// Function to handle disabling options after a choice is made
function disableOptions(questionIndex) {
  const options = document.querySelectorAll(`input[name="question${questionIndex}"]`);
  options.forEach(option => option.disabled = true);
}

// Start timer function
function startTimer() {
  let timeRemaining = timeLimit;
  timerDisplay.textContent = formatTime(timeRemaining);
  
  timer = setInterval(() => {
    timeRemaining--;
    timerDisplay.textContent = formatTime(timeRemaining);

    if (timeRemaining <= 0) {
      clearInterval(timer);
      submitExam();
    }
  }, 1000);
}

// Format time for display function
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Submit exam function
submitExamBtn.addEventListener('click', submitExam);
function submitExam() {
  clearInterval(timer);
  let score = 0;

  questions.forEach((question, index) => {
    const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
    if (selectedOption && parseInt(selectedOption.value) === question.correctAnswer) {
      score += 2; // 2 points for each correct answer
    }
  });

  displayResult(score);
}

// Display result function
function displayResult(score) {
  examSection.style.display = 'none';
  resultSection.style.display = 'block';
  scoreDisplay.textContent = `You scored ${score} out of ${questions.length * 2}`;
}

// Theme toggling function
themeSwitch.addEventListener('change', () => {
  document.body.classList.toggle('dark-theme');
  document.body.classList.toggle('light-theme');
  document.querySelector('.theme-label').textContent = document.body.classList.contains('dark-theme') ? 'Dark Mode' : 'Light Mode';
});

// Event listener for adding questions
addQuestionBtn.addEventListener('click', addQuestion);
