const Book = require("../models/Book");

// =========================
// Add a New Book
// =========================
exports.createBook = async (req, res) => {
  try {
    const { title, description, price, fileName } = req.body;

    const book = await Book.create({
      title,
      description,
      price,
      fileName,
    });

    res.status(201).json({
      success: true,
      message: "Book added successfully",
      book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Get All Books
// =========================
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find();

    res.status(200).json({
      success: true,
      count: books.length,
      books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};