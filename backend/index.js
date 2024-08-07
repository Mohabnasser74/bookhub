const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const booksRouter = require("./router/books.route.js");
const usersRouter = require("./router/users.route.js");
const { ERROR } = require("./models/books.model");
const isAuthenticated = require("./middleware/isAuthenticated.js");

const app = express();

// Configure CORS
const corsOptions = {
  origin: ["http://localhost:5173", "https://booksub.onrender.com"],
  credentials: true,
};

app.use(cors(corsOptions));

// Apply middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Define the directory that contains the static files
const staticDirectory = path.join(__dirname, "/uploads");

// Use the static middleware to serve files from the static directory
app.use("/uploads", express.static(staticDirectory));

const store = new MongoDBSession({
  uri: process.env.URI_CONNECTION,
  collection: "sessions",
});

const sess = {
  secret: process.env.SESSION_SECRET || "MY_SESSION_SECRET_HAHAHA",
  resave: false,
  saveUninitialized: false,

  store: store,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  },
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1);
}

app.use(session(sess));

app.get("/", isAuthenticated, (_, res) => {
  res.json({
    data: null,
    message: "API",
  });
});

app.use("/books", booksRouter);
app.use("/users", usersRouter);

// Global error handler
app.use((error, req, res, next) => {
  if (error.name === "ValidationError") {
    if (error.errors.email) {
      return res.status(400).json({
        message: `${error.errors.email.message}`,
        code: 400,
        data: null,
      });
    }
  } else if (error.name === "MongoError" && error.code === 11000) {
    return res.status(409).json({
      message: "Duplicate key error",
      code: 409,
      data: null,
    });
  }

  res.status(error.status || 500).json({
    status: error.status || "ERROR",
    message: error.message,
    code: error.status || 500,
    data: null,
  });
});

// Global middleware for not found router
app.all("*", (req, res) => {
  res.status(404).json({
    status: ERROR,
    code: 404,
    data: null,
    message: "Page not found",
  });
});

// Connect to DB and start server
async function main() {
  await mongoose.connect(process.env.URI_CONNECTION);
  console.log("mongoose was started");
  app.listen(process.env.PORT, () => {
    console.log(`App is listening to port: ${process.env.PORT}`);
  });
}

main().catch((err) => console.log(err));
