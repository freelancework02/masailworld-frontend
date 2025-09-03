// Call this after DOM is ready (e.g., in <script> at end of body or window.onload)

async function renderLatestArticles() {
  const apiUrl = 'https://masailworld.onrender.com/api/article/paged?page=1&limit=3';
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Network response was not ok');
    const articles = await response.json();

    // Find the container to insert cards into:
    const container = document.querySelector('#qs-fatawa-home .space-y-6');
    container.innerHTML = ''; // Clear previous (static) content, if any

    articles.forEach((article, idx) => {
      const card = document.createElement('a');
      card.href = `#article-${article.ArticleID}`; // or to your detail route
      card.className =
        'nav-link ms-card-fatwa block bg-white p-4 border border-ash_gray rounded-lg hover:shadow-lg hover:border-midnight_green-200 transition-all duration-300';

      card.innerHTML = `
        <div class="flex items-start">
          <div class="ms-fatwa-num flex-shrink-0 flex items-center justify-center w-12 h-12 bg-midnight_green text-white font-bold text-2xl rounded-md ml-4 shadow-md">${idx +
            1}</div>
          <div class="flex-grow">
            <h3 class="ms-card-title text-2xl font-semibold text-rich_black">${article.Title}</h3>
            <p class="ms-card-text text-rich_black-600 text-base mt-2 mb-3 leading-relaxed line-clamp-1">
              ${article.Title ?? ''}
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
    console.error('Failed to fetch articles', error);
    // Optionally show error message in UI
  }
}

// Call the function once DOM is ready
window.addEventListener('DOMContentLoaded', renderLatestArticles);
