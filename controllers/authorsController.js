const mongodb = require('../data/database');
const objectId = require('mongodb').ObjectId;

const getAllAuthors = async (req, res) => {
  // #swagger.tags = ['Authors']
  const result = await mongodb.getDatabase().db('library').collection('authors').find();
  result.toArray().then((authors) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(authors);
  });
};

const getAuthorById = async (req, res) => {
  // #swagger.tags = ['Authors']
  const authorId = new objectId(req.params.id);
  const result = await mongodb.getDatabase().db('library').collection('authors').find({ _id: authorId });
  result.toArray().then((authors) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(authors[0]);
  });
};

const createAuthor = async (req, res) => {
  // #swagger.tags = ['Authors']
  const author = {
    name: req.body.name,
    nationality: req.body.nationality,
    genre: req.body.genre,
    birthYear: req.body.birthYear
  };
  const response = await mongodb.getDatabase().db('library').collection('authors').insertOne(author);
  if (response.acknowledged) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while creating the author.');
  }
};

const updateAuthor = async (req, res) => {
  // #swagger.tags = ['Authors']
  const authorId = new objectId(req.params.id);
  const author = {
    name: req.body.name,
    nationality: req.body.nationality,
    genre: req.body.genre,
    birthYear: req.body.birthYear
  };
  const response = await mongodb.getDatabase().db('library').collection('authors').updateOne({ _id: authorId }, { $set: author });
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the author.');
  }
};

const deleteAuthor = async (req, res) => {
  // #swagger.tags = ['Authors']
  const authorId = new objectId(req.params.id);
  const response = await mongodb.getDatabase().db('library').collection('authors').deleteOne({ _id: authorId });
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while deleting the author.');
  }
};

module.exports = {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor
};