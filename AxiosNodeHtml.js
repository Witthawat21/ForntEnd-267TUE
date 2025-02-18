const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
app.use(express.static("public"));


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let books = [
  { id: 1, title: "The Simpsons", author: "Bart Simson" },
  { id: 2, title: "7000 Stars", author: "Anirach" },
  { id: 3, title: "Water Mark", author: "Jimmy" },
  { id: 4, title: "Dr. Who", author: "Robot" },
  { id: 5, title: "Runway", author: "plan" },
];

// Show all books
app.get("/", (req, res) => {
  res.render("books", { books });
});

// Show book details
app.get("/book/:id", (req, res) => {
  const book = books.find((b) => b.id == req.params.id);
  res.render("book", { book });
});

// Show create form
app.get("/create", (req, res) => {
  res.render("create");
});

// Add a new book
app.post("/create", (req, res) => {
  const newBook = {
    id: books.length + 1,
    title: req.body.title,
    author: req.body.author,
  };
  books.push(newBook);
  res.redirect("/");
});

// Show update form
app.get("/update/:id", (req, res) => {
  const book = books.find((b) => b.id == req.params.id);
  res.render("update", { book });
});

// Update book
app.post("/update/:id", (req, res) => {
  const book = books.find((b) => b.id == req.params.id);
  book.title = req.body.title;
  book.author = req.body.author;
  res.redirect("/");
});

// Delete book
app.get("/delete/:id", (req, res) => {
  books = books.filter((b) => b.id != req.params.id);
  res.redirect("/");
});

app.listen(5500, () => console.log("Server running on http://localhost:5500"));
