document.addEventListener("DOMContentLoaded", function() {
  const quizContainer = document.querySelector('.quiz-container');
  const questionEl = quizContainer.querySelector('.question');
  const optionsEl = quizContainer.querySelector('ul');
  const nextBtn = quizContainer.querySelector('.next-btn');
  const quizProgress = quizContainer.querySelector('.quiz-progress');
  let questions = [];

  function loadQuestions() {
      fetch('test.txt')
          .then(response => response.text())
          .then(data => {
              questions = data.split('\n').map(q => {
                  const match = q.match(/(.+)\s\((.+)\)\s+answer:\s+(.+)/);
                  const question = match[1];
                  const choices = match[2].split(',').map(c => c.trim());
                  const answer = match[3].trim();
                  return { question, choices, answer };
              });
              showQuestion(0);
          });
  }

  loadQuestions();

  let currentQuestionIndex = 0;
  let correctAnswersCount = 0;

  function showQuestion(index) {
      const question = questions[index];
      questionEl.textContent = question.question;
      optionsEl.innerHTML = '';
      question.choices.forEach((choice, index) => {
          const li = document.createElement('li');
          const input = document.createElement('input');
          input.type = 'radio';
          input.name = 'answer';
          input.value = choice;
          li.appendChild(input);
          li.append(`${choice}`);
          optionsEl.appendChild(li);
      });
      nextBtn.disabled = true;
      quizProgress.textContent = `Question ${index + 1} of ${questions.length}`;
      currentQuestionIndex = index;
  }

  function checkAnswer() {
      const selectedAnswer = optionsEl.querySelector('input[name="answer"]:checked');
      if (!selectedAnswer) return;
      const answerIndex = questions[currentQuestionIndex].choices.indexOf(questions[currentQuestionIndex].answer);
      const selectedAnswerIndex = questions[currentQuestionIndex].choices.indexOf(selectedAnswer.value);
      const isCorrect = selectedAnswerIndex === answerIndex;
      console.log(isCorrect);
      if (isCorrect) correctAnswersCount++;
      selectedAnswer.parentElement.classList.add(isCorrect ? 'correct' : 'incorrect');
      optionsEl.querySelectorAll('input').forEach(input => input.disabled = true);
      nextBtn.disabled = false;
    }

  optionsEl.addEventListener('change', checkAnswer);

  nextBtn.addEventListener('click', () => {
      if (currentQuestionIndex < questions.length - 1) {
          showQuestion(currentQuestionIndex + 1);
      } else {
          questionEl.textContent = `You answered ${correctAnswersCount} out of ${questions.length} questions correctly.`;
          optionsEl.innerHTML = '';
          nextBtn.textContent = 'Restart Quiz';
          nextBtn.addEventListener('click', restartQuiz);
      }
  });

  function restartQuiz() {
      currentQuestionIndex = 0;
      correctAnswersCount = 0;
      loadQuestions();
      nextBtn.textContent = 'Next Question';
      quizProgress.textContent = '';
      nextBtn.removeEventListener('click', restartQuiz);
  }
});
