const Author = require('../models/author');
const Book = require('../models/book');
const async = require('async');
const createError = require('http-errors');
const { body, validationResult} = require('express-validator/check');

function adjustDateWithTZOffset(date, tzoffset) {
   let pad = num => num < 10 ? '0' + num : num;
   let sign = tzoffset >= 0 ? '-' : '+';
   let hours = Math.floor(tzoffset/60);
   let mins = Math.floor(tzoffset%60);
   let iso = date.toISOString()
      .replace(/Z/, `${sign}${pad(hours)}:${pad(mins)}`);
   return new Date(iso);
}

function toTZOffsettedDate(date_str, { req }) {
   if (!date_str) return date_str;
   let tzoffset = parseInt(req.body.tzoffset)
   let date = new Date(date_str);
   return adjustDateWithTZOffset(date, tzoffset).toISOString();
}

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
         res.render('authorCreate', {
            title: 'Create Author',
            author: newAuthor,
            errors: errors.array()
         });
      }
      else {
         newAuthor.save()
            .then(() => res.redirect(newAuthor.url))
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
