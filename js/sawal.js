// document.addEventListener("DOMContentLoaded", () => {
//   const form = document.querySelector("form.space-y-6");

//   form.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     // Collect values from form fields
//     const Name = document.getElementById("name").value.trim() || null; // optional field
//     const Email = document.getElementById("email").value.trim();
//     const Subject = document.getElementById("subject").value;
//     const QuestionText = document.getElementById("question").value.trim();

//     // Basic client-side validation
//     if (!Email) {
//       alert("براہ کرم اپنا ای میل درج کریں۔");
//       return;
//     }
//     if (!Subject) {
//       alert("براہ کرم موضوع منتخب کریں۔");
//       return;
//     }
//     if (!QuestionText) {
//       alert("براہ کرم سوال کی تفصیل درج کریں۔");
//       return;
//     }

//     // Construct request payload
//     const requestData = { Name, Email, Subject, QuestionText };

//     try {
//       // Replace below URL with your actual backend API endpoint that handles question insertion
//       const response = await fetch(
//         "https://masailworld.onrender.com/api/questions",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(requestData),
//         }
//       );

//       const result = await response.json();

//       if (response.ok && result.success) {
//         alert("آپ کا سوال کامیابی کے ساتھ بھیج دیا گیا ہے۔ شکریہ!");
//         form.reset();
//       } else {
//         alert("سوال بھیجنے میں مسئلہ: " + (result.error || "نامعلوم خرابی"));
//       }
//     } catch (error) {
//       alert("سرور سے رابطہ کرنے میں مسئلہ پیش آیا: " + error.message);
//       console.error("Error submitting question:", error);
//     }
//   });
// });

// // Call this after DOM is ready (e.g., in <script> at end of body or window.onload)

// async function renderLatestArticles() {
//   const apiUrl =
//     "https://masailworld.onrender.com/api/article/paged?page=1&limit=3";
//   try {
//     const response = await fetch(apiUrl);
//     if (!response.ok) throw new Error("Network response was not ok");
//     const articles = await response.json();

//     // Find the container to insert cards into:
//     const container = document.querySelector("#qs-fatawa-home .space-y-6");
//     container.innerHTML = ""; // Clear previous (static) content, if any

//     articles.forEach((article, idx) => {
//       const card = document.createElement("a");
//       card.href = `/masailworld-frontend/Pages/Articledetail.html?id=${article.ArticleID}`; // or to your detail route
//       card.className =
//         "nav-link ms-card-fatwa block bg-white p-4 border border-ash_gray rounded-lg hover:shadow-lg hover:border-midnight_green-200 transition-all duration-300";

//       card.innerHTML = `
//         <div class="flex items-start">
//           <div class="ms-fatwa-num flex-shrink-0 flex items-center justify-center w-12 h-12 bg-midnight_green text-white font-bold text-2xl rounded-md ml-4 shadow-md">${
//             idx + 1
//           }</div>
//           <div class="flex-grow">
//             <h3 class="ms-card-title text-2xl font-semibold text-rich_black">${
//               article.Title
//             }</h3>
//             <p class="ms-card-text text-rich_black-600 text-base mt-2 mb-3 leading-relaxed line-clamp-1">
//               ${article.Title ?? ""}
//             </p>
//             <div class="flex justify-between items-center mt-4">
//               <span class="text-midnight_green group-hover:text-midnight_green-600 font-bold text-lg">مکمل جواب پڑھیں &larr;</span>
//               <div class="flex items-center space-x-4 space-x-reverse text-air_force_blue">
//                 <div class="flex items-center"><i class="bi bi-eye-fill ml-1"></i><span class="text-sm font-sans"></span></div>
//                 <span class="hover:text-midnight_green"><i class="bi bi-share-fill"></i></span>
//               </div>
//             </div>
//           </div>
//         </div>
//       `;
//       container.appendChild(card);
//     });
//   } catch (error) {
//     console.error("Failed to fetch articles", error);
//     // Optionally show error message in UI
//   }
// }

// // Call the function once DOM is ready
// window.addEventListener("DOMContentLoaded", renderLatestArticles);




// // Display Fatwas List

// async function loadFatawa() {
//   try {
//     const response = await fetch(
//       "https://masailworld.onrender.com/api/article/paged?page=1&limit=60"
//     );
//     if (!response.ok) throw new Error("Network response was not ok");
//     const data = await response.json();


//     // Since the API returns an array directly, no `data.data` needed
//     if (!Array.isArray(data)) {
//       throw new Error("Expected an array of fatawa");
//     }

//     // Helper function to strip HTML tags from a string
//     function stripHtml(html) {
//       const tempDiv = document.createElement("div");
//       tempDiv.innerHTML = html;
//       return tempDiv.textContent || tempDiv.innerText || "";
//     }

//     const fatawaContainer = document.querySelector("#page-fatawa .space-y-6");
//     fatawaContainer.innerHTML = ""; // Clear existing content

//     data.forEach((fatwa, index) => {
//       const a = document.createElement("a");
//       a.href =  `/masailworld-frontend/Pages/Articledetail.html?id=${fatwa.ArticleID}`; // or to your detail route;
//       a.className =
//         "nav-link ms-card-fatwa block bg-white p-4 border border-ash_gray rounded-lg hover:shadow-lg hover:border-midnight_green-200 transition-all duration-300";

//       const flexDiv = document.createElement("div");
//       flexDiv.className = "flex items-start";

//       const numDiv = document.createElement("div");
//       numDiv.className =
//         "ms-fatwa-num flex-shrink-0 flex items-center justify-center w-12 h-12 bg-midnight_green text-white font-bold text-2xl rounded-md ml-4 shadow-md";
//       numDiv.textContent = index + 1;

//       const contentDiv = document.createElement("div");
//       contentDiv.className = "flex-grow";

//       const titleH3 = document.createElement("h3");
//       titleH3.className =
//         "ms-card-title text-2xl font-semibold text-rich_black";
//       titleH3.textContent = fatwa.Title || "No Title";

//       const descP = document.createElement("p");
//       descP.className =
//         "ms-card-text text-rich_black-600 text-base mt-2 mb-3 leading-relaxed";

//       // Strip HTML from description then truncate
//       const rawText = fatwa.ArticleDescription || fatwa.Description || "";
//       const cleanText = stripHtml(rawText);
//       descP.textContent =
//         cleanText.length > 100 ? cleanText.substring(0, 97) + "..." : cleanText;

//       const bottomFlex = document.createElement("div");
//       bottomFlex.className = "flex justify-between items-center mt-4";

//       const readMoreSpan = document.createElement("span");
//       readMoreSpan.className =
//         "text-midnight_green group-hover:text-midnight_green-600 font-bold text-lg";
//       readMoreSpan.innerHTML = "مکمل جواب پڑھیں &larr;";

//       const iconDiv = document.createElement("div");
//       iconDiv.className =
//         "flex items-center space-x-4 space-x-reverse text-air_force_blue";

//       const viewsDiv = document.createElement("div");
//       viewsDiv.className = "flex items-center";
//       viewsDiv.innerHTML = `<i class="bi bi-eye-fill ml-1"></i><span class="text-sm font-sans">${
//         fatwa.views || 0
//       }</span>`;

//       const shareSpan = document.createElement("span");
//       shareSpan.className = "hover:text-midnight_green";
//       shareSpan.innerHTML = '<i class="bi bi-share-fill"></i>';

//       iconDiv.appendChild(viewsDiv);
//       iconDiv.appendChild(shareSpan);
//       bottomFlex.appendChild(readMoreSpan);
//       bottomFlex.appendChild(iconDiv);

//       contentDiv.appendChild(titleH3);
//       contentDiv.appendChild(descP);
//       contentDiv.appendChild(bottomFlex);

//       flexDiv.appendChild(numDiv);
//       flexDiv.appendChild(contentDiv);
//       a.appendChild(flexDiv);

//       fatawaContainer.appendChild(a);
//     });
//   } catch (error) {
//     console.error("Error loading fatawa:", error);
//   }
// }

// document.addEventListener("DOMContentLoaded", loadFatawa);




// //Display the Categroy 
// async function loadCategories() {
//   try {
//     const response = await fetch('https://masailworld.onrender.com/api/topic/paged?limit=12&offset=20');
//     if (!response.ok) throw new Error('Network response was not ok');
//     const categories = await response.json();
//     console.log("Display categories", response)

//     if (!Array.isArray(categories)) {
//       throw new Error('Expected an array of categories');
//     }

//     // Find the container div where categories should be placed
//     const container = document.querySelector('#qs-categories-home .grid');
//     if (!container) {
//       console.error('Category container not found');
//       return;
//     }

//     // Clear existing categories (if any)
//     container.innerHTML = '';

//     // For each category, create its card/link element
//     categories.forEach(cat => {
//       const a = document.createElement('a');
//       a.href = `#`;  // You can adjust this later, e.g. linking to category page by slug
//       a.className = 'ms-card-cat block bg-beige-600 p-6 rounded-xl shadow-md hover:bg-ash_gray hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center';

//       // Create icon element with dynamic IconClass
//       const icon = document.createElement('i');
//       icon.className = `${cat.IconClass} text-5xl text-midnight_green mb-4 inline-block`;
//       a.appendChild(icon);

//       // Category name
//       const h3 = document.createElement('h3');
//       h3.className = 'font-bold text-xl text-rich_black';
//       h3.textContent = cat.TopicName || 'نام دستیاب نہیں';
//       a.appendChild(h3);

//       container.appendChild(a);
//     });
//   } catch (error) {
//     console.error('Failed to load categories:', error);
//   }
// }

// document.addEventListener('DOMContentLoaded', loadCategories);






// ============================
// Question Form Submission
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form.space-y-6");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const Name = document.getElementById("name").value.trim() || null;
      const Email = document.getElementById("email").value.trim();
      const Subject = document.getElementById("subject").value;
      const QuestionText = document.getElementById("question").value.trim();

      if (!Email) {
        alert("براہ کرم اپنا ای میل درج کریں۔");
        return;
      }
      if (!Subject) {
        alert("براہ کرم موضوع منتخب کریں۔");
        return;
      }
      if (!QuestionText) {
        alert("براہ کرم سوال کی تفصیل درج کریں۔");
        return;
      }

      const requestData = { Name, Email, Subject, QuestionText };

      try {
        const response = await fetch(
          "https://masailworld.onrender.com/api/questions",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData),
          }
        );

        const result = await response.json();

        if (response.ok && result.success) {
          alert("آپ کا سوال کامیابی کے ساتھ بھیج دیا گیا ہے۔ شکریہ!");
          form.reset();
        } else {
          alert("سوال بھیجنے میں مسئلہ: " + (result.error || "نامعلوم خرابی"));
        }
      } catch (error) {
        alert("سرور سے رابطہ کرنے میں مسئلہ پیش آیا: " + error.message);
        console.error("Error submitting question:", error);
      }
    });
  }
});

// ============================
// Latest Articles (Homepage)
// ============================
async function renderLatestArticles() {
  const apiUrl =
    "https://masailworld.onrender.com/api/article/paged?page=1&limit=3";
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Network response was not ok");
    const articles = await response.json();

    const container = document.querySelector("#qs-fatawa-home .space-y-6");
    if (!container) return;

    container.innerHTML = "";

    articles.forEach((article, idx) => {
      const card = document.createElement("a");
      card.href = `/masailworld-frontend/Pages/Articledetail.html?id=${article.ArticleID}`;
      card.className =
        "nav-link ms-card-fatwa block bg-white p-4 border border-ash_gray rounded-lg hover:shadow-lg hover:border-midnight_green-200 transition-all duration-300";

      card.innerHTML = `
        <div class="flex items-start">
          <div class="ms-fatwa-num flex-shrink-0 flex items-center justify-center w-12 h-12 bg-midnight_green text-white font-bold text-2xl rounded-md ml-4 shadow-md">${
            idx + 1
          }</div>
          <div class="flex-grow">
            <h3 class="ms-card-title text-2xl font-semibold text-rich_black">${
              article.Title
            }</h3>
            <p class="ms-card-text text-rich_black-600 text-base mt-2 mb-3 leading-relaxed line-clamp-1">
              ${article.Title ?? ""}
            </p>
            <div class="flex justify-between items-center mt-4">
              <span class="text-midnight_green group-hover:text-midnight_green-600 font-bold text-lg">مکمل جواب پڑھیں &larr;</span>
              <div class="flex items-center space-x-4 space-x-reverse text-air_force_blue">
                <div class="flex items-center"><i class="bi bi-eye-fill ml-1"></i><span class="text-sm font-sans"></span></div>
                <span class="hover:text-midnight_green"><i class="bi bi-share-fill"></i></span>
              </div>
            </div>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Failed to fetch articles", error);
  }
}
window.addEventListener("DOMContentLoaded", renderLatestArticles);

// ============================
// Fatawa List (Page + Search)
// ============================
let allFatawa = [];

function stripHtml(html) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
}

async function loadFatawa() {
  try {
    const response = await fetch(
      "https://masailworld.onrender.com/api/article/paged?page=1&limit=60"
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Expected an array of fatawa");
    }

    allFatawa = data;

    const fatawaContainer = document.querySelector("#page-fatawa .space-y-6");
    if (!fatawaContainer) return;
    fatawaContainer.innerHTML = "";

    data.forEach((fatwa, index) => {
      fatawaContainer.appendChild(createFatwaCard(fatwa, index));
    });
  } catch (error) {
    console.error("Error loading fatawa:", error);
  }
}

function createFatwaCard(fatwa, index) {
  const a = document.createElement("a");
  a.href = `/masailworld-frontend/Pages/Articledetail.html?id=${fatwa.ArticleID}`;
  a.className =
    "nav-link ms-card-fatwa block bg-white p-4 border border-ash_gray rounded-lg hover:shadow-lg hover:border-midnight_green-200 transition-all duration-300";

  const flexDiv = document.createElement("div");
  flexDiv.className = "flex items-start";

  const numDiv = document.createElement("div");
  numDiv.className =
    "ms-fatwa-num flex-shrink-0 flex items-center justify-center w-12 h-12 bg-midnight_green text-white font-bold text-2xl rounded-md ml-4 shadow-md";
  numDiv.textContent = index + 1;

  const contentDiv = document.createElement("div");
  contentDiv.className = "flex-grow";

  const titleH3 = document.createElement("h3");
  titleH3.className = "ms-card-title text-2xl font-semibold text-rich_black";
  titleH3.textContent = fatwa.Title || "No Title";

  const descP = document.createElement("p");
  descP.className =
    "ms-card-text text-rich_black-600 text-base mt-2 mb-3 leading-relaxed";
  const rawText = fatwa.ArticleDescription || fatwa.Description || "";
  const cleanText = stripHtml(rawText);
  descP.textContent =
    cleanText.length > 100 ? cleanText.substring(0, 97) + "..." : cleanText;

  const bottomFlex = document.createElement("div");
  bottomFlex.className = "flex justify-between items-center mt-4";

  const readMoreSpan = document.createElement("span");
  readMoreSpan.className =
    "text-midnight_green group-hover:text-midnight_green-600 font-bold text-lg";
  readMoreSpan.innerHTML = "مکمل جواب پڑھیں &larr;";

  const iconDiv = document.createElement("div");
  iconDiv.className =
    "flex items-center space-x-4 space-x-reverse text-air_force_blue";

  const viewsDiv = document.createElement("div");
  viewsDiv.className = "flex items-center";
  viewsDiv.innerHTML = `<i class="bi bi-eye-fill ml-1"></i><span class="text-sm font-sans">${
    fatwa.views || 0
  }</span>`;

  const shareSpan = document.createElement("span");
  shareSpan.className = "hover:text-midnight_green";
  shareSpan.innerHTML = '<i class="bi bi-share-fill"></i>';

  iconDiv.appendChild(viewsDiv);
  iconDiv.appendChild(shareSpan);
  bottomFlex.appendChild(readMoreSpan);
  bottomFlex.appendChild(iconDiv);

  contentDiv.appendChild(titleH3);
  contentDiv.appendChild(descP);
  contentDiv.appendChild(bottomFlex);

  flexDiv.appendChild(numDiv);
  flexDiv.appendChild(contentDiv);
  a.appendChild(flexDiv);

  return a;
}

document.addEventListener("DOMContentLoaded", loadFatawa);

// ============================
// Categories (Homepage)
// ============================
async function loadCategories() {
  try {
    const response = await fetch(
      "https://masailworld.onrender.com/api/topic/paged?limit=12&offset=20"
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const categories = await response.json();

    if (!Array.isArray(categories)) {
      throw new Error("Expected an array of categories");
    }

    const container = document.querySelector("#qs-categories-home .grid");
    if (!container) return;
    container.innerHTML = "";

    categories.forEach((cat) => {
      const a = document.createElement("a");
      a.href = `#`;
      a.className =
        "ms-card-cat block bg-beige-600 p-6 rounded-xl shadow-md hover:bg-ash_gray hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center";

      const icon = document.createElement("i");
      icon.className = `${cat.IconClass} text-5xl text-midnight_green mb-4 inline-block`;
      a.appendChild(icon);

      const h3 = document.createElement("h3");
      h3.className = "font-bold text-xl text-rich_black";
      h3.textContent = cat.TopicName || "نام دستیاب نہیں";
      a.appendChild(h3);

      container.appendChild(a);
    });
  } catch (error) {
    console.error("Failed to load categories:", error);
  }
}
document.addEventListener("DOMContentLoaded", loadCategories);

// ============================
// Search Dropdown (Static)
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchDropdown = document.getElementById("searchDropdown");

  if (!searchInput || !searchDropdown) return;

  searchInput.addEventListener("input", function () {
    const query = this.value.trim().toLowerCase();
    searchDropdown.innerHTML = "";

    if (!query) {
      searchDropdown.classList.add("hidden");
      return;
    }

    const filtered = allFatawa.filter(
      (f) =>
        f.Title.toLowerCase().includes(query) ||
        stripHtml(f.ArticleDescription || "").toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
      searchDropdown.innerHTML =
        '<div class="p-2 text-gray-500">کوئی نتیجہ نہیں ملا</div>';
    } else {
      filtered.slice(0, 10).forEach((fatwa) => {
        const option = document.createElement("div");
        option.className = "p-2 hover:bg-gray-100 cursor-pointer";
        option.textContent = fatwa.Title;

        option.addEventListener("click", () => {
          window.location.href = `/masailworld-frontend/Pages/Articledetail.html?id=${fatwa.ArticleID}`;
        });

        searchDropdown.appendChild(option);
      });
    }

    searchDropdown.classList.remove("hidden");
  });

  document.addEventListener("click", function (e) {
    if (
      !searchInput.contains(e.target) &&
      !searchDropdown.contains(e.target)
    ) {
      searchDropdown.classList.add("hidden");
    }
  });
});
