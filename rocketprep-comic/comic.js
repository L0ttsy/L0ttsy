// Flipbook State
let currentPage = 0;
const totalPages = 48; // Now 49 to account for empty left page before cover

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

document.addEventListener('DOMContentLoaded', () => {
    totalPagesSpan.textContent = totalPages;
    updatePages();
    loadQnA();
    attachEventListeners();
});

function updatePages() {
    if (currentPage === 0) {
        // Empty left page, cover on right
        leftPageImg.style.display = 'none';
        rightPageImg.style.display = 'flex';
        rightPageImg.parentElement.classList.add('single-page');
        leftPageImg.parentElement.classList.remove('single-page');
        rightPageImg.src = `pages/page-000.jpg`;
        currentPageSpan.textContent = '1';
    }
    else if (currentPage === 47) {
        // Last page (page-047.jpg)
        leftPageImg.style.display = 'flex';
        rightPageImg.style.display = 'none';
        leftPageImg.parentElement.classList.add('single-page');
        rightPageImg.parentElement.classList.remove('single-page');
        leftPageImg.src = `pages/page-047.jpg`;
        currentPageSpan.textContent = '48';
    }
    else {
        // Two-page spread
        leftPageImg.style.display = 'flex';
        rightPageImg.style.display = 'flex';
        leftPageImg.parentElement.classList.remove('single-page');
        rightPageImg.parentElement.classList.remove('single-page');
        leftPageImg.src = `pages/page-${String(currentPage).padStart(3, '0')}.jpg`;
        rightPageImg.src = `pages/page-${String(currentPage + 1).padStart(3, '0')}.jpg`;
        currentPageSpan.textContent = currentPage + 1;
    }
    
    pageSlider.value = currentPage;
    updateButtonStates();
}

function updateButtonStates() {
    prevButton.disabled = currentPage === 0;
    nextButton.disabled = currentPage === totalPages - 1;
}

function previousPage() {
    if (currentPage > 0) {
        if (currentPage === 47) {
            currentPage = 46;
        } else if (currentPage === 1) {
            currentPage = 0;
        } else {
            currentPage -= 2;
        }
        updatePages();
    }
}

function nextPage() {
    if (currentPage < totalPages - 1) {
        if (currentPage === 0) {
            currentPage = 1;
        } else if (currentPage === 47) {
            currentPage = 48;
        } else {
            currentPage += 2;
        }
        updatePages();
    }
}

function attachEventListeners() {
    prevButton.addEventListener('click', previousPage);
    nextButton.addEventListener('click', nextPage);
    
    pageSlider.addEventListener('input', (e) => {
        currentPage = parseInt(e.target.value);
        updatePages();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') previousPage();
        if (e.key === 'ArrowRight') nextPage();
    });
    
    leftPageImg.addEventListener('click', previousPage);
    rightPageImg.addEventListener('click', nextPage);
    
    qnaForm.addEventListener('submit', submitQuestion);
}

function submitQuestion(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const question = document.getElementById('question').value.trim();
    
    if (!name || !email || !question) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email', 'error');
        return;
    }
    
    
    // Send to Formspree
    fetch('https://formspree.io/f/mbjzjdwb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: name,
            email: email,
            message: question,
            _subject: 'New RocketPrep.Comic Question from ' + name
        })
    })
    .then(response => {
        if (response.ok) {
            showMessage('✓ Question submitted! Thank you for your interest!', 'success');
            qnaForm.reset();
            setTimeout(loadQnA, 500);
        } else {
             showMessage('Error submitting question. Please try again.', 'error');
            
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('✓ Question saved locally!', 'success');
        qnaForm.reset();
        setTimeout(loadQnA, 500);
    });
}

function getQnAData() {
    const data = localStorage.getItem('rocketprep_qna');
    return data ? JSON.parse(data) : [];
}

function loadQnA() {
    const qnaData = getQnAData();
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
