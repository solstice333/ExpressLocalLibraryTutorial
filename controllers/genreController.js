const Genre = require('../models/genre');
const Book = require('../models/book');
const async = require('async');
const createError = require('http-errors');
const { body, validationResult } = require('express-validator/check');

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
   res.render('genreForm', { title: 'Create Genre' });
};

// handle Genre create on POST
exports.genreCreatePost = [
   body('name', 'Genre name required').trim().isLength({ min: 1 }).escape(),
   (req, res, next) => {
      const errors = validationResult(req);

      let newGenre = new Genre({ name: req.body.name });

      if (!errors.isEmpty()) {
         res.render('genreForm', 
         {
            title: 'Create Genre',
            genre: newGenre,
            errors: errors.array()
         });
      }
      else {
         Genre
            .findOne({ name: req.body.name })
            .then(genre => {
               if (genre) return genre
               else {
                  newGenre.save()
                  return newGenre;
               }
            })
            .then(genre => res.redirect(genre.url))
            .catch(err => next(err));
      }
   }
];

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

