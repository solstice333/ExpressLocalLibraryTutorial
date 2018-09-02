const Book = require('../models/book');
const BookInstance = require('../models/bookinstance');
const createError = require('http-errors');
const async = require('async');
const { body, validationResult } = require('express-validator/check');
const toTZOffsettedDate = require('./toTZOffsettedDate');
const assert = require('assert').strict;

// display list of all bookinstances
exports.bookinstanceList = function(req, res, next) {
   BookInstance.find()
      .populate('book')
      .then(bookinstances => {
         res.render(
            'bookinstanceList',
            {
               title: 'Book Instance List',
               bookinstanceList: bookinstances
            }
         )
      })
      .catch(next);
};

// display detail page for a specific BookInstance
exports.bookinstanceDetail = function(req, res, next) {
   BookInstance
      .findById(req.params.id)
      .populate('book')
      .then(inst => {
         if (!inst) next(createError(404, "Book copy not found"));
         res.render(
            'bookinstanceDetail',
            {
               title: 'Book Instance',
               inst: inst
            }
         )
      })
      .catch(next);
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
      .catch(next);
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
   body('status')
      .trim().escape().isLength({ min: 1 }),
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
            .catch(next);
      }
      else {
         newBookinstance.save()
            .then(() => res.redirect(newBookinstance.url))
            .catch(next);
      }
   }
];

// display BookInstance delete form on GET
exports.bookinstanceDeleteGet = function(req, res, next) {
   BookInstance.findById(req.params.id)
      .populate('book')
      .then(inst => {
         if (!inst) res.redirect('/catalog/bookinstances');
         res.render(
            'bookinstanceDelete', 
            { 
               title: 'Delete Copy',
               inst: inst
            }
         );
      })
      .catch(next);
};

// handle BookInstance delete on POST
exports.bookinstanceDeletePost = function(req, res, next) {
   assert(req.params.id === req.body.bookinstanceId);

   BookInstance.findByIdAndDelete(req.params.id)
      .then(() => res.redirect('/catalog/bookinstances'))
      .catch(next);
};

// display BookInstance update form on GET
exports.bookinstanceUpdateGet = function(req, res, next) {
   async.parallel(
      {
         books: cb => Book.find(cb),
         bookinstance: cb => BookInstance.findById(req.params.id, cb)
      },
      (err, results) => {
         if (err) next(err);
         if (!results.bookinstance) 
            next(createError(404, 'Bookinstance not found'));

         res.render(
            'bookinstanceForm',
            {
               title: 'Update Copy',
               books: results.books,
               bookinstance: results.bookinstance
            }
         );
      }
   );
};

// handle BookInstance update on POST
exports.bookinstanceUpdatePost = [
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
   body('status')
      .trim().escape().isLength({ min: 1 }),
   (req, res, next) => {
      let errors = validationResult(req);

      let updatedBookinstance = new BookInstance({
         _id: req.params.id,
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
                  title: 'Update Copy',
                  books: books,
                  bookinstance: updatedBookinstance,
                  errors: errors.array()
               }
            ))
            .catch(next);
      }
      else {
         BookInstance.findByIdAndUpdate(req.params.id, updatedBookinstance)
            .then(() => res.redirect(updatedBookinstance.url))
            .catch(next);
      }
   }
];
