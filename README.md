# Test1 - Express.js CRUD API

A simple Express.js server with CRUD (Create, Read, Update, Delete) API endpoints for managing items.

## Features

- ✅ Express.js server setup
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ JSON API responses
- ✅ Error handling
- ✅ Input validation
- ✅ In-memory data storage

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Start the server

```bash
npm start
```

The server will start on `http://localhost:3000`

### API Endpoints

#### Welcome Message
- **GET** `/` - Get API documentation and available endpoints

#### Items CRUD Operations

- **GET** `/api/items` - Get all items
- **GET** `/api/items/:id` - Get a specific item by ID
- **POST** `/api/items` - Create a new item
- **PUT** `/api/items/:id` - Update an existing item
- **DELETE** `/api/items/:id` - Delete an item

### Example API Usage

#### Create an item
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"name":"My Item","description":"Item description"}' \
  http://localhost:3000/api/items
```

#### Get all items
```bash
curl http://localhost:3000/api/items
```

#### Get item by ID
```bash
curl http://localhost:3000/api/items/1
```

#### Update an item
```bash
curl -X PUT -H "Content-Type: application/json" \
  -d '{"name":"Updated Item","description":"Updated description"}' \
  http://localhost:3000/api/items/1
```

#### Delete an item
```bash
curl -X DELETE http://localhost:3000/api/items/1
```

### Request/Response Format

#### Item Object
```json
{
  "id": 1,
  "name": "Item Name",
  "description": "Item Description",
  "createdAt": "2025-06-26T15:25:18.181Z",
  "updatedAt": "2025-06-26T15:25:18.181Z"
}
```

#### Create Item Request
```json
{
  "name": "Item Name",        // Required
  "description": "Optional description"
}
```

#### Update Item Request
```json
{
  "name": "Updated Name",     // Optional
  "description": "Updated description"  // Optional
}
```

## Project Structure

```
├── package.json      # Node.js dependencies and scripts
├── server.js         # Main Express.js server file
└── README.md         # Project documentation
```

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework for Node.js
- **JSON** - Data format for API requests/responses
