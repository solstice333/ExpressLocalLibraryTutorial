const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookinstance');
const async = require('async');
const createError = require('http-errors');

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
exports.bookList = function(req, res, next) {
   Book.find({}, 'title author')
      .populate('author')
      .sort('title')
      .then(books => {
         books = books.sort(
            (a, b) => a.author.family_name > b.author.family_name);
         res.render('bookList', { title: 'Book List', bookList: books })
      })
      .catch(err => next(err));
};

// display detail page for a specific book
exports.bookDetail = function(req, res, next) {
   async.parallel(
      {
         book: cb => 
            Book.findById(req.params.id)
               .populate('genre')
               .populate('author')
               .exec(cb),
         bookInstances: cb => BookInstance.find({ book: req.params.id }, cb)
      },
      (err, results) => {
         if (err) next(err);
         if (!results.book) next(createError(404, 'Book not found'));   
         res.render(
            'bookDetail', 
            { 
               title: 'Title', 
               book: results.book,
               bookInstances: results.bookInstances
            }
         );
      }
   );
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
