//Add Fatwa 
document.getElementById('fatwa-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Gather data according to what the API expects
    const data = {
        Title: document.getElementById('fatwa-title').value,
        Slug: document.getElementById('fatwa-slug').value,
        Keywords: document.getElementById('fatwa-keywords').value,
        Description: document.getElementById('fatwa-meta-description').value,
        Question: document.getElementById('fatwa-question').value,
        Answer: document.getElementById('fatwa-answer').value,
        Writer: document.getElementById('fatwa-mufti').value
    };

    try {
        const response = await fetch('http://localhost:5000/api/fatwa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            alert('فتویٰ کامیابی سے شامل ہو گیا!' + '\nID: ' + result.id);
            // Optionally reset form or redirect
            document.getElementById('fatwa-form').reset();
            // window.location.hash = 'manage-fatawa';         // To redirect
        } else {
            alert('سمِّندری خامی:\n' + (result.error || 'نامعلوم'));
        }
    } catch (err) {
        alert('سرور سے کنیکشن میں مسئلہ:\n' + err.message);
    }
});



//Add Topic 
document.getElementById('category-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Map form data to API expected field names
    const data = {
        TopicName: document.getElementById('category-name').value,
        IconClass: document.getElementById('category-icon').value
    };

    try {
        const response = await fetch('http://localhost:5000/api/topic', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            alert('موضوع کامیابی سے شامل ہو گیا! (Topic created)\nID: ' + result.id);
            document.getElementById('category-form').reset();
            // Optionally redirect or update list
            // window.location.hash = 'manage-categories'; 
        } else {
            alert('سرور پر خرابی: \n' + (result.error || result.message || 'Unknown error'));
        }
    } catch (err) {
        alert('سرور سے کنیکشن میں مسئلہ:\n' + err.message);
        console.error(err);
    }
});



//Add writers

document.getElementById('ulema-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Prepare FormData for file + text fields
    const formData = new FormData();
    formData.append('WriterName', document.getElementById('ulema-name').value);
    formData.append('Position', document.getElementById('ulema-designation').value);

    const photoInput = document.getElementById('ulema-photo');
    if (photoInput.files && photoInput.files.length > 0) {
        formData.append('Photo', photoInput.files[0]); // file field matches multer's upload.single('Photo')
    }
    formData.append('WriterBio', document.getElementById('ulema-bio').value);

    try {
        const response = await fetch('http://localhost:5000/api/writer', {
            method: 'POST',
            body: formData // Do not set Content-Type; browser will handle it
        });

        const result = await response.json();
        if (response.ok) {
            alert('عالم کامیابی سے شامل ہو گیا! (Writer created)\nID: ' + result.id);
            document.getElementById('ulema-form').reset();
        } else {
            alert('سرور پر خرابی:\n' + (result.error || 'Unknown error'));
        }
    } catch (err) {
        alert('سرور سے کنیکشن میں مسئلہ:\n' + err.message);
        console.error(err);
    }
});



//Add ARticle
document.getElementById('article-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('Title', document.getElementById('article-title').value);
    formData.append('Slug', document.getElementById('article-slug').value);
    formData.append('Tags', document.getElementById('article-keywords').value);
    formData.append('Description', document.getElementById('article-meta-description').value);
    formData.append('Writer', document.getElementById('article-author').value);

    const imageInput = document.getElementById('article-image');
    if (imageInput.files && imageInput.files.length > 0) {
        formData.append('FeaturedImage', imageInput.files[0]);
    }

    formData.append('ArticleDescription', document.getElementById('article-content').value);

    try {
        const response = await fetch('http://localhost:5000/api/article', {
            method: 'POST',
            body: formData // let browser set correct multipart headers
        });

        let result, text;
        try {
            result = await response.json();
        } catch {
            text = await response.text();
        }

        if (response.ok) {
            alert('مضمون کامیابی سے شامل/شائع ہو گیا!\nID: ' + (result?.id || ''));
            document.getElementById('article-form').reset();
        } else {
            alert('سرور پر خرابی:\n' + (result?.error || text || 'Unknown error'));
        }

    } catch (err) {
        alert('سرور سے کنیکشن میں مسئلہ:\n' + err.message);
        console.error(err);
    }
});




//Add Books
document.getElementById('book-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('BookName', document.getElementById('book-name').value);
    formData.append('Author', document.getElementById('book-author').value);

    const coverInput = document.getElementById('book-cover');
    if (coverInput.files && coverInput.files.length > 0) {
        formData.append('BookCover', coverInput.files[0]);
    }

    const pdfInput = document.getElementById('book-file');
    if (pdfInput.files && pdfInput.files.length > 0) {
        formData.append('PDFFile', pdfInput.files[0]);
    }

    try {
    const response = await fetch('http://localhost:5000/api/book', {
        method: 'POST',
        body: formData
    });

    let responseBody = await response.text(); // Read only once!
    let result;
    try {
        result = JSON.parse(responseBody);
    } catch {
        result = null;
    }

    if (response.ok) {
        alert('کتاب کامیابی سے شامل ہو گئی!\nID: ' + (result?.id || ''));
        this.reset();
    } else {
        alert('سرور پر خرابی:\n' + (result?.error || responseBody || 'Unknown error'));
    }
} catch (err) {
    alert('سرور سے کنیکشن میں مسئلہ:\n' + err.message);
    console.error(err);
}

});


