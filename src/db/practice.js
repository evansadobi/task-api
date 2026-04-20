import express  from 'express';

const app = express();
app.use(express.json());

// In-memory storage for demonstration
export let books = [
  { id: 1, title: "The TypeScript Handbook", author: "Microsoft Team", pages: 250 },
  { id: 2, title: "Node.js Design Patterns", author: "Mario Casciaro", pages: 400 }
];
let nextId = 3;

// GET /books - Retrieve all books
app.get('/books', (req, res) => {
  res.json(books);
});

// GET /books/:id - Retrieve specific book
app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  res.json(book);
});

// POST /books - Create new book
app.post('/books', (req, res) => {
  const newBook = {
    id: nextId++,
    title: req.body.title,
    author: req.body.author,
    pages: req.body.pages
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT /books/:id - Replace entire book
app.put('/books/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
  if (bookIndex === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }
  
  books[bookIndex] = {
    id: parseInt(req.params.id),
    title: req.body.title,
    author: req.body.author,
    pages: req.body.pages
  };
  
  res.json(books[bookIndex]);
});

// PATCH /books/:id - Update specific fields
app.patch('/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) {
    return res.status(404).json({ success: false,  error: 'Book not found' });
  }
  
  // Update only provided fields
  if (req.body.title) book.title = req.body.title;
  if (req.body.author) book.author = req.body.author;
  if (req.body.pages) book.pages = req.body.pages;
  
  res.json(book);
});

// DELETE /books/:id - Remove book
app.delete('/books/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
  if (bookIndex === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }
  
  books.splice(bookIndex, 1);
  res.status(204).send();
});

app.listen(3000, () => {
  console.log('RESTful API server running on http://localhost:3000');
});
