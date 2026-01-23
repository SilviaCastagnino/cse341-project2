const mongodb = require('../data/database');
const objectId = require('mongodb').ObjectId;

const getAllBooks = async (req, res) => {
  // #swagger.tags = ['Books']
  const result = await mongodb.getDatabase().db('library').collection('books').find();
  result.toArray().then((books) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(books);
  });
};

const getBookById = async (req, res) => {
  // #swagger.tags = ['Books']
  const bookId = new objectId(req.params.id);
  const result = await mongodb.getDatabase().db('library').collection('books').find({ _id: bookId });
  result.toArray().then((books) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(books[0]);
  });
};

const createBook = async (req, res) => {
  // #swagger.tags = ['Books']
  const book = {
    title: req.body.title,
    author: req.body.author,
    isbn: req.body.isbn,
    genre: req.body.genre,
    publicationYear: req.body.publicationYear,
    pages: req.body.pages,
    language: req.body.language,
    publisher: req.body.publisher
  };
  const response = await mongodb.getDatabase().db('library').collection('books').insertOne(book);
  if (response.acknowledged) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while creating the book.');
  }
};

const updateBook = async (req, res) => {
  // #swagger.tags = ['Books']
  const bookId = new objectId(req.params.id);
  const book = {
    title: req.body.title,
    author: req.body.author,
    isbn: req.body.isbn,
    genre: req.body.genre,
    publicationYear: req.body.publicationYear,
    pages: req.body.pages,
    language: req.body.language,
    publisher: req.body.publisher
  };
  const response = await mongodb.getDatabase().db('library').collection('books').updateOne({ _id: bookId }, { $set: book });
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the book.');
  }
};

const deleteBook = async (req, res) => {
  // #swagger.tags = ['Books']
  const bookId = new objectId(req.params.id);
  const response = await mongodb.getDatabase().db('library').collection('books').deleteOne({ _id: bookId });
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while deleting the book.');
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};