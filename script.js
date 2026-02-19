let allBooks = [];
const container = document.getElementById('bookContainer');
const searchBar = document.getElementById('searchBar');
const genreFilter = document.getElementById('genreFilter');

// Load books
async function loadBooks() {
  try {
    const res = await fetch('books.json');
    allBooks = await res.json();
    populateGenres();
    displayBooks(allBooks);
    updateFavCount();
  } catch (error) {
    console.error("Error loading books:", error);
  }
}

// Display books
function displayBooks(books) {
  container.innerHTML = '';
  if (books.length === 0) {
    container.innerHTML = '<p class="empty-msg">No books found!</p>';
    return;
  }
  books.forEach(book => {
    const card = document.createElement('div');
    card.classList.add('book-card');
    card.innerHTML = `
      <img src="${book.image}" alt="${book.title}">
      <h3>${book.title}</h3>
      <p>By ${book.author}</p>
      <p>Genre: ${book.genre}</p>
      <p>⭐ ${book.rating}</p>
      <button onclick="addToFavorites(${book.id})">Add to Favorites</button>
    `;
    container.appendChild(card);
  });
}

// Favorites logic
function updateFavCount() {
  const favs = JSON.parse(localStorage.getItem('favorites')) || [];
  const countEl = document.getElementById('favCount');
  if (countEl) countEl.textContent = favs.length;
}

function addToFavorites(id) {
  const book = allBooks.find(b => b.id === id);
  let favs = JSON.parse(localStorage.getItem('favorites')) || [];
  if (!favs.some(b => b.id === id)) {
    favs.push(book);
    localStorage.setItem('favorites', JSON.stringify(favs));
    showToast(`${book.title} added to favorites!`); // Fixed: template literal backticks
    updateFavCount();
  } else {
    showToast('Already in favorites!');
  }
}

// Toast notification
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'show';
  setTimeout(() => toast.className = toast.className.replace('show', ''), 2000);
}

// Genre filter setup
function populateGenres() {
  const genres = [...new Set(allBooks.map(b => b.genre))];
  genres.forEach(g => {
    const opt = document.createElement('option');
    opt.value = g;
    opt.textContent = g;
    genreFilter.appendChild(opt);
  });
}

// Filter logic
function filterBooks() {
  const query = searchBar.value.toLowerCase();
  const genre = genreFilter.value;
  let filtered = allBooks.filter(b =>
    b.title.toLowerCase().includes(query) ||
    b.author.toLowerCase().includes(query)
  );
  if (genre !== 'all') {
    filtered = filtered.filter(b => b.genre === genre);
  }
  displayBooks(filtered);
}

// Event listeners
searchBar.addEventListener('input', filterBooks);
genreFilter.addEventListener('change', filterBooks);

const modeBtn = document.getElementById('toggleMode');
modeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  modeBtn.textContent = document.body.classList.contains('dark')
    ? '🌙 Dark Mode'
    : '🌞 Light Mode';
});

loadBooks();