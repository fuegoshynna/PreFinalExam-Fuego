import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Allows our app to accept JSON data in request bodies

// A simple in-memory "database" for demonstration purposes
let items = [
  { id: 1, name: 'Item One' },
  { id: 2, name: 'Item Two' }
];

// --- ROUTES ---

// 1. Home / Test Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Backend API!' });
});

// 2. GET: Retrieve all items
app.get('/api/items', (req, res) => {
  res.json(items);
});

// 3. GET: Retrieve a single item by ID
app.get('/api/items/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const item = items.find(i => i.id === itemId);
  
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  res.json(item);
});

// 4. POST: Create a new item
app.post('/api/items', (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const newItem = {
    id: items.length > 0 ? items[items.length - 1].id + 1 : 1,
    name: name
  };

  items.push(newItem);
  res.status(201).json(newItem);
});

// 5. PUT: Update an existing item
app.put('/api/items/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const { name } = req.body;
  
  const item = items.find(i => i.id === itemId);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  if (!name) {
    return res.status(400).json({ error: 'Name is required for update' });
  }

  item.name = name;
  res.json(item);
});

// 6. DELETE: Remove an item
app.delete('/api/items/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const index = items.findIndex(i => i.id === itemId);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const deletedItem = items.splice(index, 1);
  res.json({ message: 'Item deleted successfully', deletedItem });
});

// --- SEARCH ENDPOINT ---
app.get('/api/search', async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: 'Search query parameter "q" is required.' });
  }

  const cleanQuery = query.trim().toLowerCase();

  // 1. If the user searches for a domain/URL like "flaneur.com"
  if (cleanQuery.includes('.') && !cleanQuery.includes(' ')) {
    let targetUrl = cleanQuery;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://${targetUrl}`;
    }

    return res.json({
      type: 'url',
      query: cleanQuery,
      targetUrl: targetUrl,
      message: `Directing to domain: ${targetUrl}`
    });
  }

  // 2. Otherwise, treat it as a database keyword search
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(cleanQuery)
  );

  return res.json({
    type: 'search_results',
    query: cleanQuery,
    resultsCount: filteredItems.length,
    results: filteredItems
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});