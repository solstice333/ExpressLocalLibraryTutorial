const http = require('http');
const assert = require('chai').assert;
const request = require('request-promise-native');
const server = require('./serverSetup');
const getRequestOptionsForUri = 
   require('./requestOptions').getRequestOptionsForUri; 
const Book = require('../models/book');

const indexUrl = 'http://localhost:3000/';
const catalogUrl = 'http://localhost:3000/catalog';
const booksUrl = 'http://localhost:3000/catalog/books';
const bookinstancesUrl = 'http://localhost:3000/catalog/bookinstances/';
const authorsUrl = 'http://localhost:3000/catalog/authors/';
const genresUrl = 'http://localhost:3000/catalog/genres/';
const bookUrl= 'http://localhost:3000/catalog/book/:id';
const bookCreateUrl = 'http://localhost:3000/catalog/book/create';

class NoBookError extends Error {
   constructor(msg) {
      super(msg);
      this.name = this.constructor.name;
   }
}

describe('Routes', function() {
   let serverListening;
   let serverClosed;

   this.timeout(20000);

   beforeEach(function(done) { 
      serverListening = done;
      server.listen(3000, serverListening);
   });

   afterEach(function(done) { 
      server.off('listening', serverListening);
      server.close(done); 
   });

   describe(indexUrl, function() {
      it('should redirect to /catalog', function() {
         return request.get(getRequestOptionsForUri(indexUrl))
            .then((resp) => { 
               let $ = resp.body;
               assert($('h1').first().text() === 'Local Library Home', 
                  'expect first h1 to be "Local Library Home"');
               assert(resp.statusCode === 200,
                  'expect response status 200');
               assert($('head > title').text() === 'Local Library Home',
                  'expect title to be "Local Library Home"');
            });
      });
   });

   describe(catalogUrl, function() {
      it('should successfully render /catalog', function() {
         return request.get(getRequestOptionsForUri(catalogUrl))
            .then((resp) => { 
               let $ = resp.body;
               assert($('h1').first().text() === 'Local Library Home', 
                  'expect first h1 to be "Local Library Home"');
               assert(resp.statusCode === 200,
                  'expect response status 200');
               assert($('head > title').text() === 'Local Library Home',
                  'expect title to be "Local Library Home"');
            });
      });
   });

   describe(booksUrl, function() {
      it('should successfully render /catalog/books', function() {
         return request.get(getRequestOptionsForUri(booksUrl))
            .then((resp) => { 
               let $ = resp.body;
               assert($('h1').first().text() === 'Book List', 
                  'expect first h1 to be "Book List"');
               assert(resp.statusCode === 200,
                  'expect response status 200');
               assert($('head > title').text() === 'Book List',
                  'expect title to be "Book List"');
            });
      });
   });

   describe(bookinstancesUrl, function() {
      it('should successfully render /catalog/bookinstances', function() {
         return request.get(getRequestOptionsForUri(bookinstancesUrl))
            .then((resp) => { 
               let $ = resp.body;
               assert($('h1').first().text() === 'Book Instance List', 
                  'expect first h1 to be "Book Instance List"');
               assert(resp.statusCode === 200,
                  'expect response status 200');
               assert($('head > title').text() === 'Book Instance List',
                  'expect title to be "Book Instance List"');
            });
      });
   });

   describe(authorsUrl, function() {
      it('should successfully render /catalog/authors', function() {
         return request.get(getRequestOptionsForUri(authorsUrl))
            .then((resp) => { 
               let $ = resp.body;
               assert($('h1').first().text() === 'Author List', 
                  'expect first h1 to be "Author List"');
               assert(resp.statusCode === 200,
                  'expect response status 200');
               assert($('head > title').text() === 'Author List',
                  'expect title to be "Author List"');
            });
      });
   });

   describe(genresUrl, function() {
      it('should successfully render /catalog/genres', function() {
         return request.get(getRequestOptionsForUri(genresUrl))
            .then((resp) => { 
               let $ = resp.body;
               assert($('h1').first().text() === 'Genre List', 
                  'expect first h1 to be "Genre List"');
               assert(resp.statusCode === 200,
                  'expect response status 200');
               assert($('head > title').text() === 'Genre List',
                  'expect title to be "Genre List"');
            });
      });
   });

   describe(bookUrl, function() {
      it('should successfully render /catalog/book/:id', function() {
            return Book.findOne()
               .then(book => {
                  if (!book)
                     throw new NoBookError("Book not found");

                  let actualBookUrl = bookUrl.replace(/:id/, book._id);
                  console.log(actualBookUrl);

                  return request.get(getRequestOptionsForUri(actualBookUrl))
                     .then((resp) => { 
                        let $ = resp.body;
                        assert(
                           $('h1').first().text() === `Title: ${book.title}`, 
                           `expect first h1 to be "Title: ${book.title}"`);
                        assert(resp.statusCode === 200,
                           'expect response status 200');
                        assert($('head > title').text() === 'Title',
                           'expect title to be "Title"');
                     });
               })
               .catch(err => {
                  if (!(err instanceof NoBookError))
                     throw err;
               });
      });
   });

   describe(bookCreateUrl, function() {
      it('should successfully render /catalog/book/create', function() {
         return request.get(getRequestOptionsForUri(bookCreateUrl))
            .then((resp) => { 
               let $ = resp.body;
               assert($('h1').first().text() === 'Create Book', 
                  'expect first h1 to be "Create Book"');
               assert(resp.statusCode === 200,
                  'expect response status 200');
               assert($('head > title').text() === 'Create Book',
                  'expect title to be "Create Book"');
            });
      });
   });
});
