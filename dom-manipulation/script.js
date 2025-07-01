let quotes = loadQuotes(); // Load from localStorage if available


const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");

// ✅ Display a random quote and save it in sessionStorage
function displayRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerText = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  quoteDisplay.innerText = `"${quote.text}" — (${quote.category})`;

  // ✅ Store last viewed quote in sessionStorage
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

// ✅ Add new quote and save to localStorage
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText === "" || newCategory === "") {
    alert("Please fill in both fields.");
    return;
  }

  const newQuote = { text: newText, category: newCategory };
  quotes.push(newQuote);
  saveQuotes(); // ✅ Save to localStorage

  quoteDisplay.innerText = `"${newQuote.text}" — (${newQuote.category})`;

  textInput.value = "";
  categoryInput.value = "";
}

// ✅ Load quotes from localStorage
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (err) {
      console.error("Error parsing stored quotes:", err);
    }
  }
  return [
    { text: "Be yourself; everyone else is already taken.", category: "Inspiration" },
    { text: "Act as if what you do makes a difference. It does.", category: "Motivation" }
  ];
}

// ✅ Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ✅ JSON Export
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// ✅ JSON Import
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid format: Must be an array of quotes.");
      }
    } catch (err) {
      alert("Error reading JSON: " + err.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ✅ Event listeners
newQuoteBtn.addEventListener("click", displayRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);

// ✅ Initial load
displayRandomQuote();
