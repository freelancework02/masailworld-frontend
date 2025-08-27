// public/js/sawaljawab.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('sawal-jawab-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Collect form data
        const formData = {
            FullName: document.getElementById('full-name').value.trim(),
            Email: document.getElementById('email').value.trim(),
            WhatsAppNumber: document.getElementById('whatsapp-number').value.trim(),
            CountryCity: document.getElementById('country-city').value.trim(),
            Question: document.getElementById('question').value.trim(),
            Answer: document.getElementById('answer').value.trim(),
            ReferenceAndDate: document.getElementById('reference').value.trim(),
            CorrectedReference: document.getElementById('reference').value.trim(), // Same for now
            DarulIftaName: document.getElementById('reference').value.trim(), // Could split later
            AnswerDate: document.getElementById('date').value, // yyyy-mm-dd format from input
            Rating: null, // If not in form
            Category: document.getElementById('category').value,
            Topic: document.getElementById('topic').value.trim(),
            IsDelete: 0,
            Approved: 0
        };

        try {
            const res = await fetch('https://masailworld.onrender.com/questions/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                alert('سوال و جواب کامیابی سے محفوظ ہوگیا!');
                form.reset();
            } else {
                alert('غلطی: ' + data.error);
            }
        } catch (err) {
            console.error('Error:', err);
            alert('سرور سے رابطہ نہیں ہو سکا!');
        }
    });
});
