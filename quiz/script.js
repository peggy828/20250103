let currentQuestionIndex = 0;
let userAnswers = [];

// 當頁面載入完成時
window.onload = function() {
    // 監聽開始測驗按鈕
    document.getElementById('start-btn').addEventListener('click', function() {
        document.getElementById('welcome-page').classList.add('hidden');
        document.getElementById('quiz-page').classList.remove('hidden');
        initializeQuiz();
    });

    // 監聽導航按鈕
    document.getElementById('prev-btn').addEventListener('click', showPreviousQuestion);
    document.getElementById('next-btn').addEventListener('click', showNextQuestion);
    document.getElementById('submit-btn').addEventListener('click', submitQuiz);
};

function initializeQuiz() {
    currentQuestionIndex = 0;
    userAnswers = new Array(quizData.length).fill('');
    showQuestion(currentQuestionIndex);
    updateProgress();
}

function showQuestion(index) {
    const questionContainer = document.getElementById('current-question');
    const question = quizData[index];
    
    let inputHtml = '';
    if (question.type === "choice") {
        // 選擇題的 HTML
        inputHtml = `
            <div class="options">
                ${question.options.map((option, i) => `
                    <label class="option">
                        <input type="radio" 
                               name="question-${index}" 
                               value="${option}"
                               ${userAnswers[index] === option ? 'checked' : ''}>
                        <span class="option-text">${option}</span>
                    </label>
                `).join('')}
            </div>
        `;
    } else {
        // 填充題的 HTML
        inputHtml = `
            <input type="text" 
                   id="answer-${index}" 
                   placeholder="請輸入答案"
                   value="${userAnswers[index]}"
                   autocomplete="off">
        `;
    }

    questionContainer.innerHTML = `
        <div class="question">
            <p>問題 ${index + 1}: ${question.question}</p>
            ${inputHtml}
        </div>
    `;

    // 更新按鈕狀態
    document.getElementById('prev-btn').disabled = index === 0;
    
    if (index === quizData.length - 1) {
        document.getElementById('next-btn').classList.add('hidden');
        document.getElementById('submit-btn').classList.remove('hidden');
    } else {
        document.getElementById('next-btn').classList.remove('hidden');
        document.getElementById('submit-btn').classList.add('hidden');
    }

    // 監聽答案變化
    if (question.type === "choice") {
        const radioButtons = document.querySelectorAll(`input[name="question-${index}"]`);
        radioButtons.forEach(radio => {
            radio.addEventListener('change', function() {
                userAnswers[index] = this.value;
            });
        });
    } else {
        document.getElementById(`answer-${index}`).addEventListener('input', function(e) {
            userAnswers[index] = e.target.value;
        });
    }
}

function showPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion(currentQuestionIndex);
        updateProgress();
    }
}

function showNextQuestion() {
    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
        updateProgress();
    }
}

function updateProgress() {
    const progress = document.getElementById('progress');
    const percentage = ((currentQuestionIndex + 1) / quizData.length) * 100;
    progress.style.width = `${percentage}%`;
}

function submitQuiz() {
    let correctAnswers = 0;
    
    quizData.forEach((item, index) => {
        if (userAnswers[index] === item.answer) {
            correctAnswers++;
        }
    });
    
    const score = (correctAnswers / quizData.length) * 100;
    showResult(score);
}

function showResult(score) {
    document.getElementById('quiz-container').classList.add('hidden');
    document.getElementById('result').classList.remove('hidden');
    document.getElementById('score').textContent = score.toFixed(1);
    
    const feedback = document.getElementById('feedback');
    if (score >= 90) {
        feedback.textContent = "太棒了！";
    } else if (score < 60) {
        feedback.textContent = "再加油！";
    } else {
        feedback.textContent = "做得不錯！";
    }
}