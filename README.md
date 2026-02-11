# Text File Organizer Web API

A simple Node.js Web API for organizing and working with text files on a web server. Built using only the HTTP and FS modules (no Express framework).

## Features

- Create/Overwrite text files
- Read file contents
- Append data to existing files
- Delete files
- List all text files
- Simple web-based frontend interface

## Project Structure

```
project1-solution/
├── server.js          # Main Node.js server
├── package.json       # Project metadata
├── public/
│   └── index.html     # Frontend web interface
├── storage/           # Folder where text files are stored (created automatically)
└── README.md          # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v12 or higher)

### Steps to Run

1. Navigate to the project directory:
   ```powershell
   cd "c:\Users\MAROUN\Documents\USEK\Courses\CSC456 - Advanced Web Programming\projects\project1-solution"
   ```

2. Start the server:
   ```powershell
   node server.js
   ```
   
   Or using the npm script:
   ```powershell
   npm start
   ```

3. Open your browser and visit:
   ```
   http://localhost:3000/organizer
   ```

4. Use the web interface to test the API

## API Endpoints

### 1. Get All Files
- **Route:** `/textfile-api/all`
- **Method:** `GET`
- **Description:** Returns a list of all text files stored on the server
- **Response:** `{ files: ["file1.txt", "file2.txt"] }`

### 2. Create/Overwrite File
- **Route:** `/textfile-api/new?filename=[filename]&data=[data]`
- **Method:** `GET`
- **Description:** Creates a new text file or overwrites existing one
- **Parameters:**
  - `filename`: Name of the file (with or without .txt extension)
  - `data`: Content of the file (URL encoded)
- **Response:** `{ message: "File created successfully", filename: "file.txt" }`

### 3. Read File
- **Route:** `/textfile-api/read?filename=[filename]`
- **Method:** `GET`
- **Description:** Returns the content of a specific text file
- **Parameters:**
  - `filename`: Name of the file to read
- **Response:** `{ filename: "file.txt", content: "file content here" }`

### 4. Delete File
- **Route:** `/textfile-api/remove?filename=[filename]`
- **Method:** `GET`
- **Description:** Deletes a specific text file
- **Parameters:**
  - `filename`: Name of the file to delete
- **Response:** `{ message: "File deleted successfully", filename: "file.txt" }`

### 5. Append to File
- **Route:** `/textfile-api/append?filename=[filename]&data=[data]`
- **Method:** `GET`
- **Description:** Appends data to the end of an existing text file
- **Parameters:**
  - `filename`: Name of the file to append to
  - `data`: Content to append (URL encoded)
- **Response:** `{ message: "Data appended successfully", filename: "file.txt" }`

## Testing

### Using the Web Interface
Visit `http://localhost:3000/organizer` and use the forms to:
- Create new files
- Read file contents
- Append data to files
- Delete files
- View all files

### Manual Testing (cURL or Browser)

**Create a file:**
```
http://localhost:3000/textfile-api/new?filename=test&data=Hello%20World
```

**Read a file:**
```
http://localhost:3000/textfile-api/read?filename=test.txt
```

**List all files:**
```
http://localhost:3000/textfile-api/all
```

**Append to a file:**
```
http://localhost:3000/textfile-api/append?filename=test.txt&data=%20More%20data
```

**Delete a file:**
```
http://localhost:3000/textfile-api/remove?filename=test.txt
```

## Storage Directory

Text files are automatically stored in the `storage/` folder at the root of the project. The folder is created automatically when the server starts if it doesn't exist.

## Notes

- All text files must have a `.txt` extension
- If a filename is provided without the `.txt` extension, it will be added automatically
- File data should be URL encoded when making API requests
- The storage directory is created automatically on first run
- CORS is enabled for development purposes

## Frontend Features

The web interface includes:
- Form-based API testing
- Real-time file listing with quick actions
- Activity log with timestamps
- Color-coded success/error messages
- Responsive design (works on mobile and desktop)

## License

MIT
