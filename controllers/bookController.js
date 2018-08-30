const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookinstance');
const async = require('async');
const createError = require('http-errors');
const { body, validationResult } = require('express-validator/check');
const assert = require('assert').strict;

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
      .catch(next);
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
exports.bookCreateGet = function(req, res, next) {
   async.parallel(
      {
         authors: cb => Author.find(cb),
         genres: cb => Genre.find(cb)
      },
      (err, results) => {
         if (err) next(err);
         res.render(
            'bookForm',
            {
               title: 'Create Book',
               authors: results.authors,
               genres: results.genres
            }
         );
      }
   )
};

// handle book create on POST
exports.bookCreatePost = [
   (req, res, next) => {
      if (!(req.body.genre instanceof Array)) {
         if (req.body.genre === undefined)
            req.body.genre = []
         else
            req.body.genre = [req.body.genre];
      }
      next();
   },
   body('genre.*').trim().escape(),
   body('title', 'Title must not be empty.')
      .trim().escape().isLength({ min: 1 }),
   body('authorId', 'Author must not be empty.')
      .trim().escape().isLength({ min: 1 }),
   body('summary', 'Summary must not be empty.')
      .trim().isLength({ min: 1 }),
   body('isbn', 'ISBN must not be empty.')
      .trim().escape().isLength({ min: 1 }),
   (req, res, next) => {
      let errors = validationResult(req);

      let newBook = new Book({
         title: req.body.title,
         author: req.body.authorId,
         summary: req.body.summary,
         isbn: req.body.isbn,
         genre: req.body.genre
      });

      console.log(req.body);
      console.log(newBook);

      if (!errors.isEmpty()) {
         async.parallel(
            {
               authors: cb => Author.find(cb),
               genres: cb => Genre.find(cb)
            },
            (err, results) => {
               if (err) next(err);

               for (let genre of results.genres) {
                  if (newBook.genre.find(selectedGenre =>
                     genre._id.toString() === selectedGenre._id.toString()))
                     genre.checked = 'true';
               }

               res.render(
                  'bookForm', 
                  {
                     title: 'Create Book',
                     authors: results.authors,
                     genres: results.genres,
                     book: newBook ,
                     errors: errors.array()
                  }
               );
            }
         )
      }
      else {
         newBook.save()
            .then(() => res.redirect(newBook.url))
            .catch(next);
      }
   }
]

// display book delete form on GET
exports.bookDeleteGet = function(req, res, next) {
   async.parallel(
      {
         book: cb => Book.findById(req.params.id, cb)
            .populate('author').populate('genre'),
         bookinstances: cb => BookInstance.find({ book: req.params.id }, cb)
      },
      (err, results) => {
         if (err) next(err);
         if (!results.book) res.redirect('/catalog/books');
         res.render(
            'bookDelete',
            {
               title: 'Delete Book',
               book: results.book,
               bookinstances: results.bookinstances
            }
         );
      }
   );
};

// display book delete form on POST
exports.bookDeletePost = function(req, res, next) {
   assert(req.params.id === req.body.bookId);

   async.parallel(
      {
         book: cb => Book.findById(req.params.id, cb),
         bookinstances: cb => BookInstance.find({ book: req.params.id }, cb)
      },
      (err, results) => {
         if (err) next(err);
         if (results.bookinstances.length) {
            res.render(
               'bookDelete',
               {
                  title: 'Delete Book',
                  book: results.book,
                  bookinstances: results.bookinstances,
                  errors: [
                     { 
                        msg: "Must delete book's copies " +
                           "before attempting to delete book" 
                     }
                  ]
               }
            );
         }
         else   // this handles the null `book` case too
            Book.findByIdAndDelete(req.params.id)
               .then(() => res.redirect('/catalog/books'))
               .catch(next);
      }
   );
};

// display book update form on GET
exports.bookUpdateGet = function(req, res, next) {
   async.parallel(
      {
         book: cb => Book.findById(req.params.id).populate('genre').exec(cb),
         authors: cb => Author.find(cb),
         genres: cb => Genre.find(cb)
      },
      (err, results) => {
         if (err) next(err);
         if (!results.book) next(createError(404, 'Book not found'));
         for (let genre of results.genres) {
            if (results.book.genre.find(
               bookGenre => genre.name === bookGenre.name))
               genre.checked = true;
         }
         res.render(
            'bookForm',
            {
               title: 'Update Book',
               book: results.book,
               authors: results.authors,
               genres: results.genres
            }
         );
      }
   );
};

// display book update form on POST
exports.bookUpdatePost = function(req, res) {
   res.send('NOT IMPLEMENTED: Book update POST');
};
