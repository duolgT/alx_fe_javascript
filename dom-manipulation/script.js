let quotes = [];

// Load from localStorage if available
function loadQuotes() {
  const stored = localStorage.getItem('quotes');
  if (stored) {
    quotes = JSON.parse(stored);
  } else {
    // Fallback default quotes
    quotes = [
      { text: "Believe you can and you're halfway there.", category: "Motivation" },
      { text: "Life is really simple, but we insist on making it complicated.", category: "Philosophy" },
      { text: "The only true wisdom is in knowing you know nothing.", category: "Wisdom" }
    ];
    saveQuotes(); // Save initial data
  }
}

// Save to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Save last viewed quote to sessionStorage
function saveLastViewedQuote(text) {
  sessionStorage.setItem('lastQuote', text);
}

// Get DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const categorySelect = document.getElementById('categorySelect');
const addQuoteForm = document.getElementById('addQuoteForm');
const quoteText = document.getElementById('quoteText');
const quoteCategory = document.getElementById('quoteCategory');
const importFileInput = document.getElementById('importFile');
const exportBtn = document.getElementById('exportBtn');

// Update <select> options
function updateCategoryOptions() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categorySelect.innerHTML = '';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

// Display random quote
function displayRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filtered = quotes.filter(q => q.category === selectedCategory);
  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes available in this category.";
    return;
  }
  const random = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.textContent = `"${random.text}"`;
  saveLastViewedQuote(random.text); // Save to session
}

// Add new quote
function addQuote(event) {
  event.preventDefault();
  const text = quoteText.value.trim();
  const category = quoteCategory.value.trim();

  if (!text || !category) {
    alert("Both fields are required.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  updateCategoryOptions();
  quoteText.value = "";
  quoteCategory.value = "";
  alert("Quote added!");
}

// Export quotes as JSON
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = 'quotes.json';
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

// Import from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        updateCategoryOptions();
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid JSON format!');
      }
    } catch (err) {
      alert('Error parsing file: ' + err.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Event listeners
newQuoteBtn.addEventListener('click', displayRandomQuote);
addQuoteForm.addEventListener('submit', addQuote);
exportBtn.addEventListener('click', exportToJsonFile);
importFileInput.addEventListener('change', importFromJsonFile);

// Initialize app
loadQuotes();
updateCategoryOptions();

// Show last viewed quote if available
const lastViewed = sessionStorage.getItem('lastQuote');
if (lastViewed) {
  quoteDisplay.textContent = `"${lastViewed}"`;
} else {
  displayRandomQuote();
}
