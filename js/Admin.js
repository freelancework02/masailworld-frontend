// Generic function to fetch topics and populate a given <select> element by its ID
async function populateTopicsDropdown(selectElementId) {
  const select = document.getElementById(selectElementId);
  if (!select) {
    console.warn(`No select element found with id: ${selectElementId}`);
    return;
  }

  try {
    const response = await fetch("https://masailworld.onrender.com/api/topic");
    if (!response.ok) throw new Error("موضوعات لوڈ کرنے میں مسئلہ");
    const topics = await response.json();

    // Clear current options and add placeholder
    select.innerHTML = '<option value="">منتخب کریں</option>';

    topics.forEach((topic) => {
      const option = document.createElement("option");
      option.value = topic.TopicID;
      option.textContent = topic.TopicName;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading topics:", error);
    alert("موضوعات لوڈ کرنے میں خرابی۔");
  }
}

// Call this function on DOMContentLoaded for every topic dropdown you have
document.addEventListener("DOMContentLoaded", () => {
  populateTopicsDropdown("fatwa-topic");
  populateTopicsDropdown("article-topic");
  populateTopicsDropdown("book-topic");
  // Add other select IDs as needed
});

//Add Fatwa
document.getElementById("fatwa-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const fatwaId = document.getElementById("fatwa-id").value;

  const topicSelect = document.getElementById("fatwa-topic");
  const selectedTopicId = topicSelect.value;
  const selectedTopicName =
    topicSelect.options[topicSelect.selectedIndex]?.text || "";

  // Extract user info from URL query params
  const urlParams = new URLSearchParams(window.location.search);
  const currentUserId = urlParams.get('userId');
  const currentUsername = urlParams.get('username');

  if (!currentUserId || !currentUsername) {
    alert('صارف کی معلومات دستیاب نہیں۔ براہ کرم دوبارہ لاگ ان کریں۔');
    return;
  }

  const data = {
    Title: document.getElementById("fatwa-title").value,
    Slug: document.getElementById("fatwa-slug").value,
    Tags: document.getElementById("fatwa-keywords").value,
    Description: document.getElementById("fatwa-meta-description").value,
    Question: document.getElementById("fatwa-question").value,
    Answer: document.getElementById("fatwa-answer").value,
    Writer: document.getElementById("fatwa-mufti").value,
    TopicID: selectedTopicId,
    TopicName: selectedTopicName
  };

  if (fatwaId) {
    // Updating fatwa
    data.UpdatedByID = currentUserId;
    data.UpdatedByUsername = currentUsername;
  } else {
    // Creating fatwa
    data.CreatedByID = currentUserId;
    data.CreatedByUsername = currentUsername;
  }

  let url = "https://masailworld.onrender.com/api/fatwa";
  let method = "POST";

  if (fatwaId) {
    url += `/${fatwaId}`;
    method = "PUT"; // or "PATCH" as per backend
  }

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (response.ok) {
      alert(
        "فتویٰ کامیابی سے " +
          (fatwaId ? "اپ ڈیٹ " : "شامل") +
          " ہو گیا!\nID: " +
          result.fatwaId
      );
      this.reset();
      window.location.hash = "manage-fatawa";
    } else {
      alert("سرور پر خرابی:\n" + (result.error || "نامعلوم"));
    }
  } catch (err) {
    alert("سرور سے کنیکشن میں مسئلہ:\n" + err.message);
  }
});


//Add Topic
document
  .getElementById("category-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const categoryId = document.getElementById("category-id").value;
    const data = {
      TopicName: document.getElementById("category-name").value,
      IconClass: document.getElementById("category-icon").value,
    };

    let url = "https://masailworld.onrender.com/api/topic";
    let method = "POST";
    if (categoryId) {
      url += `/${categoryId}`;
      method = "PATCH"; // PATCH matches your backend updated route!
    }

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch {
        result = null;
      }

      if (response.ok) {
        alert(
          "موضوع کامیابی سے " + (categoryId ? "اپ ڈیٹ" : "شامل") + " ہو گیا!"
        );
        this.reset();
        document.getElementById("category-id").value = "";
        // Optionally change heading/title back
        if (document.getElementById("category-form-title"))
          document.getElementById("category-form-title").innerText =
            "نیا موضوع شامل کریں";
        // Optionally go back and refresh list
        window.location.hash = "manage-categories";
        fetchTopic(); // or fetchTopics(), depends on your function name
      } else {
        alert("سرور پر خرابی:\n" + (result?.error || text || "Unknown error"));
      }
    } catch (err) {
      alert("سرور سے کنیکشن میں مسئلہ:\n" + err.message);
    }
  });

//Add writers

document.getElementById("ulema-form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const writerId = document.getElementById("ulema-id").value;
    const formData = new FormData();

    formData.append("WriterName", document.getElementById("ulema-name").value);
    formData.append("Position", document.getElementById("ulema-designation").value);
    formData.append("WriterBio", document.getElementById("ulema-bio").value);

    const photoInput = document.getElementById("ulema-photo");
    if (photoInput.files && photoInput.files.length > 0) {
        formData.append("Photo", photoInput.files[0]);
    }

    // Get user details from query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const currentUserId = urlParams.get('userId');
    const currentUsername = urlParams.get('username');

    if (!currentUserId || !currentUsername) {
        alert('صارف کی معلومات دستیاب نہیں۔ براہ کرم دوبارہ لاگ ان کریں');
        return;
    }

    if (writerId) {
        // Existing writer - update
        formData.set("UpdatedByID", currentUserId);
        formData.set("UpdatedByUsername", currentUsername);
    } else {
        // New writer - creation; append creator info
        formData.set("CreatedByID", currentUserId);
        formData.set("CreatedByUsername", currentUsername);

        // Optionally, you may also add UpdatedBy fields now same as creator
        formData.set("UpdatedByID", currentUserId);
        formData.set("UpdatedByUsername", currentUsername);
    }

    let url = "https://masailworld.onrender.com/api/writer";  // Change URL if needed
    let method = "POST";
    if (writerId) {
        url += `/${writerId}`;
        method = "PATCH";
    }

    try {
        const response = await fetch(url, {
            method: method,
            body: formData // multer will parse this on backend
        });

        const resultText = await response.text();
        let result;
        try {
            result = JSON.parse(resultText);
        } catch {
            result = null;
        }

        if (response.ok) {
            alert(`عالم ${writerId ? "اپ ڈیٹ" : "شامل"} ہو گیا۔ ID: ${result?.id || writerId || ''}`);
            this.reset();
            document.getElementById("ulema-id").value = '';
            // Optionally go back to list and refresh
            window.location.hash = "manage-ulema";
            fetchUlema(); // Make sure you have fetchUlema to refresh list
            if (document.getElementById("ulema-form-title")) {
                document.getElementById("ulema-form-title").innerText = "نیا عالم شامل کریں";
            }
        } else {
            alert(`خرابی: ${result?.error || resultText || 'نامعلوم مسئلہ'}`);
        }
    } catch (error) {
        alert(`سرور سے رابطے میں مسئلہ: ${error.message}`);
        console.error(error);
    }
});





//Add ARticle

document.getElementById("article-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const articleId = document.getElementById("article-id").value;

  const formData = new FormData();

  // Append form fields with trimming
  formData.append("Title", document.getElementById("article-title").value.trim());
  formData.append("Slug", document.getElementById("article-slug").value.trim());
  formData.append("Tags", document.getElementById("article-keywords").value.trim());
  formData.append("Description", document.getElementById("article-meta-description").value.trim());
  formData.append("Writer", document.getElementById("article-author").value.trim());
  formData.append("ArticleDescription", document.getElementById("article-content").value.trim());

  // Get selected topic ID and name
  const topicSelect = document.getElementById("article-topic");
  const topicId = topicSelect.value;
  const topicName = topicSelect.options[topicSelect.selectedIndex]?.text.trim() || "";

  // Validate topic selection
  if (!topicId || !topicName) {
    alert("براہ کرم مضمون کا موضوع منتخب کریں۔");
    topicSelect.focus();
    return;
  }

  // Append topic info to form data
  formData.append("TopicID", topicId.toString());
  formData.append("TopicName", topicName);

  // Validate required fields
  if (!formData.get("Title")) {
    alert("براہ کرم مضمون کا عنوان درج کریں۔");
    document.getElementById("article-title").focus();
    return;
  }

  if (!formData.get("Writer")) {
    alert("براہ کرم مضمون کا مصنف درج کریں۔");
    document.getElementById("article-author").focus();
    return;
  }

  // Handle the image file if selected
  const imageInput = document.getElementById("article-image");
  if (imageInput.files && imageInput.files.length > 0) {
    formData.append("FeaturedImage", imageInput.files[0]);
  }

  // Extract userId and username from query string
  const urlParams = new URLSearchParams(window.location.search);
  const currentUserId = urlParams.get('userId');
  const currentUsername = urlParams.get('username');

  if (!currentUserId || !currentUsername) {
    alert('صارف کی معلومات دستیاب نہیں۔ براہ کرم دوبارہ لاگ ان کریں۔');
    return;
  }

  // Append user info for audit trail
  if (articleId) {
    // Updating article
    formData.set("UpdatedByID", currentUserId);
    formData.set("UpdatedByUsername", currentUsername);
  } else {
    // Creating article
    formData.set("CreatedByID", currentUserId);
    formData.set("CreatedByUsername", currentUsername);

    formData.set("UpdatedByID", currentUserId);
    formData.set("UpdatedByUsername", currentUsername);
  }

  // Setup URL and method based on whether it's create or update
  let url = "https://masailworld.onrender.com/api/article";
  let method = "POST";
  if (articleId) {
    url += `/${articleId}`;
    method = "PATCH";
  }

  try {
    const response = await fetch(url, {
      method,
      body: formData,
    });

    let result;
    try {
      result = await response.json();
    } catch {
      result = null;
    }

    if (response.ok) {
      alert(`مضمون ${articleId ? "اپ ڈیٹ" : "شامل"} ہو گیا!\nID: ` + (result?.id || articleId || ""));
      this.reset();
      fetchArticles(); // Refresh article list after success
      window.location.hash = "manage-articles"; // Navigate user to articles management view
    } else {
      alert("سرور پر خرابی:\n" + (result?.error || "Unknown error"));
    }
  } catch (err) {
    alert("سرور سے کنیکشن میں مسئلہ:\n" + err.message);
    console.error(err);
  }
});






//Add Books
document
  .getElementById("book-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const bookId = document.getElementById("book-id").value;
    const formData = new FormData();

    formData.append("BookName", document.getElementById("book-name").value);
    formData.append("Author", document.getElementById("book-author").value);

     // Get selected topic ID and name
  const topicSelect = document.getElementById("book-topic");
  const topicId = topicSelect.value;
  const topicName = topicSelect.options[topicSelect.selectedIndex]?.text.trim() || "";

  // Validate topic selection
  if (!topicId || !topicName) {
    alert("براہ کرم مضمون کا موضوع منتخب کریں۔");
    topicSelect.focus();
    return;
  }

  if (!formData.get("BookName")) {
  alert("براہ کرم کتاب کا نام درج کریں۔");
  document.getElementById("book-name").focus();
  return;
}
if (!formData.get("Author")) {
  alert("براہ کرم مصنف کا نام درج کریں۔");
  document.getElementById("book-author").focus();
  return;
}

  // Append topic info to form data
  formData.append("TopicID", topicId.toString());
  formData.append("TopicName", topicName);

    const coverInput = document.getElementById("book-cover");
    if (coverInput.files && coverInput.files.length > 0) {
      formData.append("BookCover", coverInput.files[0]);
    }
    const pdfInput = document.getElementById("book-file");
    if (pdfInput.files && pdfInput.files.length > 0) {
      formData.append("PDFFile", pdfInput.files[0]);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const currentUserId = urlParams.get('userId');
    const currentUsername = urlParams.get('username');

    if (!currentUserId || !currentUsername) {
      alert('صارف کی معلومات دستیاب نہیں۔ براہ کرم دوبارہ لاگ ان کریں۔');
      return;
    }

    if (bookId) {
      // Updating book
      formData.set("UpdatedByID", currentUserId);
      formData.set("UpdatedByUsername", currentUsername);
    } else {
      // Creating new book
      formData.set("CreatedByID", currentUserId);
      formData.set("CreatedByUsername", currentUsername);
    }

    let url = "https://masailworld.onrender.com/api/book";
    let method = "POST";
    if (bookId) {
      url += `/${bookId}`;
      method = "PATCH"; // <-- PATCH matches your backend!
    }

    try {
      const response = await fetch(url, {
        method,
        body: formData,
      });

      let responseBody = await response.text();
      let result;
      try {
        result = JSON.parse(responseBody);
      } catch {
        result = null;
      }

      if (response.ok) {
        alert(
          "کتاب کامیابی سے " +
            (bookId ? "اپ ڈیٹ" : "شامل") +
            " ہو گئی!\nID: " +
            (result?.id || bookId || "")
        );
        this.reset();
        // Optionally switch tab/panel and refresh table
        window.location.hash = "manage-books";
        fetchBooks();
        // (restore heading for add)
        document.getElementById("book-form-title").innerText =
          "نئی کتاب شامل کریں";
      } else {
        alert(
          "سرور پر خرابی:\n" +
            (result?.error || responseBody || "Unknown error")
        );
      }
    } catch (err) {
      alert("سرور سے کنیکشن میں مسئلہ:\n" + err.message);
      console.error(err);
    }
  });



//Display Fatwa

function fetchFatawa() {
  fetch("https://masailworld.onrender.com/api/fatwa")
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.getElementById("fatawa-table-body");
      tableBody.innerHTML = ""; // Clear previous data

      if (data.success && Array.isArray(data.data)) {
        data.data.forEach((fatwa, index) => {
          const row = document.createElement("tr");

          row.innerHTML = `
                        <td class="py-3 px-4">${fatwa.FatwaID}</td>
                        <td class="py-3 px-4">${fatwa.Title || ""}</td>
                        <td class="py-3 px-4">${fatwa.Writer || ""}</td>
                        <td class="py-3 px-4">${fatwa.InsertedDate}</td>
                        <td class="py-3 px-4">
                            <button class="text-blue-600 hover:underline" onclick="editFatwa(${
                              fatwa.FatwaID
                            })">ترمیم</button> |
                            <button class="text-red-600 hover:underline" onclick="deleteFatwa(${
                              fatwa.FatwaID
                            })">حذف</button>
                        </td>
                    `;
          tableBody.appendChild(row);
        });
      } else {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-gray-500">کوئی فتویٰ موجود نہیں ہے۔</td></tr>`;
      }
    })
    .catch((error) => {
      console.error("Error fetching fatawa:", error);
    });
}

//Edit fatwa

function editFatwa(fatwaId) {
  fetch(`https://masailworld.onrender.com/api/fatwa/${fatwaId}`)
    .then((response) => response.json())
    .then((data) => {
      const fatwa = Array.isArray(data) ? data[0] : data.data || data;

      document.getElementById("fatwa-id").value = fatwa.FatwaID;
      document.getElementById("fatwa-title").value = fatwa.Title;
      document.getElementById("fatwa-slug").value = fatwa.Slug;
      document.getElementById("fatwa-keywords").value = fatwa.Tags;
      document.getElementById("fatwa-meta-description").value =
        fatwa.Description;
      document.getElementById("fatwa-question").value = fatwa.Question;
      document.getElementById("fatwa-answer").value = fatwa.Answer;
      document.getElementById("fatwa-mufti").value = fatwa.Writer;

      // Set the topic dropdown selected value by TopicID
      if (fatwa.TopicID) {
        document.getElementById("fatwa-topic").value = fatwa.TopicID;
      } else {
        document.getElementById("fatwa-topic").value = "";
      }

      // Navigate to fatwa form page (adjust as per your routing)
      window.location.hash = "add-fatwa";
    })
    .catch((err) => {
      alert("فتویٰ لوڈ کرنے میں مسئلہ: " + err.message);
      console.error(err);
    });
}

//Delete Fatwa
function deleteFatwa(id) {
  const confirmDelete = confirm("کیا آپ واقعی اس فتویٰ کو حذف کرنا چاہتے ہیں؟");
  if (confirmDelete) {
    fetch(`https://masailworld.onrender.com/api/fatwa/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          fetchFatawa(); // Refresh table
        } else {
          alert("حذف کرنے میں مسئلہ آیا۔");
        }
      });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  fetchFatawa();
});

//Display Article

function fetchArticles() {
  fetch("https://masailworld.onrender.com/api/article")
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.getElementById("articles-table-body");
      tableBody.innerHTML = "";

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
          const row = document.createElement("tr");
          row.innerHTML = `
                        <td class="py-3 px-4">${article.Title}</td>
                        <td class="py-3 px-4">${article.Writer}</td>
                        <td class="py-3 px-4">${formatDate(
                          article.InsertedDate
                        )}</td>
                        <td class="py-3 px-4">
                            <button class="text-blue-600 hover:underline" onclick="editArticle(${
                              article.ArticleID
                            })">ترمیم</button> |
                            <button class="text-red-600 hover:underline" onclick="deleteArticle(${
                              article.ArticleID
                            })">حذف</button>
                        </td>
                    `;
          tableBody.appendChild(row);
        });
      } else {
        tableBody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-gray-500">کوئی مضمون موجود نہیں ہے۔</td></tr>`;
      }
    })
    .catch((error) => {
      console.error("Error fetching articles:", error);
      document.getElementById(
        "articles-table-body"
      ).innerHTML = `<tr><td colspan="4" class="text-center text-red-500">مضامین لوڈ کرنے میں خرابی</td></tr>`;
    });
}

document.addEventListener("DOMContentLoaded", function () {
  fetchArticles();
});

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("ur-PK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Example placeholder functions
function editArticle(articleId) {
  fetch(`https://masailworld.onrender.com/api/article/${articleId}`)
    .then((res) => res.json())
    .then((article) => {
      document.getElementById("article-id").value = article.ArticleID;
      document.getElementById("article-title").value = article.Title || '';
      document.getElementById("article-slug").value = article.Slug || '';
      document.getElementById("article-keywords").value = article.Tags || '';
      document.getElementById("article-meta-description").value = article.Description || '';
      document.getElementById("article-author").value = article.Writer || '';
      document.getElementById("article-content").value = article.ArticleDescription || '';
      
      // Set topic select by TopicID if available
      if (article.TopicID) {
        document.getElementById("article-topic").value = article.TopicID;
      } else {
        // fallback to empty selection if no TopicID
        document.getElementById("article-topic").value = '';
      }
      
      document.getElementById("article-form-title").innerText = "مضمون میں ترمیم کریں";
      window.location.hash = "add-article";
    })
    .catch((e) => alert("مضمون لوڈ کرنے میں مسئلہ: " + e.message));
}




function deleteArticle(id) {
  const confirmDelete = confirm("کیا آپ واقعی اس مضمون کو حذف کرنا چاہتے ہیں؟");
  if (confirmDelete) {
    fetch(`https://masailworld.onrender.com/api/article/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          fetchArticles(); // Refresh list
        } else {
          alert("حذف کرنے میں مسئلہ آیا۔");
        }
      });
  }
}

//Display Books

function fetchBooks() {
  fetch("https://masailworld.onrender.com/api/book")
    .then((response) => response.json())
    .then((data) => {
      console.log("book response", data);
      const tableBody = document.getElementById("books-table-body");
      tableBody.innerHTML = ""; // Clear existing content

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
          const row = document.createElement("tr");

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
    .catch((error) => {
      console.error("Error fetching books:", error);
      document.getElementById("books-table-body").innerHTML = `
                <tr><td colspan="3" class="text-center text-red-500">کتابیں لوڈ کرنے میں خرابی</td></tr>`;
    });
}

document.addEventListener("DOMContentLoaded", function () {
  fetchBooks();
});

// Placeholder functions
function editBook(bookId) {
  fetch(`https://masailworld.onrender.com/api/book/${bookId}`)
    .then((res) => res.json())
    .then((book) => {
      document.getElementById("book-id").value = book.BookID || '';
      document.getElementById("book-name").value = book.BookName || '';
      document.getElementById("book-author").value = book.Author || '';

      // Set the topic select by TopicID if available
      if (book.TopicID) {
        document.getElementById("book-topic").value = book.TopicID;
      } else {
        document.getElementById("book-topic").value = '';
      }

      document.getElementById("book-form-title").innerText = "کتاب میں ترمیم کریں";
      window.location.hash = "add-book";
    })
    .catch((err) => alert("کتاب لوڈ کرنے میں مسئلہ: " + err.message));
}



function deleteBook(bookId) {
  const confirmDelete = confirm("کیا آپ واقعی اس کتاب کو حذف کرنا چاہتے ہیں؟");
  if (confirmDelete) {
    fetch(`https://masailworld.onrender.com/api/book/${bookId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          fetchBooks(); // Refresh table
        } else {
          alert("حذف کرنے میں مسئلہ آیا۔");
        }
      });
  }
}

//Writers

function fetchWriters() {
  fetch("https://masailworld.onrender.com/api/writer")
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.getElementById("ulema-table-body");
      tableBody.innerHTML = ""; // Clear existing rows

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
        writers.forEach((writer) => {
          const row = document.createElement("tr");
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
    .catch((error) => {
      console.error("Error fetching writers:", error);
      document.getElementById("ulema-table-body").innerHTML = `
                <tr><td colspan="3" class="text-center text-red-500">علماء لوڈ کرنے میں خرابی</td></tr>`;
    });
}

document.addEventListener("DOMContentLoaded", function () {
  fetchWriters();
});

// Placeholder actions
function editWriter(writerId) {
  fetch(`https://masailworld.onrender.com/api/writer/${writerId}`)
    .then((res) => res.json())
    .then((writer) => {
      document.getElementById("ulema-id").value = writer.WriterID;
      document.getElementById("ulema-name").value = writer.WriterName;
      document.getElementById("ulema-designation").value = writer.Position;
      document.getElementById("ulema-bio").value = writer.WriterBio;
      // (Optional) Display photo preview if you want, using /api/writer/image/:id

      // Switch to form view if SPA/tab setup:
      window.location.hash = "add-ulema";
      // Update title if needed, e.g.
      document.getElementById("ulema-form-title").innerText =
        "عالم کی ترمیم کریں";
    })
    .catch((err) => alert("عالم لوڈ کرنے میں مسئلہ: " + err.message));
}

function deleteWriter(WriterID) {
  const confirmDelete = confirm("کیا آپ واقعی اس عالم کو حذف کرنا چاہتے ہیں؟");
  if (confirmDelete) {
    fetch(`https://masailworld.onrender.com/api/writer/${WriterID}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          fetchWriters(); // Refresh table
        } else {
          alert("حذف کرنے میں مسئلہ آیا۔");
        }
      });
  }
}

//Display Topics

function fetchTopic() {
  fetch("https://masailworld.onrender.com/api/topic")
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.getElementById("categories-table-body");
      tableBody.innerHTML = ""; // Clear existing content

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
        topics.forEach((topic) => {
          const row = document.createElement("tr");
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
    .catch((error) => {
      console.error("Error fetching categories:", error);
      document.getElementById("categories-table-body").innerHTML = `
                <tr><td colspan="3" class="text-center text-red-500">موضوعات لوڈ کرنے میں خرابی</td></tr>`;
    });
}

document.addEventListener("DOMContentLoaded", function () {
  fetchTopic();
});

// Optional edit/delete handlers
function editTopic(topicId) {
  fetch(`https://masailworld.onrender.com/api/topic/${topicId}`)
    .then((res) => res.json())
    .then((topic) => {
      document.getElementById("category-id").value = topic.TopicID;
      document.getElementById("category-name").value = topic.TopicName;
      document.getElementById("category-icon").value = topic.IconClass;
      // Optional: update form heading
      if (document.getElementById("category-form-title"))
        document.getElementById("category-form-title").innerText =
          "موضوع میں ترمیم کریں";
      // Switch to form panel/tab if using SPA interface
      window.location.hash = "add-category";
    })
    .catch((err) => alert("موضوع لوڈ کرنے میں مسئلہ: " + err.message));
}

function deleteTopic(id) {
  if (confirm("کیا آپ واقعی اس موضوع کو حذف کرنا چاہتے ہیں؟")) {
    fetch(`https://masailworld.onrender.com/api/topic/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          fetchCategories(); // Refresh the list
        } else {
          alert("حذف کرنے میں مسئلہ آیا۔");
        }
      });
  }
}

// User insert

document.getElementById("ms-user-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("ms-user-name").value.trim();
    const email = document.getElementById("ms-user-email").value.trim();
    const password = document.getElementById("ms-user-password").value;
    const confirmPassword = document.getElementById("ms-user-confirm-password").value;

    if (!username || !email || !password) {
      alert("براہ کرم تمام required fields کو مکمل کریں۔");
      return;
    }

    if (password !== confirmPassword) {
      alert("پاس ورڈ اور تصدیق شدہ پاس ورڈ میل نہیں کھاتے۔");
      return;
    }

    // Extract logged-in admin info from URL query string
    const urlParams = new URLSearchParams(window.location.search);
    const currentUserId = urlParams.get('userId');
    const currentUsername = urlParams.get('username');

    if (!currentUserId || !currentUsername) {
      alert('صارف کی معلومات دستیاب نہیں۔ براہ کرم دوبارہ لاگ ان کریں۔');
      return;
    }

    try {
      const response = await fetch("https://masailworld.onrender.com/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          username, 
          email, 
          password,
          CreatedByID: currentUserId,
          CreatedByUsername: currentUsername
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("نیا صارف کامیابی کے ساتھ شامل کردیا گیا۔");
        this.reset();
      } else {
        alert(data.error || "صارف بنانے میں خرابی ہوئی۔");
      }
    } catch (error) {
      alert("سرور سے رابطہ کرنے میں مسئلہ پیش آیا۔");
      console.error("Error:", error);
    }
  });




  // Helper to get URL query parameter by name
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

document.addEventListener('DOMContentLoaded', () => {
  const sidebarUsername = document.getElementById('sidebar-username');
  const logoutBtn = document.getElementById('logout-btn');

  // Get logged in username from query string
  const username = getQueryParam('username');

  if (username) {
    sidebarUsername.textContent = username;
  } else {
    // Optional: if no username found, redirect to login or show default
    sidebarUsername.textContent = 'ایڈمن';
    // window.location.href = 'login.html'; // Uncomment if you want to force login redirect
  }

  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // Clear any auth data if stored locally (optional)
    // localStorage.removeItem('authToken');
    // sessionStorage.removeItem('username');
    // sessionStorage.removeItem('userId');

    // Redirect to login page
    window.location.href = '.././index.html';
  });
});


async function fetchAndDisplayTotals() {
  try {
    const response = await fetch('https://masailworld.onrender.com/api/stats/totals');
    if (!response.ok) throw new Error('سرور سے اعداد و شمار حاصل کرنے میں مسئلہ');
    const data = await response.json();

    if (data.success) {
      // Update the elements by id with counts
      document.getElementById('total-fatawa').textContent = data.counts.fatwa || 0;
      document.getElementById('total-articles').textContent = data.counts.article || 0;
      document.getElementById('total-books').textContent = data.counts.books || 0;
      document.getElementById('total-categories').textContent = data.counts.topic || 0;
      // For questions count, you might want to define another table or API
      document.getElementById('total-questions').textContent = data.counts.questions || 0; // or fetch if available
    } else {
      console.error('Failed to load counts:', data.error);
    }
  } catch (error) {
    console.error('Error fetching totals:', error);
  }
}

// Call this on page load or dashboard load
document.addEventListener('DOMContentLoaded', fetchAndDisplayTotals);



// Question Answer 
// Fetch and display all questions in the table

// Fetch and display all questions in the table
async function fetchAndDisplayQuestions() {
  try {
    const response = await fetch('https://masailworld.onrender.com/api/questions');
    if (!response.ok) throw new Error('سوالات لوڈ کرنے میں مسئلہ');
    const data = await response.json();

    const tbody = document.getElementById('questions-table-body');
    tbody.innerHTML = ''; // Clear existing rows

    if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
      data.questions.forEach(q => {
        const tr = document.createElement('tr');

        const userName = q.Name ? q.Name : q.Email;
        const summary = q.QuestionText.length > 50 ? q.QuestionText.substr(0, 47) + '...' : q.QuestionText;
        const status = q.Answer && q.Answer.trim() ? 'جواب دیا گیا' : 'زیر التوا';

        tr.innerHTML = `
          <td class="py-3 px-4">${escapeHtml(userName)}</td>
          <td class="py-3 px-4" title="${escapeHtml(q.QuestionText)}">${escapeHtml(summary)}</td>
          <td class="py-3 px-4">${status}</td>
          <td class="py-3 px-4">
            <button class="answer-btn bg-midnight_green text-white px-4 py-2 rounded mr-2 hover:bg-midnight_green-400 transition" data-id="${q.QuestionID}">جواب دیں</button>
            <button class="delete-btn bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition" data-id="${q.QuestionID}">حذف کریں</button>
          </td>
        `;

        tbody.appendChild(tr);
      });

      // Answer buttons: open answer page and fill form
      document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const questionId = btn.dataset.id;
          await openAnswerPage(questionId);
        });
      });

      // Delete buttons: delete question
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteQuestion(btn.dataset.id));
      });

    } else {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="text-center py-4 text-gray-500">کوئی سوالات موصول نہیں ہوئے۔</td>
        </tr>
      `;
    }
  } catch (error) {
    alert('سوالات لوڈ کرنے میں مسئلہ: ' + error.message);
    console.error(error);
  }
}

// Open the answer page, populate question details and switch page view
async function openAnswerPage(questionId) {
  try {
    const response = await fetch(`https://masailworld.onrender.com/api/questions/${questionId}`);
    if (!response.ok) throw new Error('سوال حاصل کرنے میں مسئلہ');
    const data = await response.json();

    if (!data.success || !data.question) {
      alert('سوال دستیاب نہیں ہے۔');
      return;
    }

    const q = data.question;

    // Populate answer form fields
    document.getElementById('question-id').value = q.QuestionID;
    document.getElementById('question-to-answer-text').textContent = q.QuestionText;
    const userName = q.Name ? q.Name : q.Email;
    document.getElementById('question-to-answer-user').textContent = `صارف: ${userName}`;
    document.getElementById('question-answer').value = q.Answer || '';

    // Show answer page and hide others
    showPage('answer-question');
  } catch (error) {
    alert('جواب کی درخواست میں مسئلہ: ' + error.message);
    console.error(error);
  }
}

// Submit answer form handler
document.getElementById('answer-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const questionId = document.getElementById('question-id').value;
  const answer = document.getElementById('question-answer').value.trim();

  if (!answer) {
    alert('براہ کرم جواب درج کریں۔');
    return;
  }

  // Extract current user info from query string
  const urlParams = new URLSearchParams(window.location.search);
  const answeredById = urlParams.get('userId');
  const answeredByUsername = urlParams.get('username');

  if (!answeredById || !answeredByUsername) {
    alert('صارف کی معلومات دستیاب نہیں۔ براہ کرم دوبارہ لاگ ان کریں۔');
    return;
  }

  try {
    const response = await fetch(`https://masailworld.onrender.com/api/questions/${questionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        Answer: answer,
        AnsweredByID: answeredById,
        AnsweredByUsername: answeredByUsername,
        // Optionally include ModifiedBy if you want to track generic modifications
        ModifiedByID: answeredById,
        ModifiedByUsername: answeredByUsername
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      alert('جواب کامیابی سے محفوظ ہوگیا ہے۔');
      fetchAndDisplayQuestions();
      showPage('manage-questions');
    } else {
      alert('جواب محفوظ کرنے میں مسئلہ: ' + (data.error || 'نامعلوم خرابی'));
    }
  } catch (error) {
    alert('جواب محفوظ کرنے میں سرور کی خرابی: ' + error.message);
    console.error(error);
  }
});


// Cancel button on answer form to go back to questions list
document.querySelector('#page-answer-question .cancel-btn').addEventListener('click', () => {
  // Clear form fields if needed
  document.getElementById('answer-form').reset();
  showPage('manage-questions');
});

// Delete question with confirmation
async function deleteQuestion(questionId) {
  if (!confirm('کیا آپ واقعی اس سوال کو حذف کرنا چاہتے ہیں؟')) return;

  try {
    const response = await fetch(`https://masailworld.onrender.com/api/questions/${questionId}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (response.ok && data.success) {
      alert('سوال حذف کر دیا گیا ہے۔');
      fetchAndDisplayQuestions();
    } else {
      alert('سوال حذف کرنے میں مسئلہ: ' + (data.error || 'نامعلوم خرابی'));
    }
  } catch (error) {
    alert('سوال حذف کرنے میں مسئلہ: ' + error.message);
    console.error(error);
  }
}

// Simple HTML escaping to avoid XSS attacks
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Function to show a single page by ID and hide others
function showPage(pageId) {
  document.querySelectorAll('.admin-page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(`page-${pageId}`);
  if (page) {
    page.classList.add('active');
    window.location.hash = `#${pageId}`;
  }
}

// Initialize: fetch questions on page load
document.addEventListener('DOMContentLoaded', () => {
  fetchAndDisplayQuestions();

  // Optional: if URL hash corresponds to answer-question with id param, load that question in answer page
  if (window.location.hash.startsWith('#answer-question')) {
    const urlParams = new URLSearchParams(window.location.search);
    const qid = urlParams.get('id');
    if (qid) openAnswerPage(qid);
    else showPage('manage-questions');
  }
});
