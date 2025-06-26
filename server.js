const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory data store (in production, you'd use a database)
let items = [
  { id: 1, name: 'Item 1', description: 'First item', createdAt: new Date().toISOString() },
  { id: 2, name: 'Item 2', description: 'Second item', createdAt: new Date().toISOString() }
];
let nextId = 3;

// Helper function to find item by ID
const findItemById = (id) => items.find(item => item.id === parseInt(id));

// Routes

// GET / - Welcome message
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Express.js CRUD API',
    endpoints: {
      'GET /api/items': 'Get all items',
      'GET /api/items/:id': 'Get item by ID',
      'POST /api/items': 'Create new item',
      'PUT /api/items/:id': 'Update item by ID',
      'DELETE /api/items/:id': 'Delete item by ID'
    }
  });
});

// CREATE - POST /api/items
app.post('/api/items', (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const newItem = {
      id: nextId++,
      name,
      description: description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    items.push(newItem);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// READ - GET /api/items (get all items)
app.get('/api/items', (req, res) => {
  try {
    res.json({
      count: items.length,
      items: items
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// READ - GET /api/items/:id (get single item)
app.get('/api/items/:id', (req, res) => {
  try {
    const item = findItemById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// UPDATE - PUT /api/items/:id
app.put('/api/items/:id', (req, res) => {
  try {
    const item = findItemById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const { name, description } = req.body;
    
    if (name !== undefined) item.name = name;
    if (description !== undefined) item.description = description;
    item.updatedAt = new Date().toISOString();

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// DELETE - DELETE /api/items/:id
app.delete('/api/items/:id', (req, res) => {
  try {
    const itemIndex = items.findIndex(item => item.id === parseInt(req.params.id));
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const deletedItem = items.splice(itemIndex, 1)[0];
    res.json({ message: 'Item deleted successfully', item: deletedItem });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server only if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log('  GET    /                    - API documentation');
    console.log('  GET    /api/items           - Get all items');
    console.log('  GET    /api/items/:id       - Get item by ID');
    console.log('  POST   /api/items           - Create new item');
    console.log('  PUT    /api/items/:id       - Update item by ID');
    console.log('  DELETE /api/items/:id       - Delete item by ID');
  });
}

module.exports = app;