const Book = require('../models/book');
const BookInstance = require('../models/bookinstance');
const createError = require('http-errors');
const { body, validationResult } = require('express-validator/check');
const toTZOffsettedDate = require('./toTZOffsettedDate');

// display list of all bookinstances
exports.bookinstanceList = function(req, res, next) {
   BookInstance.find()
      .populate('book')
      .then(bookinstances => {
         console.log(bookinstances);
         res.render(
            'bookinstanceList',
            {
               title: 'Book Instance List',
               bookinstanceList: bookinstances
            }
         )
      })
      .catch(err => next(err));
};

// display detail page for a specific BookInstance
exports.bookinstanceDetail = function(req, res, next) {
   BookInstance
      .findById(req.params.id)
      .populate('book')
      .then(inst => {
         if (!inst) next(createError(404, "Book copy not found"));
         res.render(
            'bookinstance',
            {
               title: 'Book Instance',
               inst: inst
            }
         )
      })
      .catch(err => next(err));
};

// display BookInstance create form on GET
exports.bookinstanceCreateGet = function(req, res, next) {
   Book.find({}, 'title')
      .then(books => res.render(
         'bookinstanceForm', 
         { 
            title: 'Create BookInstance',
            books: books
         }
      ))
      .catch(err => next(err));
};

// handle BookInstance create on POST
exports.bookinstanceCreatePost = [
   body('book', 'Book must be specified') 
      .trim().escape().isLength({ min: 1 }),
   body('imprint', 'Imprint must be specified')
      .trim().escape().isLength({ min: 1 }),
   body('dueBack')
      .optional({ checkFalsy: true })
      .isISO8601().withMessage('Invalid date')
      .isAfter().withMessage('Date must be after current date or empty')
      .customSanitizer(toTZOffsettedDate)
      .toDate(),
   (req, res, next) => {
      let errors = validationResult(req);

      let newBookinstance = new BookInstance({
         book: req.body.book,
         imprint: req.body.imprint,
         status: req.body.status,
         due_back: req.body.dueBack
      });

      if (!errors.isEmpty()) {
         Book.find({}, 'title')
            .then(books => res.render(
               'bookinstanceForm', 
               { 
                  title: 'Create BookInstance',
                  books: books,
                  bookinstance: newBookinstance,
                  errors: errors.array()
               }
            ))
            .catch(err => next(err));
      }
      else {
         newBookinstance.save()
            .then(() => res.redirect(newBookinstance.url))
            .catch(err => next(err));
      }
   }
];

// display BookInstance delete form on GET
exports.bookinstanceDeleteGet = function(req, res) {
   res.send('NOT IMPLEMENTED: BookInstance delete GET');
};

// handle BookInstance delete on POST
exports.bookinstanceDeletePost = function(req, res) {
   res.send('NOT IMPLEMENTED: BookInstance delete POST');
};

// display BookInstance update form on GET
exports.bookinstanceUpdateGet = function(req, res) {
   res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// handle BookInstance update on POST
exports.bookinstanceUpdatePost = function(req, res) {
   res.send('NOT IMPLEMENTED: BookInstance update POST');
};
