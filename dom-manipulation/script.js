let quotes = [];
const SYNC_INTERVAL = 30000; // 30 seconds
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts'; // mock endpoint

// Load and Save
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  quotes = storedQuotes ? JSON.parse(storedQuotes) : [];
}

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Notification
function showSyncStatus(message) {
  const syncStatus = document.getElementById('syncStatus');
  syncStatus.textContent = message;
  syncStatus.style.display = 'block';
  setTimeout(() => (syncStatus.style.display = 'none'), 4000);
}

// Simulate fetching server data
async function fetchFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();
    const serverQuotes = serverData.slice(0, 5).map((item, index) => ({
      text: item.title,
      category: 'Server',
      id: index + 1000, // simulate unique server ID
      updatedAt: Date.now()
    }));

    resolveConflicts(serverQuotes);
  } catch (error) {
    console.error("Fetch failed:", error);
  }
}

// Simulate posting to server
async function pushToServer(localQuote) {
  try {
    await fetch(SERVER_URL, {
      method: 'POST',
      body: JSON.stringify(localQuote),
      headers: { 'Content-type': 'application/json; charset=UTF-8' }
    });
    showSyncStatus("Synced new quote to server.");
  } catch (err) {
    console.error("Failed to sync to server:", err);
  }
}

// Conflict resolution (server wins)
function resolveConflicts(serverQuotes) {
  let updated = false;
  serverQuotes.forEach(serverQuote => {
    const localMatch = quotes.find(q => q.id === serverQuote.id);
    if (!localMatch) {
      quotes.push(serverQuote);
      updated = true;
    } else if (serverQuote.updatedAt > localMatch.updatedAt) {
      Object.assign(localMatch, serverQuote); // overwrite
      updated = true;
    }
  });

  if (updated) {
    saveQuotes();
    populateCategories();
    filterQuotes();
    showSyncStatus("Quotes updated from server.");
  }
}

// Periodic syncing
function startSync() {
  setInterval(fetchFromServer, SYNC_INTERVAL);
}

// Add timestamps and IDs
function addQuoteWithSync(event) {
  event.preventDefault();

  const text = quoteText.value.trim();
  const category = quoteCategory.value.trim();
  if (!text || !category) return alert("Fields are required");

  const newQuote = {
    id: Date.now(), // simulate unique ID
    text,
    category,
    updatedAt: Date.now()
  };

  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  filterQuotes();
  pushToServer(newQuote);
  quoteText.value = "";
  quoteCategory.value = "";
  alert("Quote added and synced!");
}
loadQuotes();
populateCategories();
filterQuotes();
startSync(); // start periodic sync
// Event listeners
document.getElementById('addQuoteForm').addEventListener('submit', addQuoteWithSync);
document.getElementById('quoteCategory').addEventListener('change', filterQuotes);