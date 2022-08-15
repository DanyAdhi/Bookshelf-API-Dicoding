const bookHandler = require('./handler');

const routes = [
  {
    method: 'GET',
    path: '/books',
    handler: bookHandler.getAllBooks,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: bookHandler.getOneBooks,
  },
  {
    method: 'POST',
    path: '/books',
    handler: bookHandler.createBooks,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: bookHandler.updateBooks,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: bookHandler.deleteBooks,
  },
];

module.exports = routes;
