const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Storage folder path
const STORAGE_DIR = path.join(__dirname, 'storage');

// Create storage directory if it doesn't exist
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

// Create the server
const server = http.createServer((req, res) => {
  // Enable CORS for API calls
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Parse the URL and query string
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  console.log(`Request: ${req.method} ${req.url}`);

  // Route: Serve the frontend
  if (pathname === '/organizer') {
    serveOrganizer(res);
    return;
  }

  // API Routes
  if (pathname === '/textfile-api/all' && req.method === 'GET') {
    getAllFiles(res);
  }
  else if (pathname === '/textfile-api/new' && req.method === 'GET') {
    createFile(res, query.filename, query.data);
  }
  else if (pathname === '/textfile-api/read' && req.method === 'GET') {
    readFile(res, query.filename);
  }
  else if (pathname === '/textfile-api/remove' && req.method === 'GET') {
    removeFile(res, query.filename);
  }
  else if (pathname === '/textfile-api/append' && req.method === 'GET') {
    appendFile(res, query.filename, query.data);
  }
  else {
    // 404 Not Found
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
  }
});

// Handler: Serve the organizer frontend
function serveOrganizer(res) {
  const filePath = path.join(__dirname, 'public', 'index.html');
  
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to load organizer page' }));
      return;
    }
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
}

// Handler: Get all text files
function getAllFiles(res) {
  fs.readdir(STORAGE_DIR, (err, files) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to read storage directory' }));
      return;
    }

    // Filter only .txt files
    const txtFiles = files.filter(file => file.endsWith('.txt'));

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ files: txtFiles }));
  });
}

// Handler: Create a new file
function createFile(res, filename, data) {
  if (!filename || !data) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing filename or data' }));
    return;
  }

  // Ensure filename has .txt extension
  if (!filename.endsWith('.txt')) {
    filename += '.txt';
  }

  const filePath = path.join(STORAGE_DIR, filename);

  // Decode URL-encoded data
  const decodedData = decodeURIComponent(data);

  fs.writeFile(filePath, decodedData, 'utf-8', (err) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to create file' }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'File created successfully', filename: filename }));
  });
}

// Handler: Read a file
function readFile(res, filename) {
  if (!filename) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing filename' }));
    return;
  }

  // Ensure filename has .txt extension
  if (!filename.endsWith('.txt')) {
    filename += '.txt';
  }

  const filePath = path.join(STORAGE_DIR, filename);

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'File not found' }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ filename: filename, content: data }));
  });
}

// Handler: Remove a file
function removeFile(res, filename) {
  if (!filename) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing filename' }));
    return;
  }

  // Ensure filename has .txt extension
  if (!filename.endsWith('.txt')) {
    filename += '.txt';
  }

  const filePath = path.join(STORAGE_DIR, filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'File not found or cannot be deleted' }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'File deleted successfully', filename: filename }));
  });
}

// Handler: Append to a file
function appendFile(res, filename, data) {
  if (!filename || !data) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing filename or data' }));
    return;
  }

  // Ensure filename has .txt extension
  if (!filename.endsWith('.txt')) {
    filename += '.txt';
  }

  const filePath = path.join(STORAGE_DIR, filename);

  // Decode URL-encoded data
  const decodedData = decodeURIComponent(data);

  fs.appendFile(filePath, decodedData, 'utf-8', (err) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to append to file' }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Data appended successfully', filename: filename }));
  });
}

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Visit http://localhost:${PORT}/organizer to access the frontend`);
});
