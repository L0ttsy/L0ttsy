// Flipbook State
let currentPage = 0;
const totalPages = 48; // 1 cover + 46 inside pages + 1 back cover

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
    // Page 0 (cover) - single page
    if (currentPage === 0) {
        rightPageImg.style.display = 'flex';
        leftPageImg.style.display = 'none';
        rightPageImg.src = `pages/page-000.jpg`;
        currentPageSpan.textContent = '1';
    }
    // Page 47 (back cover) - single page
    else if (currentPage === 47) {
        rightPageImg.style.display = 'none';
        leftPageImg.style.display = 'flex';
        leftPageImg.src = `pages/page-047.jpg`;
        currentPageSpan.textContent = '48';
    }
    // Pages 1-46 (two-page spreads)
    else {
        leftPageImg.style.display = 'flex';
        rightPageImg.style.display = 'flex';
        leftPageImg.src = `pages/page-${String(currentPage).padStart(3, '0')}.jpg`;
        rightPageImg.src = `pages/page-${String(currentPage + 1).padStart(3, '0')}.jpg`;
        currentPageSpan.textContent = currentPage + 1;
    }
    
    // Update slider
    pageSlider.value = currentPage;
    
    // Update button states
    updateButtonStates();
}

// Update button disabled states
function updateButtonStates() {
    prevButton.disabled = currentPage === 0;
    nextButton.disabled = currentPage === totalPages - 1;
}

// Navigation functions
function previousPage() {
    if (currentPage > 0) {
        // If on back cover (47), go to page 46
        if (currentPage === 47) {
            currentPage = 46;
        } else if (currentPage === 1) {
            // If on page 1, go to cover (0)
            currentPage = 0;
        } else {
            // Otherwise go back 2 pages
            currentPage -= 2;
        }
        updatePages();
    }
}

function nextPage() {
    if (currentPage < totalPages - 1) {
        // If on cover (0), go to page 1
        if (currentPage === 0) {
            currentPage = 1;
        } else if (currentPage === 46) {
            // If on page 46, go to back cover (47)
            currentPage = 47;
        } else {
            // Otherwise go forward 2 pages
            currentPage += 2;
        }
        updatePages();
    }
}

// Event Listeners
function attachEventListeners() {
    prevButton.addEventListener('click', previousPage);
    nextButton.addEventListener('click', nextPage);
    
    pageSlider.addEventListener('input', (e) => {
        currentPage = parseInt(e.target.value);
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
    
// Send question to backend
fetch("http://localhost:3000/questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        name,
        email,
        question
    })
})
.then(res => res.json())
.then(() => {
    showMessage('✓ Question submitted! Thank you for your interest!', 'success');
    qnaForm.reset();
    setTimeout(loadQnA, 500);
})
.catch(() => {
    showMessage('Error submitting question. Please try again.', 'error');
});

}

function getQnAData() {
    return fetch("http://localhost:3000/questions")
        .then(res => res.json());
}

function loadQnA() {
    getQnAData().then(qnaData => {
        const approvedQnA = qnaData.filter(item => item.approved);

        if (approvedQnA.length === 0) {
            qnaList.innerHTML = '<div class="empty-state">No questions yet. Be the first to ask!</div>';
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
    });
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
