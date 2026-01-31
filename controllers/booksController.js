const mongodb = require('../data/database');
const objectId = require('mongodb').ObjectId;

const getAllBooks = async (req, res) => {
  // #swagger.tags = ['Books']
  try {
    const result = await mongodb.getDatabase().db('library').collection('books').find();
    const books = await result.toArray();
    res.setHeader('Content-type', 'application/json');
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: err.message || 'An error occurred while getting all the books' });
  }
};

const getBookById = async (req, res) => {
  // #swagger.tags = ['Books']
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'Book ID is required' });
    }
    const bookId = new objectId(req.params.id);
    const result = await mongodb.getDatabase().db('library').collection('books').find({ _id: bookId });
    const books = await result.toArray();
    if (books.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.setHeader('Content-type', 'application/json');
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: err.message || 'An error occurred while getting the book by id' });
  }
};

const createBook = async (req, res) => {
  // #swagger.tags = ['Books']
  try {
    const requiredFields = ['title', 'author', 'publicationYear', 'genre', 'language', 'price', 'ratings'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    const book = {
      title: req.body.title,
      author: req.body.author,
      publicationYear: req.body.publicationYear,
      genre: req.body.genre,
      language: req.body.language,
      price: req.body.price,
      ratings: req.body.ratings
    };
    const response = await mongodb.getDatabase().db('library').collection('books').insertOne(book);
    if (response.acknowledged) {
      res.status(201).json({
        id: response.insertedId,
        message: 'Book created successfully',
        book: book
      });
    } else {
      res.status(500).json({ message: 'Failed to create book' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'An error occurred while creating the book' });
  }
};

const updateBook = async (req, res) => {
  // #swagger.tags = ['Books']
  try {
    const bookId = new objectId(req.params.id);
    const book = {
      title: req.body.title,
      author: req.body.author,
      publicationYear: req.body.publicationYear,
      genre: req.body.genre,
      language: req.body.language,
      price: req.body.price,
      ratings: req.body.ratings
    };
    const response = await mongodb.getDatabase().db('library').collection('books').replaceOne({ _id: bookId }, book);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Book not found or no changes made' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'An error occurred while updating the book' });
  }
};

const deleteBook = async (req, res) => {
  // #swagger.tags = ['Books']
  try {
    const bookId = new objectId(req.params.id);
    const response = await mongodb.getDatabase().db('library').collection('books').deleteOne({ _id: bookId });
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'An error occurred while deleting the book' });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};