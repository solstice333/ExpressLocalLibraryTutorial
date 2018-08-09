const Author = require('../models/author');
const Book = require('../models/book');
const async = require('async');
const createError = require('http-errors');
const { body, validationResult} = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

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
      .catch(err => next(err));
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
   res.render('authorCreate', { title: 'Create Author'});
};

// handle Author create on POST
exports.authorCreatePost = [
   body('first_name', "first name required")
      .trim().isLength({ min: 1 }).escape(),
   body('last_name', "last name required")
      .trim().isLength({ min: 1 }).escape(),
   body('date_of_birth')
      .optional({ checkFalsy: true }).isBefore().withMessage(
         "date of birth must be equal to or before current date"),
   body('date_of_death')
      .optional({ checkFalsy: true }).isBefore().withMessage(
         "date of death must be equal to or before current date")
      .custom((date_of_death, { req }) => 
         new Date(date_of_death) >= new Date(req.body.date_of_birth)
      )
      .withMessage("date of death must be equal to or after date of birth"),
   function(req, res, next) {
      let errors = validationResult(req);

      let newAuthor = new Author({
         first_name: req.body.first_name,
         family_name: req.body.last_name,
         date_of_birth: req.body.date_of_birth,
         date_of_death: req.body.date_of_death
      });

      if (!errors.isEmpty()) {
         res.render('authorCreate', {
            title: 'Create Author',
            author: newAuthor,
            errors: errors.array()
         });
      }
      else {
         Author.findOne({ 
            first_name: newAuthor.first_name, 
            family_name: newAuthor.family_name })
            .then(author => {
               if (author) return author
               else {
                  newAuthor.save();
                  return newAuthor;
               }
            })
            .then(author => res.redirect(author.url))
            .catch(err => next(err));
      }
   }
]

// display Author delete form on GET
exports.authorDeleteGet = function(req, res) {
   res.send('NOT IMPLEMENTED: Author delete GET');
};

// handle Author delete on POST
exports.authorDeletePost = function(req, res) {
   res.send('NOT IMPLEMENTED: Author delete POST');
};

// handle Author update form on GET
exports.authorUpdateGet = function(req, res) {
   res.send('NOT IMPLEMENTED: Author update GET');
};

// handle Author update on POST
exports.authorUpdatePost = function(req, res) {
   res.send('NOT IMPLEMENTED: Author update POST');
};
