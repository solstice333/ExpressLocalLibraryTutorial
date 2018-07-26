const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookinstance');
const async = require('async');

exports.index = function(req, res) {
   async.parallel({
      bookCount: cb => Book.countDocuments({}, cb),
      bookInstanceCount: cb => BookInstance.countDocuments({}, cb),
      bookInstanceAvailableCount: 
         cb => BookInstance.countDocuments({ status: 'Available' }, cb),
      authorCount: cb => Author.countDocuments({}, cb),
      genreCount: cb => Genre.countDocuments({}, cb) 
   },
   (err, results) => res.render('index', {
      title: 'Local Library Home',
      error: err,
      data: results
   }));
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
