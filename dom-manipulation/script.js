// ✅ Check 1: Existence of the quotes array with objects containing text and category
let quotes = [
  { text: "Believe you can and you're halfway there.", category: "Motivation" },
  { text: "Life is really simple, but we insist on making it complicated.", category: "Philosophy" },
  { text: "The only true wisdom is in knowing you know nothing.", category: "Wisdom" }
];

// ✅ Get DOM Elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const categorySelect = document.getElementById('categorySelect');
const addQuoteForm = document.getElementById('addQuoteForm');
const quoteText = document.getElementById('quoteText');
const quoteCategory = document.getElementById('quoteCategory');

// ✅ Check 2: Function to show a random quote
function displayRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filteredQuotes = quotes.filter(q => q.category === selectedCategory);

  // ✅ Check 3: Logic to select a random quote and update the DOM
  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];
  quoteDisplay.textContent = `"${randomQuote.text}"`;
}

// ✅ Check 4: Function to add a new quote
function addQuote(event) {
  event.preventDefault();

  const newText = quoteText.value.trim();
  const newCategory = quoteCategory.value.trim();

  // ✅ Check 5: Logic to add a new quote and update the DOM
  if (!newText || !newCategory) {
    alert("Please fill in both quote and category.");
    return;
  }

  quotes.push({ text: newText, category: newCategory });
  updateCategoryOptions();

  quoteText.value = "";
  quoteCategory.value = "";

  alert("New quote added!");
}

// Update dropdown categories from quotes array
function updateCategoryOptions() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categorySelect.innerHTML = ""; // Clear previous options

  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

// ✅ Check 6: Add event listeners
newQuoteBtn.addEventListener('click', displayRandomQuote);
addQuoteForm.addEventListener('submit', addQuote);

// Initialize the dropdown and display a quote
updateCategoryOptions();
displayRandomQuote();