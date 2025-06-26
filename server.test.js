const request = require('supertest');
const app = require('./server');

describe('Express.js CRUD API', () => {
  // Test data
  let createdItemId;

  describe('GET /', () => {
    it('should return welcome message with API documentation', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('endpoints');
      expect(response.body.message).toBe('Welcome to Express.js CRUD API');
      expect(response.body.endpoints).toHaveProperty('GET /api/items');
    });
  });

  describe('POST /api/items', () => {
    it('should create a new item with valid data', async () => {
      const newItem = {
        name: 'Test Item',
        description: 'This is a test item'
      };

      const response = await request(app)
        .post('/api/items')
        .send(newItem);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newItem.name);
      expect(response.body.description).toBe(newItem.description);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');

      // Save the ID for later tests
      createdItemId = response.body.id;
    });

    it('should create item with only name (description optional)', async () => {
      const newItem = {
        name: 'Item without description'
      };

      const response = await request(app)
        .post('/api/items')
        .send(newItem);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(newItem.name);
      expect(response.body.description).toBe('');
    });

    it('should return 400 if name is missing', async () => {
      const invalidItem = {
        description: 'Missing name field'
      };

      const response = await request(app)
        .post('/api/items')
        .send(invalidItem);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Name is required');
    });

    it('should return 400 if name is empty', async () => {
      const invalidItem = {
        name: '',
        description: 'Empty name field'
      };

      const response = await request(app)
        .post('/api/items')
        .send(invalidItem);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Name is required');
    });
  });

  describe('GET /api/items', () => {
    it('should return all items with count', async () => {
      const response = await request(app).get('/api/items');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('count');
      expect(response.body).toHaveProperty('items');
      expect(Array.isArray(response.body.items)).toBe(true);
      expect(response.body.count).toBe(response.body.items.length);
      expect(response.body.count).toBeGreaterThan(0);
    });

    it('should return items with correct structure', async () => {
      const response = await request(app).get('/api/items');

      expect(response.status).toBe(200);
      const firstItem = response.body.items[0];
      expect(firstItem).toHaveProperty('id');
      expect(firstItem).toHaveProperty('name');
      expect(firstItem).toHaveProperty('description');
      expect(firstItem).toHaveProperty('createdAt');
    });
  });

  describe('GET /api/items/:id', () => {
    it('should return a specific item by ID', async () => {
      const response = await request(app).get(`/api/items/${createdItemId}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(createdItemId);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('createdAt');
    });

    it('should return 404 for non-existent item', async () => {
      const nonExistentId = 99999;
      const response = await request(app).get(`/api/items/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Item not found');
    });

    it('should handle invalid ID format', async () => {
      const response = await request(app).get('/api/items/invalid-id');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Item not found');
    });
  });

  describe('PUT /api/items/:id', () => {
    it('should update an existing item', async () => {
      const updateData = {
        name: 'Updated Test Item',
        description: 'Updated description'
      };

      const response = await request(app)
        .put(`/api/items/${createdItemId}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(createdItemId);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.description).toBe(updateData.description);
      expect(response.body).toHaveProperty('updatedAt');
    });

    it('should update only provided fields', async () => {
      const updateData = {
        name: 'Only name updated'
      };

      const response = await request(app)
        .put(`/api/items/${createdItemId}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.description).toBe('Updated description'); // Should remain from previous test
    });

    it('should return 404 for non-existent item', async () => {
      const nonExistentId = 99999;
      const updateData = {
        name: 'Updated Item'
      };

      const response = await request(app)
        .put(`/api/items/${nonExistentId}`)
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Item not found');
    });
  });

  describe('DELETE /api/items/:id', () => {
    it('should delete an existing item', async () => {
      const response = await request(app).delete(`/api/items/${createdItemId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('item');
      expect(response.body.message).toBe('Item deleted successfully');
      expect(response.body.item.id).toBe(createdItemId);
    });

    it('should return 404 when trying to delete the same item again', async () => {
      const response = await request(app).delete(`/api/items/${createdItemId}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Item not found');
    });

    it('should return 404 for non-existent item', async () => {
      const nonExistentId = 99999;
      const response = await request(app).delete(`/api/items/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Item not found');
    });
  });

  describe('Error handling', () => {
    it('should return 404 for unknown endpoints', async () => {
      const response = await request(app).get('/api/unknown');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Endpoint not found');
    });

    it('should handle malformed JSON in POST request', async () => {
      const response = await request(app)
        .post('/api/items')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });
  });

  describe('Data persistence during test session', () => {
    it('should maintain data consistency across requests', async () => {
      // Create an item
      const newItem = {
        name: 'Persistence Test Item',
        description: 'Testing data persistence'
      };

      const createResponse = await request(app)
        .post('/api/items')
        .send(newItem);

      const itemId = createResponse.body.id;

      // Retrieve the item
      const getResponse = await request(app).get(`/api/items/${itemId}`);
      
      expect(getResponse.status).toBe(200);
      expect(getResponse.body.name).toBe(newItem.name);

      // Update the item
      const updateData = { name: 'Updated Persistence Item' };
      const updateResponse = await request(app)
        .put(`/api/items/${itemId}`)
        .send(updateData);

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.name).toBe(updateData.name);

      // Verify the update persisted
      const getUpdatedResponse = await request(app).get(`/api/items/${itemId}`);
      expect(getUpdatedResponse.body.name).toBe(updateData.name);

      // Clean up
      await request(app).delete(`/api/items/${itemId}`);
    });
  });
});