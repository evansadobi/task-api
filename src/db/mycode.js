// import express, { Request, Response } from "express";

// const app = express();
// app.use(express.json());

// // In-memory storage
// let posts: any[] = [];

// // Helper response function
// function createResponse<T>(data?: T, error?: string) {
//   if (error) {
//     return {
//       success: false,
//       error,
//       timestamp: new Date().toISOString(),
//     };
//   }

//   return {
//     success: true,
//     data,
//     timestamp: new Date().toISOString(),
//   };
// }

// // POST /api/posts
// app.post("/api/posts", (req: Request, res: Response) => {
//   let { title, content, author } = req.body;

//   // Trim inputs
//   title = title?.trim();
//   content = content?.trim();
//   author = author?.trim();

//   // ✅ Validation: required fields
//   if (!title || !content || !author) {
//     return res
//       .status(400)
//       .json(createResponse(undefined, "All fields are required"));
//   }

//   // ✅ Validation: length limits
//   if (title.length < 3 || title.length > 100) {
//     return res
//       .status(400)
//       .json(createResponse(undefined, "Title must be 3-100 characters"));
//   }

//   if (content.length < 10) {
//     return res
//       .status(400)
//       .json(createResponse(undefined, "Content must be at least 10 characters"));
//   }

//   if (author.length < 2 || author.length > 50) {
//     return res
//       .status(400)
//       .json(createResponse(undefined, "Author must be 2-50 characters"));
//   }

//   // ✅ Create post
//   const newPost = {
//     id: Date.now().toString(),
//     title,
//     content,
//     author,
//     createdAt: new Date(),
//   };

//   posts.push(newPost);

//   return res.status(201).json(createResponse(newPost));
// });

// // Start server
// app.listen(3000, () => {
//   console.log("Server running on port 3000");
// });

import express from "express"
import {books} from "./src/db/practice.js"
import { success } from "zod"
const app = express()

app.use(express())

app.get('/books',(req,res)=>{
    res.json(books)
})

app.get('/books:id',(req,res)=>{
    const book = books.find(b=>b.id===parseInt(req.params.id))
    if(!book){
        return res.status(404).json({success:false, error:'Book not found'})
    }

    res.json(book)
})

app.post('/books',(req, res)=>{
    const { title,author, pages} = req.body
     
    if (!title || !author || !pages) {
    return res.status(400).json({ error: "Missing required fields" });
  }
    const newBook ={ id: nextId++,title, author,  pages }

    books.push(newBook)
    res.status(200).json(newBook)

})

app.put('/books:id', (req, res) =>{
     const { id } = req.params;

     const { title,author, pages} = req.body
    const bookIndex = books.findIndex(b=>b.id ===parseInt(book.id))

    if(bookIndex=== -1){
       return  res.status(404).json({error:'book not found'})
    }

     const updatedBook = { id: bookId, title, author, pages };
  books[bookIndex] = updatedBook;
  res.json(updatedBook)
})

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





