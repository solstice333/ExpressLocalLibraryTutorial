const Genre = require('../models/genre');
const Book = require('../models/book');
const async = require('async');
const createError = require('http-errors');
const { body, validationResult } = require('express-validator/check');
const assert = require('assert').strict;


function isGenreNameDuplicate(value, { req }) {
   return Genre.findById(req.params.id)
      .then(genre => {
         if (value !== genre.name) {
            return Genre.findOne({ name: value })
               .then(genre => {
                  if (genre)
                     throw new Error('Duplicate genre name');
               });
         }
      });
}

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
      .catch(next);
};

// display detail page for a specific Genre
exports.genreDetail = function(req, res, next) {
   async.parallel(
      {
         genre: cb => Genre.findById(req.params.id, cb),
         genreBooks: cb => Book.find({ genre: req.params.id }, cb)
      },
      (err, results) => {
         if (err) 
            next(err);
         else if (!results.genre) 
            next(createError(404, "Genre not found")); 
         else {
            res.render(
               'genreDetail', 
               { 
                  title: 'Genre Detail', 
                  genre: results.genre,
                  genreBooks: results.genreBooks
               }
            );
         }
      }
   );
};

// display Genre create form on GET
exports.genreCreateGet = function(req, res) {
   res.render('genreForm', { title: 'Create Genre' });
};

// handle Genre create on POST
exports.genreCreatePost = [
   body('name', 'Genre name required').trim().escape().isLength({ min: 1 }),
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
            .catch(next);
      }
   }
];

// display Genre delete form on GET
exports.genreDeleteGet = function(req, res, next) {
   async.parallel(
      {
         genre: cb => Genre.findById(req.params.id, cb),
         genreBooks: cb => Book.find({ genre: req.params.id }, cb)
      },
      (err, results) => {
         if (err) 
            next(err);
         else if (!results.genre) 
            res.redirect('/catalog/genres');
         else {
            res.render(
               'genreDelete',
               {
                  title: 'Delete Genre',
                  genre: results.genre,
                  genreBooks: results.genreBooks
               }
            ); 
         }
      }
   );
};

// handle Genre delete on POST
exports.genreDeletePost = function(req, res, next) {
   async.parallel(
      {
         genre: cb => Genre.findById(req.params.id, cb),
         genreBooks: cb => Book.find({ genre: req.params.id }, cb)
      },
      (err, results) => {
         if (err) 
            next(err);
         else if (results.genreBooks.length) {
            res.render(
               'genreDelete',
               {
                  title: 'Delete Genre',
                  genre: results.genre,
                  genreBooks: results.genreBooks,
                  errors: [
                     { 
                        msg: "Must delete books in this genre before" +
                           " attempting to delete this genre"
                     }
                  ]
               }
            ); 
         }
         else {
            Genre.findByIdAndDelete(req.params.id)
               .then(() => res.redirect('/catalog/genres'))
               .catch(next);
         }
      }
   );
};

// display Genre update form on GET
exports.genreUpdateGet = function(req, res, next) {
   Genre.findById(req.params.id)
      .then(genre => {
         res.render(
            'genreForm',
            {
               title: 'Update Genre',
               genre: genre
            }
         );
      })
      .catch(next);
};

// handle Genre update on POST
exports.genreUpdatePost = [
   body('name').trim().escape().isLength({ min: 1 })
      .withMessage('Genre name required')
      .custom(isGenreNameDuplicate).withMessage("Duplicate genre name"),
   (req, res, next) => {
      const errors = validationResult(req);

      let updatedGenre = new Genre({ 
         _id: req.params.id,
         name: req.body.name 
      });

      if (!errors.isEmpty()) {
         res.render('genreForm', 
         {
            title: 'Update Genre',
            genre: updatedGenre,
            errors: errors.array()
         });
      }
      else {
         Genre.findByIdAndUpdate(req.params.id, updatedGenre)
            .then(() => res.redirect(updatedGenre.url))
            .catch(next);
      }
   }
];
