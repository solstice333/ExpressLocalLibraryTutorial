const Author = require('../models/author');
const Book = require('../models/book');
const async = require('async');
const createError = require('http-errors');
const { body, validationResult} = require('express-validator/check');
const toTZOffsettedDate = require('./toTZOffsettedDate');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const assert = require('assert').strict;


// display list of all Authors
exports.authorList = function(req, res, next) {
   Author.find()
      .sort('family_name')
      .then(authors => 
         res.render(
            'authorList', 
            { 
               title: "Author List",
               authorList: authors 
            }
         )
      )
      .catch(next);
};

// display detail page for a specific Author
exports.authorDetail = function(req, res, next) {
   async.parallel(
      {
         author: cb => Author.findById(req.params.id, cb),
         books: cb => 
            Book
               .find({ author: req.params.id }, 'title summary')
               .sort('title').exec(cb)
      },
      (err, results) => { 
         if (err) next(err);
         if (!results.author) next(createError(404, 'Author not found'));
         res.render(
            'authorDetail', 
            { 
               title: 'Author Detail',
               author: results.author,
               books: results.books
            }
         );
      }
   );
};

// display Author create form on GET
exports.authorCreateGet = function(req, res) {
   res.render('authorForm', { title: 'Create Author'});
};

// handle Author create on POST
exports.authorCreatePost = [
   body('first_name')
      .trim().isLength({ min: 1 }).withMessage("first name required")
      .isAlphanumeric().withMessage(
         "first name must only have alphanumeric characters")
      .escape(),
   body('last_name')
      .trim().isLength({ min: 1 }).withMessage("last name required")
      .isAlphanumeric().withMessage(
         "last name must only have alphanumeric characters")
      .escape(),
   body('date_of_birth')
      .optional({ checkFalsy: true }).isISO8601()
      .customSanitizer(toTZOffsettedDate)
      .isBefore().withMessage(
         "date of birth must be equal to or before current date")
      .toDate(),
   body('date_of_death')
      .optional({ checkFalsy: true }).isISO8601()
      .customSanitizer(toTZOffsettedDate)
      .isBefore().withMessage(
         "date of death must be equal to or before current date")
      .custom((dod, { req }) => {
         let dob = req.body.date_of_birth || null; 
         return dob ? dod >= dob : true;
      })
      .withMessage("date of death must be equal to or after date of birth")
      .toDate(),
   function(req, res, next) {
      let errors = validationResult(req);

      let newAuthor = new Author({
         first_name: req.body.first_name,
         family_name: req.body.last_name,
         date_of_birth: req.body.date_of_birth,
         date_of_death: req.body.date_of_death
      });

      if (!errors.isEmpty()) {
         res.render('authorForm', {
            title: 'Create Author',
            author: newAuthor,
            errors: errors.array()
         });
      }
      else {
         newAuthor.save()
            .then(() => res.redirect(newAuthor.url))
            .catch(next);
      }
   }
]

// display Author delete form on GET
exports.authorDeleteGet = function(req, res, next) {
   async.parallel(
      {
         author: cb => Author.findById(req.params.id, cb),
         authorsBooks: cb => Book.find({ author: req.params.id }, cb)
      },
      (err, results) => {
         if (err) next(err);
         if (!results.author) res.redirect('/catalog/authors');
         else res.render(
            'authorDelete',
            {
               title: 'Delete Author',
               author: results.author,
               authorsBooks: results.authorsBooks
            }
         );
      }
   );
};

// handle Author delete on POST
exports.authorDeletePost = function(req, res, next) {

   // can use the hidden `authorId` field or req.params.id
   assert(req.params.id === req.body.authorId);

   async.parallel(
      {
         author: cb => Author.findById(req.params.id, cb),
         authorsBooks: cb => Book.find({ author: req.params.id }, cb)
      },
      (err, results) => {
         if (err) next(err);
         if (results.authorsBooks.length) {
            res.render(
               'authorDelete',
               {
                  title: 'Delete Author',
                  author: results.author,
                  authorsBooks: results.authorsBooks,
                  errors: [
                     { 
                        msg: "Must delete author's books " +
                           "before attempting to delete author" 
                     }
                  ]
               }
            );
         }
         else   // this handles the null `author` case too
            Author.findByIdAndDelete(req.params.id)
               .then(() => res.redirect('/catalog/authors'))
               .catch(next);
      }
   );
};

// handle Author update form on GET
exports.authorUpdateGet = function(req, res) {
   res.send('NOT IMPLEMENTED: Author update GET');
};

// handle Author update on POST
exports.authorUpdatePost = function(req, res) {
   res.send('NOT IMPLEMENTED: Author update POST');
};
