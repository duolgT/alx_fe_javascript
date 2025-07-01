let quotes = loadQuotes(); // Load from localStorage if available


const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");

// ✅ Display a random quote and save it in sessionStorage

// Utility: Get unique categories from quotes
function getUniqueCategories() {
  const categories = quotes.map(q => q.category.trim());
  return [...new Set(categories)];
}
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");

  // Reset dropdown
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  const uniqueCategories = getUniqueCategories();
  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.innerText = cat;
    categoryFilter.appendChild(option);
  });

  async function syncWithServer() {
  try {
    const response = await fetch("mock-quotes.json"); // Simulate your server endpoint
    const serverQuotes = await response.json();

    let conflicts = [];

    // Compare server quotes with local
    serverQuotes.forEach(serverQuote => {
      const match = quotes.find(
        q => q.text.trim() === serverQuote.text.trim()
      );

      if (!match) {
        // New quote from server → add it
        quotes.push(serverQuote);
      } else if (match.category !== serverQuote.category) {
        // Conflict detected → resolve by using server’s category
        conflicts.push({ text: match.text, local: match.category, server: serverQuote.category });
        match.category = serverQuote.category; // Server wins
      }
    });

    // Save updated quotes
    saveQuotes();
    populateCategories();

    if (conflicts.length > 0) {
      notifyUserOfConflicts(conflicts);
    } else {
      console.log("Quotes synced. No conflicts.");
    }
  } catch (err) {
    console.error("Error syncing with server:", err);
  }
}

// 🔁 Auto-sync every 30 seconds
setInterval(syncWithServer, 30000);


  // Restore last selected category
  const savedCategory = localStorage.getItem("lastSelectedCategory");
  if (savedCategory) {
    categoryFilter.value = savedCategory;
    filterQuotes(); // Apply filter on load
  }
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastSelectedCategory", selectedCategory);

  let filtered = quotes;
  if (selectedCategory !== "all") {
    filtered = quotes.filter(q => q.category === selectedCategory);
  }

  if (filtered.length === 0) {
    quoteDisplay.innerText = "No quotes in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  const quote = filtered[randomIndex];

  quoteDisplay.innerText = `"${quote.text}" — (${quote.category})`;

  // Save last viewed to session storage
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}



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
  saveQuotes();

  populateCategories(); // ✅ Update dropdown
  filterQuotes();       // ✅ Show a quote using current filter

  textInput.value = "";
  categoryInput.value = "";
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

populateCategories(); // ✅ Populate dropdown on load
filterQuotes();       // ✅ Apply filter or show all


function notifyUserOfConflicts(conflicts) {
  let message = "Conflicts resolved from server:\n";
  conflicts.forEach(conflict => {
    message += `• "${conflict.text}" — local: ${conflict.local}, server: ${conflict.server}\n`;
  });

  alert(message); // or show in a div if you prefer UI
}

