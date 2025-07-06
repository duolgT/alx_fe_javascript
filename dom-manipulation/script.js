// Quotes array with text and category
const quotes = [
  { text: "The journey of a thousand miles begins with a single step.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "You miss 100% of the shots you don’t take.", category: "Motivation" }
];

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `
    <blockquote>
      <p>"${quote.text}"</p>
      <footer><em>Category: ${quote.category}</em></footer>
    </blockquote>
  `;
}

// Function to add a new quote to the array and DOM
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (!newText || !newCategory) {
    alert("Please enter both quote text and category.");
    return;
  }

  const newQuote = { text: newText, category: newCategory };
  quotes.push(newQuote);

  // Optionally show the new quote immediately
  showRandomQuote();

  // Clear inputs
  textInput.value = '';
  categoryInput.value = '';
}

// Attach event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Initial display on page load
window.addEventListener('DOMContentLoaded', showRandomQuote);
