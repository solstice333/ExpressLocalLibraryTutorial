const BookInstance = require('../models/bookinstance');

// display list of all bookinstances
exports.bookinstanceList = function(req, res, next) {
   BookInstance.find()
      .populate('book')
      .then(bookinstances => {
         console.log(bookinstances);
         res.render(
            'bookinstanceList',
            {
               title: 'Book Instance List',
               bookinstanceList: bookinstances
            }
         )
      })
      .catch(err => next(err));
};

// display detail page for a specific BookInstance
exports.bookinstanceDetail = function(req, res) {
   res.send('NOT IMPLEMENTED: BookInstance detail: ' + req.params.id);
};

// display BookInstance create form on GET
exports.bookinstanceCreateGet = function(req, res) {
   res.send('NOT IMPLEMENTED: BookInstance create GET');
};

// handle BookInstance create on POST
exports.bookinstanceCreatePost = function(req, res) {
   res.send('NOT IMPLEMENTED: BookInstance create POST');
};

// display BookInstance delete form on GET
exports.bookinstanceDeleteGet = function(req, res) {
   res.send('NOT IMPLEMENTED: BookInstance delete GET');
};

// handle BookInstance delete on POST
exports.bookinstanceDeletePost = function(req, res) {
   res.send('NOT IMPLEMENTED: BookInstance delete POST');
};

// display BookInstance update form on GET
exports.bookinstanceUpdateGet = function(req, res) {
   res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// handle BookInstance update on POST
exports.bookinstanceUpdatePost = function(req, res) {
   res.send('NOT IMPLEMENTED: BookInstance update POST');
};