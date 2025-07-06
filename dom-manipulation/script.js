// Step 1: Initialize the quotes array with some sample quotes
const quotes = [
  { text: "The journey of a thousand miles begins with a single step.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "You miss 100% of the shots you don’t take.", category: "Motivation" }
];

// Step 2: Display a random quote
function displayRandomQuote() {
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

// Step 3: Add a new quote dynamically
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText === '' || newCategory === '') {
    alert("Please enter both quote text and category.");
    return;
  }

  const newQuote = { text: newText, category: newCategory };
  quotes.push(newQuote);

  // Optionally display the new quote right away
  displayRandomQuote();

  // Clear inputs
  textInput.value = '';
  categoryInput.value = '';
}

// Step 4: Event listeners
document.getElementById('newQuote').addEventListener('click', displayRandomQuote);

// Initial quote display on page load
window.addEventListener('DOMContentLoaded', displayRandomQuote);
