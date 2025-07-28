async function submitFatwaToAPI(event) {
    event.preventDefault(); // prevent actual form submission if used in a <form>

    // Collect form data from the Add Fatwa form fields
    const fatwaData = {
        title: document.getElementById('fatwa-title').value,
        slug: document.getElementById('fatwa-slug').value,
        keywords: document.getElementById('fatwa-keywords').value,
        metaDescription: document.getElementById('fatwa-meta-description').value,
        question: document.getElementById('fatwa-question').value,
        answer: document.getElementById('fatwa-answer').value,
        mufti: document.getElementById('fatwa-mufti').value,
        date: new Date().toISOString().slice(0, 10)
    };

    // POST to your local API
    try {
        const response = await fetch('http://localhost:5000/api/fatwa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fatwaData)
        });

        if (response.ok) {
            alert('فتویٰ کامیابی سے درج ہو گیا!');
            // Optionally reset the form or redirect
        } else {
            const error = await response.text();
            alert('درج کرنے میں مسئلہ: ' + error);
        }
    } catch (error) {
        alert('API سے رابطہ ناکام: ' + error.message);
    }
}

// Attach this to your "Add Fatwa" form:
document.getElementById('fatwa-form').addEventListener('submit', submitFatwaToAPI);
