import { auth, db, collection, addDoc, getDocs, query, where, serverTimestamp } from './firebase.js';

let quizData = {};
let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let category = new URLSearchParams(window.location.search).get('category') || 'generic';

// DOM Elements
const uiLoader = document.getElementById('loader');
const uiQuiz = document.getElementById('quiz-ui');
const uiResult = document.getElementById('result-screen');
const elTitle = document.getElementById('quiz-title');
const elCurr = document.getElementById('q-current');
const elTotal = document.getElementById('q-total');
const elProgress = document.getElementById('progress-bar');
const elQuestion = document.getElementById('question-text');
const elOptions = document.getElementById('options-container');
const elFeedback = document.getElementById('feedback-box');
const btnNext = document.getElementById('btn-next');

async function initQuiz() {
    try {
        const response = await fetch('quiz_data.json');
        quizData = await response.json();
        
        let rawCategory = category.toLowerCase().replace(/\s+/g, '_');
        currentQuestions = quizData[rawCategory] || quizData['generic'];
        
        elTitle.innerText = category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + " Quiz";
        elTotal.innerText = currentQuestions.length;
        
        uiLoader.style.display = 'none';
        uiQuiz.style.display = 'block';
        
        loadQuestion();
    } catch (err) {
        uiLoader.innerText = "Error loading quiz data.";
        console.error(err);
    }
}

function loadQuestion() {
    const q = currentQuestions[currentIndex];
    elCurr.innerText = currentIndex + 1;
    elProgress.style.width = `${((currentIndex) / currentQuestions.length) * 100}%`;
    
    elQuestion.innerText = q.question;
    elOptions.innerHTML = '';
    elFeedback.style.display = 'none';
    btnNext.style.display = 'none';
    
    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => selectOption(idx, btn, q);
        elOptions.appendChild(btn);
    });
}

function selectOption(selectedIndex, btnElement, qObj) {
    // Disable all options
    const allBtns = elOptions.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.disabled = true);
    
    if (selectedIndex === qObj.correct) {
        btnElement.classList.add('correct');
        score++;
        elFeedback.className = 'feedback-box correct';
        elFeedback.innerHTML = `<strong>Correct!</strong> ${qObj.explanation}`;
    } else {
        btnElement.classList.add('wrong');
        allBtns[qObj.correct].classList.add('correct');
        elFeedback.className = 'feedback-box wrong';
        elFeedback.innerHTML = `<strong>Incorrect.</strong> ${qObj.explanation}`;
    }
    elFeedback.style.display = 'block';
    btnNext.style.display = 'inline-block';
}

btnNext.onclick = () => {
    currentIndex++;
    if (currentIndex < currentQuestions.length) {
        loadQuestion();
    } else {
        showResults();
    }
};

async function showResults() {
    uiQuiz.style.display = 'none';
    uiResult.style.display = 'block';
    
    const percentage = Math.round((score / currentQuestions.length) * 100);
    document.getElementById('result-score').innerText = `${percentage}%`;
    document.getElementById('result-marks').innerText = `${score} / ${currentQuestions.length}`;
    
    // Save to Firestore if logged in
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            try {
                await addDoc(collection(db, 'quiz_history'), {
                    userId: user.uid,
                    category: category,
                    score: score,
                    total: currentQuestions.length,
                    percentage: percentage,
                    timestamp: serverTimestamp()
                });
                console.log("Quiz history saved!");
            } catch (err) {
                console.error("Failed to save history:", err);
            }
        }
    });
}

// Start
initQuiz();
