# Notes Application

A full-stack notes application built with React, TypeScript, Express, and MongoDB.

## Repository

This project is hosted on GitHub: [https://github.com/smundev/test-challenge](https://github.com/smundev/test-challenge)

## Features

- Create, read, update, and delete notes
- Real-time validation for note creation and updates
- Confirmation dialog for note deletion
- Responsive Material-UI design
- TypeScript for type safety
- MongoDB for data persistence

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/smundev/test-challenge.git
cd test-challenge
```

2. Install dependencies:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Start MongoDB:

```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu/Debian
sudo service mongod start

# On Windows
net start MongoDB
```

4. Start the development servers:

```bash
# Start the backend server (from server directory)
npm run dev

# Start the frontend development server (from client directory)
npm start
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
test-challenge/
├── client/                 # React frontend
│   ├── public/            # Static files
│   └── src/               # Source files
│       ├── api/           # API client
│       ├── components/    # React components
│       └── views/         # Page components
└── server/                # Express backend
    ├── routes/            # API routes
    └── models/            # Database models
```

## API Endpoints

- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

## Technologies Used

- Frontend:

  - React
  - TypeScript
  - Material-UI
  - Axios

- Backend:
  - Express.js
  - MongoDB
  - Mongoose
  - CORS

## License

This project is licensed under the MIT License.
