const Author = require('../models/author');
const Book = require('../models/book');
const async = require('async');
const createError = require('http-errors');

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
   res.send('NOT IMPLEMENTED: Author create GET');
};

// handle Author create on POST
exports.authorCreatePost = function(req, res) {
   res.send('NOT IMPLEMENTED: Author create POST');
};

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
