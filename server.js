const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Connect Database
const connectDB = require("./server/config/db");

// Init Middleware
app.use(express.json());

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:3000", // React development server
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Define Routes
try {
  console.log("Loading routes...");
  app.use("/api/auth", require("./server/routes/api/auth"));
  app.use("/api/users", require("./server/routes/api/users"));
  app.use("/api/profile", require("./server/routes/api/profile"));
  app.use("/api/posts", require("./server/routes/api/posts"));
  app.use("/api/notes", require("./server/routes/api/notes"));
  console.log("Routes loaded successfully");
} catch (err) {
  console.error("Route loading error:", err);
  process.exit(1);
}

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5025;

// Start server after database connection
const startServer = async () => {
  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (err) {
    console.error("Server startup error:", err);
    process.exit(1);
  }
};

startServer();
