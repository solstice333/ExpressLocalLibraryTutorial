const Author = require('../models/author');

// display list of all Authors
exports.authorList = function(req, res) {
   res.send('NOT IMPLEMENTED: Author list');
};

// display detail page for a specific Author
exports.authorDetail = function(req, res) {
   res.send('NOT IMPLEMENTED: Author detail: ' + req.params.id);
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
