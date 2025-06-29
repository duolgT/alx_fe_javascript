let quotes = [];

function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  quotes = storedQuotes ? JSON.parse(storedQuotes) : [
    { text: "Believe you can and you're halfway there.", category: "Motivation" },
    { text: "Life is simple, but we insist on making it complicated.", category: "Philosophy" },
    { text: "The only true wisdom is knowing you know nothing.", category: "Wisdom" }
  ];
  saveQuotes();
}

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function saveLastFilter(category) {
  localStorage.setItem('lastCategoryFilter', category);
}

function getLastFilter() {
  return localStorage.getItem('lastCategoryFilter') || "all";
}

// DOM Elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteForm = document.getElementById('addQuoteForm');
const quoteText = document.getElementById('quoteText');
const quoteCategory = document.getElementById('quoteCategory');
const importFileInput = document.getElementById('importFile');
const exportBtn = document.getElementById('exportBtn');
const categoryFilter = document.getElementById('categoryFilter');

// Step 2: Populate Categories Dynamically
function populateCategories() {
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = "";

  const allOption = document.createElement('option');
  allOption.value = "all";
  allOption.textContent = "All Categories";
  categoryFilter.appendChild(allOption);

  uniqueCategories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const savedCategory = getLastFilter();
  categoryFilter.value = savedCategory;
}

// Step 2: Filter Quotes by Selected Category
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  saveLastFilter(selectedCategory);
  showQuoteFromCategory(selectedCategory);
}

// Display random quote from filtered category
function showQuoteFromCategory(category) {
  const filtered = category === "all" ? quotes : quotes.filter(q => q.category === category);
  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes found in this category.";
    return;
  }

  const random = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.textContent = `"${random.text}"`;
  sessionStorage.setItem('lastQuote', random.text);
}

// Add a new quote and update filters
function addQuote(event) {
  event.preventDefault();

  const text = quoteText.value.trim();
  const category = quoteCategory.value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories(); // Update filter options
  filterQuotes(); // Refresh display
  quoteText.value = "";
  quoteCategory.value = "";
  alert("Quote added!");
}

// Export quotes to JSON file
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'quotes.json';
  link.click();
  URL.revokeObjectURL(url);
}

// Import from JSON file
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid JSON format.');
      }
    } catch (err) {
      alert('Import failed: ' + err.message);
    }
  };
  reader.readAsText(event.target.files[0]);
}

// Event Listeners
newQuoteBtn.addEventListener('click', filterQuotes);
addQuoteForm.addEventListener('submit', addQuote);
exportBtn.addEventListener('click', exportToJsonFile);
importFileInput.addEventListener('change', importFromJsonFile);
categoryFilter.addEventListener('change', filterQuotes);

// App Init
loadQuotes();
populateCategories();
filterQuotes();
// Display last quote on page load
const lastQuote = sessionStorage.getItem('lastQuote');