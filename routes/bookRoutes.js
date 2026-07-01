const express = require("express");
const router = express.Router();

const {
  createBook,
  getBooks,
} = require("../controllers/bookController");

// Add a new book
router.post("/add", createBook);

// Get all books
router.get("/", getBooks);

module.exports = router;