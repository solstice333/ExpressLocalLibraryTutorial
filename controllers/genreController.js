const Genre = require('../models/genre');
const Book = require('../models/book');
const async = require('async');
const createError = require('http-errors');

// display list of all Genre
exports.genreList = function(req, res, next) {
   Genre.find()
      .sort('name')
      .then(genres => 
         res.render(
            'genreList', 
            {
               title: 'Genre List',
               genreList: genres
            }
         )
      )
      .catch(err => next(err));
};

// display detail page for a specific Genre
exports.genreDetail = function(req, res, next) {
   async.parallel(
      {
         genre: cb => Genre.findById(req.params.id, cb),
         genreBooks: cb => Book.find({ genre: req.params.id }, cb)
      },
      (err, results) => {
         if (err) next(err);
         if (!results.genre) next(createError(404, "Genre not found")); 
         res.render(
            'genreDetail', 
            { 
               title: 'Genre Detail', 
               genre: results.genre,
               genreBooks: results.genreBooks
            }
         );
      }
   );
};

// display Genre create form on GET
exports.genreCreateGet = function(req, res) {
   res.send('NOT IMPLEMENTED: Genre create GET');
};

// handle Genre create on POST
exports.genreCreatePost = function(req, res) {
   res.send('NOT IMPLEMENTED: Genre create POST');
};

// display Genre delete form on GET
exports.genreDeleteGet = function(req, res) {
   res.send('NOT IMPLEMENTED: Genre delete GET');
};

// handle Genre delete on POST
exports.genreDeletePost = function(req, res) {
   res.send('NOT IMPLEMENTED: Genre delete POST');
};

// display Genre update form on GET
exports.genreUpdateGet = function(req, res) {
   res.send('NOT IMPLEMENTED: Genre update GET');
};

// handle Genre update on POST
exports.genreUpdatePost = function(req, res) {
   res.send('NOT IMPLEMENTED: Genre update POST');
}

