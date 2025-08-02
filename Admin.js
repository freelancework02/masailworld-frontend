//Add Fatwa 
document.getElementById('fatwa-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const fatwaId = document.getElementById('fatwa-id').value;
    const data = {
        Title: document.getElementById('fatwa-title').value,
        Slug: document.getElementById('fatwa-slug').value,
        Tags: document.getElementById('fatwa-keywords').value,
        Description: document.getElementById('fatwa-meta-description').value,
        Question: document.getElementById('fatwa-question').value,
        Answer: document.getElementById('fatwa-answer').value,
        Writer: document.getElementById('fatwa-mufti').value
    };

    let url = 'https://masailworld.onrender.com/api/fatwa';
    let method = 'POST';

    // If fatwaId exists, it's an edit
    if (fatwaId) {
        url += `/${fatwaId}`;
        method = 'PUT'; // Or PATCH, depending on your API
    }

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            alert('فتویٰ کامیابی سے ' + (fatwaId ? 'اپ ڈیٹ ' : 'شامل') + ' ہو گیا!\nID: ' + result.fatwaId);
            this.reset();
            // Optionally redirect
            // window.location.hash = "manage-fatawa";
        } else {
            alert('سرور پر خرابی:\n' + (result.error || 'نامعلوم'));
        }
    } catch (err) {
        alert('سرور سے کنیکشن میں مسئلہ:\n' + err.message);
    }
});




//Add Topic 
document.getElementById('category-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const categoryId = document.getElementById('category-id').value;
    const data = {
        TopicName: document.getElementById('category-name').value,
        IconClass: document.getElementById('category-icon').value
    };

    let url = 'https://masailworld.onrender.com/api/topic';
    let method = 'POST';
    if (categoryId) {
        url += `/${categoryId}`;
        method = 'PATCH'; // PATCH matches your backend updated route!
    }

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const text = await response.text();
        let result;
        try { result = JSON.parse(text); } catch { result = null; }

        if (response.ok) {
            alert('موضوع کامیابی سے ' + (categoryId ? 'اپ ڈیٹ' : 'شامل') + ' ہو گیا!');
            this.reset();
            document.getElementById('category-id').value = '';
            // Optionally change heading/title back
            if (document.getElementById('category-form-title'))
                document.getElementById('category-form-title').innerText = "نیا موضوع شامل کریں";
            // Optionally go back and refresh list
            window.location.hash = "manage-categories";
            fetchTopic(); // or fetchTopics(), depends on your function name
        } else {
            alert('سرور پر خرابی:\n' + (result?.error || text || 'Unknown error'));
        }
    } catch (err) {
        alert('سرور سے کنیکشن میں مسئلہ:\n' + err.message);
    }
});



//Add writers

document.getElementById('ulema-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const writerId = document.getElementById('ulema-id').value;

    const formData = new FormData();
    formData.append('WriterName', document.getElementById('ulema-name').value);
    formData.append('Position', document.getElementById('ulema-designation').value);
    formData.append('WriterBio', document.getElementById('ulema-bio').value);

    const photoInput = document.getElementById('ulema-photo');
    if (photoInput.files && photoInput.files.length > 0) {
        formData.append('Photo', photoInput.files[0]);
    }

    let url = 'https://masailworld.onrender.com/api/writer';
    let method = 'POST';
    if (writerId) {
        url += `/${writerId}`;
        method = 'PATCH'; // PATCH matches your backend
    }

    try {
        const response = await fetch(url, {
            method,
            body: formData // No need for headers, browser sets correct multipart boundaries
        });

        const text = await response.text();
        let result;
        try { result = JSON.parse(text); } catch { result = null; }

        if (response.ok) {
            alert('عالم کامیابی سے ' + (writerId ? 'اپ ڈیٹ' : 'شامل') + ' ہو گیا!\nID: ' + (result?.id || writerId || ''));
            this.reset();
            document.getElementById('ulema-id').value = '';
            // Optionally switch to list and refresh table
            window.location.hash = "manage-ulema";
            fetchWriters();
            // Restore heading if needed
            if (document.getElementById('ulema-form-title'))
                document.getElementById('ulema-form-title').innerText = "نیا عالم شامل کریں";
        } else {
            alert('سرور پر خرابی:\n' + (result?.error || text || 'Unknown error'));
        }
    } catch (err) {
        alert('سرور سے کنیکشن میں مسئلہ:\n' + err.message);
        console.error(err);
    }
});




//Add ARticle
document.getElementById('article-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const articleId = document.getElementById('article-id').value;

    const formData = new FormData();
    formData.append('Title', document.getElementById('article-title').value);
    formData.append('Slug', document.getElementById('article-slug').value);
    formData.append('Tags', document.getElementById('article-keywords').value);
    formData.append('Description', document.getElementById('article-meta-description').value);
    formData.append('Writer', document.getElementById('article-author').value);
    formData.append('ArticleDescription', document.getElementById('article-content').value);

    const imageInput = document.getElementById('article-image');
    // Only include FeaturedImage if a new image is picked (on edit)
    if (imageInput.files && imageInput.files.length > 0) {
        formData.append('FeaturedImage', imageInput.files[0]);
    }

    let url = 'https://masailworld.onrender.com/api/article';
    let method = 'POST';
    if (articleId) {
        url += `/${articleId}`;
        method = 'PATCH';
    }

    try {
        const response = await fetch(url, {
            method,
            body: formData
            // Don't set Content-Type; fetch will handle it for FormData
        });

        const result = await response.json();
        if (response.ok) {
            alert(`مضمون ${articleId ? 'اپ ڈیٹ' : 'شامل'} ہو گیا!\nID: ` + (result?.id || articleId || ''));
            this.reset();
            // Optionally: go back to article list or refresh table!
            fetchArticles();
            window.location.hash = "manage-articles";
        } else {
            alert('سرور پر خرابی:\n' + (result?.error || 'Unknown error'));
        }
    } catch (err) {
        alert('سرور سے کنیکشن میں مسئلہ:\n' + err.message);
        console.error(err);
    }
});





//Add Books
document.getElementById('book-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const bookId = document.getElementById('book-id').value;
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

    let url = 'https://masailworld.onrender.com/api/book';
    let method = 'POST';
    if (bookId) {
        url += `/${bookId}`;
        method = 'PATCH'; // <-- PATCH matches your backend!
    }

    try {
        const response = await fetch(url, {
            method,
            body: formData
        });

        let responseBody = await response.text();
        let result;
        try {
            result = JSON.parse(responseBody);
        } catch {
            result = null;
        }

        if (response.ok) {
            alert('کتاب کامیابی سے ' + (bookId ? 'اپ ڈیٹ' : 'شامل') + ' ہو گئی!\nID: ' + (result?.id || bookId || ''));
            this.reset();
            // Optionally switch tab/panel and refresh table
            window.location.hash = "manage-books";
            fetchBooks();
            // (restore heading for add)
            document.getElementById('book-form-title').innerText = "نئی کتاب شامل کریں";
        } else {
            alert('سرور پر خرابی:\n' + (result?.error || responseBody || 'Unknown error'));
        }
    } catch (err) {
        alert('سرور سے کنیکشن میں مسئلہ:\n' + err.message);
        console.error(err);
    }
});



//Display Fatwa 



function fetchFatawa() {
    fetch('https://masailworld.onrender.com/api/fatwa')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('fatawa-table-body');
            tableBody.innerHTML = ''; // Clear previous data

            if (data.success && Array.isArray(data.data)) {
                data.data.forEach((fatwa, index) => {
                    const row = document.createElement('tr');

                    row.innerHTML = `
                        <td class="py-3 px-4">${fatwa.FatwaID}</td>
                        <td class="py-3 px-4">${fatwa.Title || ''}</td>
                        <td class="py-3 px-4">${fatwa.Writer || ''}</td>
                        <td class="py-3 px-4">${fatwa.InsertedDate}</td>
                        <td class="py-3 px-4">
                            <button class="text-blue-600 hover:underline" onclick="editFatwa(${fatwa.FatwaID})">ترمیم</button> |
                            <button class="text-red-600 hover:underline" onclick="deleteFatwa(${fatwa.FatwaID})">حذف</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            } else {
                tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-gray-500">کوئی فتویٰ موجود نہیں ہے۔</td></tr>`;
            }
        })
        .catch(error => {
            console.error('Error fetching fatawa:', error);
        });
}

//Edit fatwa 

function editFatwa(fatwaId) {
    // 1. Fetch record from API (if not already available)
    fetch(`https://masailworld.onrender.com/api/fatwa/${fatwaId}`)
        .then(response => response.json())
        .then(data => {
            const fatwa = Array.isArray(data) ? data[0] : (data.data || data);
            // 2. Show the edit form/page/modal
            document.getElementById('fatwa-id').value = fatwa.FatwaID;
            document.getElementById('fatwa-title').value = fatwa.Title;
            document.getElementById('fatwa-slug').value = fatwa.Slug;
            document.getElementById('fatwa-keywords').value = fatwa.Tags;
            document.getElementById('fatwa-meta-description').value = fatwa.Description;
            document.getElementById('fatwa-question').value = fatwa.Question;
            document.getElementById('fatwa-answer').value = fatwa.Answer;
            document.getElementById('fatwa-mufti').value = fatwa.Writer;

            // 3. Navigate to or show the form
            // Example: if using a modal, show the modal,
            // Or change hash, etc.
            window.location.hash = 'add-fatwa'; // Example (if you use hashes)
        });
}



//Delete Fatwa 
function deleteFatwa(id) {
    const confirmDelete = confirm('کیا آپ واقعی اس فتویٰ کو حذف کرنا چاہتے ہیں؟');
    if (confirmDelete) {
        fetch(`https://masailworld.onrender.com/api/fatwa/${id}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(response => {
            if (response.success) {
                fetchFatawa(); // Refresh table
            } else {
                alert('حذف کرنے میں مسئلہ آیا۔');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    fetchFatawa();

});

//Display Article 




function fetchArticles() {
    fetch('https://masailworld.onrender.com/api/article')
        .then(response => response.json())
        .then(data => {
           
            const tableBody = document.getElementById('articles-table-body');
            tableBody.innerHTML = '';

            let articles = [];
            if (Array.isArray(data)) {
                articles = data;
            } else if (data.success && Array.isArray(data.data)) {
                articles = data.data;
            } else if (Array.isArray(data.data)) {
                articles = data.data;
            }

            if (articles.length > 0) {
                articles.forEach((article) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="py-3 px-4">${article.Title}</td>
                        <td class="py-3 px-4">${article.Writer}</td>
                        <td class="py-3 px-4">${formatDate(article.InsertedDate)}</td>
                        <td class="py-3 px-4">
                            <button class="text-blue-600 hover:underline" onclick="editArticle(${article.ArticleID})">ترمیم</button> |
                            <button class="text-red-600 hover:underline" onclick="deleteArticle(${article.ArticleID})">حذف</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            } else {
                tableBody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-gray-500">کوئی مضمون موجود نہیں ہے۔</td></tr>`;
            }
        })
        .catch(error => {
            console.error('Error fetching articles:', error);
            document.getElementById('articles-table-body').innerHTML =
                `<tr><td colspan="4" class="text-center text-red-500">مضامین لوڈ کرنے میں خرابی</td></tr>`;
        });
}


document.addEventListener('DOMContentLoaded', function () {
    fetchArticles();

});

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ur-PK', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Example placeholder functions
function editArticle(articleId) {
    fetch(`https://masailworld.onrender.com/api/article/${articleId}`)
        .then(res => res.json())
        .then(article => {
            document.getElementById('article-id').value = article.ArticleID;
            document.getElementById('article-title').value = article.Title;
            document.getElementById('article-slug').value = article.Slug;
            document.getElementById('article-keywords').value = article.Tags;
            document.getElementById('article-meta-description').value = article.Description;
            document.getElementById('article-author').value = article.Writer;
            document.getElementById('article-content').value = article.ArticleDescription;
            document.getElementById('article-form-title').innerText = "مضمون میں ترمیم کریں";
            window.location.hash = 'add-article';
        })
        .catch(e => alert("مضمون لوڈ کرنے میں مسئلہ: " + e.message));
}



function deleteArticle(id) {
    const confirmDelete = confirm('کیا آپ واقعی اس مضمون کو حذف کرنا چاہتے ہیں؟');
    if (confirmDelete) {
        fetch(`https://masailworld.onrender.com/api/article/${id}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(response => {
            if (response.success) {
                fetchArticles(); // Refresh list
            } else {
                alert('حذف کرنے میں مسئلہ آیا۔');
            }
        });
    }
}



//Display Books



function fetchBooks() {
    fetch('https://masailworld.onrender.com/api/book')
        .then(response => response.json())
        .then(data => {
            console.log("book response", data)
            const tableBody = document.getElementById('books-table-body');
            tableBody.innerHTML = ''; // Clear existing content

            // Accept either a plain array or {success:true,data:Array}
            let books = [];
            if (Array.isArray(data)) {
                books = data;
            } else if (data.success && Array.isArray(data.data)) {
                books = data.data;
            } else if (Array.isArray(data.data)) {
                books = data.data;
            }

            if (books.length > 0) {
                books.forEach((book) => {
                    const row = document.createElement('tr');

                    row.innerHTML = `
                        <td class="py-3 px-4">${book.BookName}</td>
                        <td class="py-3 px-4">${book.Author}</td>
                        <td class="py-3 px-4">
                            <button class="text-blue-600 hover:underline" onclick="editBook(${book.BookID})">ترمیم</button> |
                            <button class="text-red-600 hover:underline" onclick="deleteBook(${book.BookID})">حذف</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            } else {
                tableBody.innerHTML = `<tr><td colspan="3" class="text-center py-4 text-gray-500">کوئی کتاب موجود نہیں ہے۔</td></tr>`;
            }
        })
        .catch(error => {
            console.error('Error fetching books:', error);
            document.getElementById('books-table-body').innerHTML = `
                <tr><td colspan="3" class="text-center text-red-500">کتابیں لوڈ کرنے میں خرابی</td></tr>`;
        });
}


document.addEventListener('DOMContentLoaded', function () {
    fetchBooks();
});


// Placeholder functions
function editBook(bookId) {
    fetch(`https://masailworld.onrender.com/api/book/${bookId}`)
        .then(res => res.json())
        .then(book => {
            // Fill the form
            document.getElementById('book-id').value = book.BookID;
            document.getElementById('book-name').value = book.BookName;
            document.getElementById('book-author').value = book.Author;
            // You can't pre-fill file inputs (for security), but you can show an image/pdf preview if you want.
            // Optionally, change the form title:
            document.getElementById('book-form-title').innerText = "کتاب میں ترمیم کریں";
            // Show the form (if using SPA tabs/panels):
            window.location.hash = "add-book";
        })
        .catch(err => alert("کتاب لوڈ کرنے میں مسئلہ: " + err.message));
}


function deleteBook(bookId) {
    const confirmDelete = confirm('کیا آپ واقعی اس کتاب کو حذف کرنا چاہتے ہیں؟');
    if (confirmDelete) {
        fetch(`https://masailworld.onrender.com/api/book/${bookId}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(response => {
            if (response.success) {
                fetchBooks(); // Refresh table
            } else {
                alert('حذف کرنے میں مسئلہ آیا۔');
            }
        });
    }
}




//Writers



function fetchWriters() {
    fetch('https://masailworld.onrender.com/api/writer')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('ulema-table-body');
            tableBody.innerHTML = ''; // Clear existing rows

            // Accept both plain array or {success:true/data:Array}
            let writers = [];
            if (Array.isArray(data)) {
                writers = data;
            } else if (data.success && Array.isArray(data.data)) {
                writers = data.data;
            } else if (Array.isArray(data.data)) {
                writers = data.data;
            }

            if (writers.length > 0) {
                writers.forEach(writer => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="py-3 px-4">${writer.WriterName}</td>
                        <td class="py-3 px-4">${writer.Position}</td>
                        <td class="py-3 px-4">
                            <button class="text-blue-600 hover:underline" onclick="editWriter(${writer.WriterID})">ترمیم</button> |
                            <button class="text-red-600 hover:underline" onclick="deleteWriter(${writer.WriterID})">حذف</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            } else {
                tableBody.innerHTML = `<tr><td colspan="3" class="text-center py-4 text-gray-500">کوئی عالم موجود نہیں ہے۔</td></tr>`;
            }
        })
        .catch(error => {
            console.error('Error fetching writers:', error);
            document.getElementById('ulema-table-body').innerHTML = `
                <tr><td colspan="3" class="text-center text-red-500">علماء لوڈ کرنے میں خرابی</td></tr>`;
        });
}


document.addEventListener('DOMContentLoaded', function () {
    fetchWriters();
});

// Placeholder actions
function editWriter(writerId) {
    fetch(`https://masailworld.onrender.com/api/writer/${writerId}`)
        .then(res => res.json())
        .then(writer => {
            document.getElementById('ulema-id').value = writer.WriterID;
            document.getElementById('ulema-name').value = writer.WriterName;
            document.getElementById('ulema-designation').value = writer.Position;
            document.getElementById('ulema-bio').value = writer.WriterBio;
            // (Optional) Display photo preview if you want, using /api/writer/image/:id

            // Switch to form view if SPA/tab setup:
            window.location.hash = "add-ulema";
            // Update title if needed, e.g.
            document.getElementById('ulema-form-title').innerText = "عالم کی ترمیم کریں";
        })
        .catch(err => alert("عالم لوڈ کرنے میں مسئلہ: " + err.message));
}


function deleteWriter(WriterID) {
    const confirmDelete = confirm('کیا آپ واقعی اس عالم کو حذف کرنا چاہتے ہیں؟');
    if (confirmDelete) {
        fetch(`https://masailworld.onrender.com/api/writer/${WriterID}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(response => {
            if (response.success) {
                fetchWriters(); // Refresh table
            } else {
                alert('حذف کرنے میں مسئلہ آیا۔');
            }
        });
    }
}



//Display Topics



function fetchTopic() {
    fetch('https://masailworld.onrender.com/api/topic')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('categories-table-body');
            tableBody.innerHTML = ''; // Clear existing content

            // Accept either a plain array or {success:true,data:Array}
            let topics = [];
            if (Array.isArray(data)) {
                topics = data;
            } else if (data.success && Array.isArray(data.data)) {
                topics = data.data;
            } else if (Array.isArray(data.data)) {
                topics = data.data;
            }

            if (topics.length > 0) {
                topics.forEach(topic => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="py-3 px-4">${topic.TopicName}</td>
                        <td class="py-3 px-4"><i class="${topic.IconClass} ${topic.IconClass}"></i></td>
                        <td class="py-3 px-4">
                            <button class="text-blue-600 hover:underline" onclick="editTopic(${topic.TopicID})">ترمیم</button> |
                            <button class="text-red-600 hover:underline" onclick="deleteCategory(${topic.TopicID})">حذف</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            } else {
                tableBody.innerHTML = `<tr><td colspan="3" class="text-center py-4 text-gray-500">کوئی موضوع موجود نہیں ہے۔</td></tr>`;
            }
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
            document.getElementById('categories-table-body').innerHTML = `
                <tr><td colspan="3" class="text-center text-red-500">موضوعات لوڈ کرنے میں خرابی</td></tr>`;
        });
}




document.addEventListener('DOMContentLoaded', function () {
    fetchTopic();
});

// Optional edit/delete handlers
function editTopic(topicId) {
    fetch(`https://masailworld.onrender.com/api/topic/${topicId}`)
        .then(res => res.json())
        .then(topic => {
            document.getElementById('category-id').value = topic.TopicID;
            document.getElementById('category-name').value = topic.TopicName;
            document.getElementById('category-icon').value = topic.IconClass;
            // Optional: update form heading
            if (document.getElementById('category-form-title'))
                document.getElementById('category-form-title').innerText = "موضوع میں ترمیم کریں";
            // Switch to form panel/tab if using SPA interface
            window.location.hash = "add-category";
        })
        .catch(err => alert("موضوع لوڈ کرنے میں مسئلہ: " + err.message));
}


function deleteTopic(id) {
    if (confirm("کیا آپ واقعی اس موضوع کو حذف کرنا چاہتے ہیں؟")) {
        fetch(`https://masailworld.onrender.com/api/topic/${id}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(response => {
            if (response.success) {
                fetchCategories(); // Refresh the list
            } else {
                alert("حذف کرنے میں مسئلہ آیا۔");
            }
        });
    }
}




// User insert 

document.getElementById('ms-user-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  // Grab form values
  const username = document.getElementById('ms-user-name').value.trim();
  const email = document.getElementById('ms-user-email').value.trim();
  const password = document.getElementById('ms-user-password').value;
  const confirmPassword = document.getElementById('ms-user-confirm-password').value;

  // Basic client-side validation
  if (!username || !email || !password) {
    alert('براہ کرم تمام required fields کو مکمل کریں۔');
    return;
  }

  if (password !== confirmPassword) {
    alert('پاس ورڈ اور تصدیق شدہ پاس ورڈ میل نہیں کھاتے۔');
    return;
  }

  try {
    // Send data to backend API to create user
    const response = await fetch('http://localhost:5000/api/users', {  // Adjust endpoint base URL as needed
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('نیا صارف کامیابی کے ساتھ شامل کردیا گیا۔');
      // Optionally, reset the form or redirect to some other page
      this.reset();
    } else {
      // Show error from backend
      alert(data.error || 'صارف بنانے میں خرابی ہوئی۔');
    }
  } catch (error) {
    alert('سرور سے رابطہ کرنے میں مسئلہ پیش آیا۔');
    console.error('Error:', error);
  }
});

