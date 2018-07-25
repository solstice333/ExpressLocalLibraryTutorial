const Genre = require('../models/genre');

// display list of all Genre
exports.genreList = function(req, res) {
   res.send('NOT IMPLEMENTED: Genre list');
};

// display detail page for a specific Genre
exports.genreDetail = function(req, res) {
   res.send('NOT IMPLEMENTED: Genre detail: ' + req.params.id);
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

