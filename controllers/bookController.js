const Book = require('../models/book');

exports.index = function(req, res) {
   res.send('NOT IMPLEMENTED: Site Home Page');
};

// display list of all books
exports.bookList = function(req, res) {
   res.send('NOT IMPLEMENTED: Book list');
};

// display detail page for a specific book
exports.bookDetail = function(req, res) {
   res.send('NOT IMPLEMENTED: Book detail: ' + req.params.id);
};

// display book create form on GET
exports.bookCreateGet = function(req, res) {
   res.send('NOT IMPLEMENTED: Book create GET');
};

// handle book create on POST
exports.bookCreatePost = function(req, res) {
   res.send('NOT IMPLEMENTED: Book create POST');
};

// display book delete form on GET
exports.bookDeleteGet = function(req, res) {
   res.send('NOT IMPLEMENTED: Book delete GET');
};

// display book delete form on POST
exports.bookDeletePost = function(req, res) {
   res.send('NOT IMPLEMENTED: Book delete POST');
};

// display book update form on GET
exports.bookUpdateGet = function(req, res) {
   res.send('NOT IMPLEMENTED: Book update GET');
};

// display book update form on POST
exports.bookUpdatePost = function(req, res) {
   res.send('NOT IMPLEMENTED: Book update POST');
};
