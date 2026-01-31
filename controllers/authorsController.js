const mongodb = require('../data/database');
const objectId = require('mongodb').ObjectId;

const getAllAuthors = async (req, res) => {
  // #swagger.tags = ['Authors']
  try {
    const result = await mongodb.getDatabase().db('library').collection('authors').find();
    const authors = await result.toArray();
    res.setHeader('Content-type', 'application/json');
    res.status(200).json(authors);
  } catch (err) {
    res.status(500).json({ message: err.message || 'An error occurred while getting all the authors' });
  }
};

const getAuthorById = async (req, res) => {
  // #swagger.tags = ['Authors']
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'Author ID is required' });
    }
    const authorId = new objectId(req.params.id);
    const result = await mongodb.getDatabase().db('library').collection('authors').find({ _id: authorId });
    const authors = await result.toArray();
    if (authors.length === 0) {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.setHeader('Content-type', 'application/json');
    res.status(200).json(authors);
  } catch (err) {
    res.status(500).json({ message: err.message || 'An error occurred while getting the authors by id' });
  }
};

const createAuthor = async (req, res) => {
  // #swagger.tags = ['Authors']
  try {
    const requiredFields = ['firstName', 'lastName', 'nationality', 'booksWritten', 'activeSince'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    const author = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      nationality: req.body.nationality,
      booksWritten: req.body.booksWritten,
      activeSince: req.body.activeSince
    };
    const response = await mongodb.getDatabase().db('library').collection('authors').insertOne(author);
    if (response.acknowledged) {
      res.status(201).json({
        id: response.insertedId,
        message: 'Author created successfully',
        author: author
      });
    } else {
      res.status(500).json({ message: 'Failed to create author' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'An error occurred while creating the author' });
  }
};

const updateAuthor = async (req, res) => {
  // #swagger.tags = ['Authors']
  try {
    const authorId = new objectId(req.params.id);
    const author = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      nationality: req.body.nationality,
      booksWritten: req.body.booksWritten,
      activeSince: req.body.activeSince
    };
    const response = await mongodb.getDatabase().db('library').collection('authors').replaceOne({ _id: authorId }, author);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Author not found or no changes made' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'An error occurred while updating the author' });
  }
};

const deleteAuthor = async (req, res) => {
  // #swagger.tags = ['Authors']
  try {
    const authorId = new objectId(req.params.id);
    const response = await mongodb.getDatabase().db('library').collection('authors').deleteOne({ _id: authorId });
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Author not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'An error occurred while deleting the author' });
  }
};

module.exports = {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor
};