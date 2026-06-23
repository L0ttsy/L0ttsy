// Flipbook State
let currentPage = 0;
const totalPages = 48;

// DOM Elements
const leftPageImg = document.getElementById('left-page-img');
const rightPageImg = document.getElementById('right-page-img');
const currentPageSpan = document.getElementById('current-page');
const totalPagesSpan = document.getElementById('total-pages');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const pageSlider = document.getElementById('page-slider');
const qnaForm = document.getElementById('qna-form');
const formMessage = document.getElementById('form-message');
const qnaList = document.getElementById('qna-list');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    totalPagesSpan.textContent = totalPages;
    updatePages();
    loadQnA();
    attachEventListeners();
});

// Update page display
function updatePages() {
    // Left page (even, starting at 0)
    const leftPageNum = Math.floor(currentPage / 2) * 2;
    leftPageImg.src = `pages/page-${String(leftPageNum).padStart(3, '0')}.jpg`;
    
    // Right page (odd)
    const rightPageNum = leftPageNum + 1;
    rightPageImg.src = `pages/page-${String(rightPageNum).padStart(3, '0')}.jpg`;
    
    // Update counter (display as 1-indexed)
    const displayPage = Math.floor(currentPage / 2) + 1;
    currentPageSpan.textContent = displayPage;
    
    // Update slider
    pageSlider.value = Math.floor(currentPage / 2);
    
    // Update button states
    updateButtonStates();
}

// Update button disabled states
function updateButtonStates() {
    const spread = Math.floor(currentPage / 2);
    const maxSpreads = Math.ceil(totalPages / 2);
    
    prevButton.disabled = spread === 0;
    nextButton.disabled = spread === maxSpreads - 1;
}

// Navigation functions
function previousPage() {
    const spread = Math.floor(currentPage / 2);
    if (spread > 0) {
        currentPage = (spread - 1) * 2;
        updatePages();
    }
}

function nextPage() {
    const spread = Math.floor(currentPage / 2);
    const maxSpreads = Math.ceil(totalPages / 2);
    if (spread < maxSpreads - 1) {
        currentPage = (spread + 1) * 2;
        updatePages();
    }
}

// Event Listeners
function attachEventListeners() {
    prevButton.addEventListener('click', previousPage);
    nextButton.addEventListener('click', nextPage);
    
    pageSlider.addEventListener('input', (e) => {
        currentPage = parseInt(e.target.value) * 2;
        updatePages();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') previousPage();
        if (e.key === 'ArrowRight') nextPage();
    });
    
    // Click on pages for navigation
    leftPageImg.addEventListener('click', previousPage);
    rightPageImg.addEventListener('click', nextPage);
    
    // Q&A Form
    qnaForm.addEventListener('submit', submitQuestion);
}

// Q&A Functions
function submitQuestion(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const question = document.getElementById('question').value.trim();
    
    if (!name || !email || !question) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    // Basic email validation
    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email', 'error');
        return;
    }
    
    // Store question in localStorage (since we don't have a backend)
    const qnaData = getQnAData();
    const newQuestion = {
        id: Date.now(),
        name,
        email,
        question,
        answer: null,
        timestamp: new Date().toLocaleString(),
        approved: false // Questions need approval before showing
    };
    
    qnaData.push(newQuestion);
    localStorage.setItem('rocketprep_qna', JSON.stringify(qnaData));
    
    showMessage('✓ Question submitted! It will appear after review.', 'success');
    qnaForm.reset();
    
    // Reload Q&A display
    setTimeout(loadQnA, 500);
}

function getQnAData() {
    const data = localStorage.getItem('rocketprep_qna');
    return data ? JSON.parse(data) : [];
}

function loadQnA() {
    const qnaData = getQnAData();
    const approvedQnA = qnaData.filter(item => item.approved);
    
    if (approvedQnA.length === 0) {
        qnaList.innerHTML = '<div class="empty-state">No Q&A yet. Be the first to ask!</div>';
        return;
    }
    
    qnaList.innerHTML = approvedQnA
        .reverse()
        .map(item => `
            <div class="qna-item">
                <div class="qna-question">Q: ${escapeHtml(item.question)}</div>
                <div class="qna-author">— ${escapeHtml(item.name)}</div>
                ${item.answer ? `<div class="qna-answer">A: ${escapeHtml(item.answer)}</div>` : '<div class="qna-answer"><em>Answer coming soon...</em></div>'}
            </div>
        `)
        .join('');
}

function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = `form-message ${type}`;
    
    if (type === 'success') {
        setTimeout(() => {
            formMessage.className = 'form-message';
        }, 3000);
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Sample Q&A for demo
function initializeSampleQnA() {
    const existing = localStorage.getItem('rocketprep_qna');
    if (!existing) {
        const sampleQnA = [
            {
                id: 1,
                name: 'Alex',
                email: 'alex@example.com',
                question: 'What inspired RocketPrep.Comic?',
                answer: 'Great question! It started as a fun idea to combine action and humor in a unique way.',
                timestamp: new Date().toLocaleString(),
                approved: true
            },
            {
                id: 2,
                name: 'Casey',
                email: 'casey@example.com',
                question: 'When will the next comic be released?',
                answer: 'We\'re working on it! Stay tuned for updates.',
                timestamp: new Date().toLocaleString(),
                approved: true
            }
        ];
        localStorage.setItem('rocketprep_qna', JSON.stringify(sampleQnA));
    }
}

// Initialize sample Q&A on first visit
initializeSampleQnA();