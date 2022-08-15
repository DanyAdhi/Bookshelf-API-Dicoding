const { nanoid } = require('nanoid');
const books = require('./books');

const getAllBooks = (req) => {
  const { name: nameFilter, reading: readingFilter, finished: finishedFilter } = req.query;
  let result = books;

  // filter books
  if (nameFilter || readingFilter || finishedFilter) {
    // eslint-disable-next-line no-use-before-define
    result = booksFilter(nameFilter, readingFilter, finishedFilter, result);
  }

  // filter key of book
  result = result.map(({ id, name, publisher }) => ({ id, name, publisher }));

  return {
    status: 'success',
    data: { books: result },
  };
};

const getOneBooks = (req, h) => {
  const { bookId } = req.params;

  const index = books.findIndex((book) => book.id === bookId);
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  const book = books[index];
  return {
    status: 'success',
    data: { book },
  };
};

const createBooks = (req, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.payload;

  // eslint-disable-next-line no-use-before-define
  const validation = validationPayload({
    name, pageCount, readPage, action: 'create',
  });
  if (validation.status === false) {
    const response = h.response({
      status: 'fail',
      message: validation.message,
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = (pageCount === readPage);

  const payloadInsert = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(payloadInsert);

  const isSuccess = books.filter((book) => book.id === id);

  if (!isSuccess) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
  }

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: { bookId: id },
  });
  response.code(201);
  return response;
};

const updateBooks = (req, h) => {
  const { bookId } = req.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.payload;
  const updatedAt = new Date().toISOString();

  // eslint-disable-next-line no-use-before-define
  const validation = validationPayload({
    name, pageCount, readPage, action: 'update',
  });
  if (validation.status === false) {
    const response = h.response({
      status: 'fail',
      message: validation.message,
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((book) => book.id === bookId);
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });

  response.code(200);
  return response;
};

const deleteBooks = (req, h) => {
  const { bookId } = req.params;

  const index = books.findIndex((book) => book.id === bookId);
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  books.splice(index, 1);
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
  response.code(200);
  return response;
};

const validationPayload = ({
  name, pageCount, readPage, action,
}) => {
  let result = { status: true };

  const actionType = (action === 'create' ? 'menambahkan' : 'memperbarui');

  if (!name) {
    result = {
      status: false,
      message: `Gagal ${actionType} buku. Mohon isi nama buku`,
    };
  }

  if (readPage > pageCount) {
    result = {
      status: false,
      message: `Gagal ${actionType} buku. readPage tidak boleh lebih besar dari pageCount`,
    };
  }

  return result;
};

const booksFilter = (nameFilter, readingFilter, finishedFilter, object) => {
  let resultFilter = object;
  if (nameFilter) {
    const nameToLowerCase = nameFilter.toLowerCase();
    resultFilter = resultFilter.filter((o) => o.name.toLowerCase().includes(nameToLowerCase));
  }
  if (readingFilter) {
    const boolean = !!parseInt(readingFilter, 10);
    resultFilter = resultFilter.filter((o) => o.reading === boolean);
  }
  if (finishedFilter) {
    const boolean = !!parseInt(finishedFilter, 10);
    resultFilter = resultFilter.filter((o) => o.finished === boolean);
  }
  return resultFilter;
};

module.exports = {
  getAllBooks, getOneBooks, createBooks, updateBooks, deleteBooks,
};
