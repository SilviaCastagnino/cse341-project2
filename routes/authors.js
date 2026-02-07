const express = require('express');
const router = express.Router();

const authorsController = require('../controllers/authorsController');
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', authorsController.getAllAuthors);
router.get('/:id', authorsController.getAuthorById);

router.post('/', isAuthenticated, authorsController.createAuthor);
router.put('/:id', isAuthenticated, authorsController.updateAuthor);
router.delete('/:id', isAuthenticated, authorsController.deleteAuthor);
module.exports = router;