import book from "../models/books.js";

const registerBook = async (req, res) => {
    //name, author, yearPublication, registerDate, pages, gender, price
  if (!req.body.name)
    return res.status(400).send("Incomplete Data");
  const existingBook = await book.findOne({ name: req.body.name });
  if (existingBook) return res.status(400).send("The Book already exist");

  const bookSchema = new book({
    name: req.body.name,
    author: req.body.author,
    yearPublication: req.body.yearPublication,
    pages: req.body.pages,
    gender: req.body.gender,
    price: req.body.price,
  })

  const result = await bookSchema.save();
  if(!result) return res.status(400).send("Failed to register book");
  return res.status(200).send({ result })
};

const listBook = async (req , res) =>{
  const bookSchema = await book.find();
 // if(!bookSchema || bookSchema.length == 0) return res.status(400).send("Empty book list");
 // return res.status(200).send({bookSchema});
 
//ternario

 return !bookSchema || bookSchema.length == 0 ? res.status(400).send("Empty book list") : res.status(200).send({bookSchema});
}

const updateBook = async (req, res) => {
  if (!req.body.name)
    return res.status(400).send("Incomplete data");

  const existingBook = await book.findOne({
    name: req.body.name,
    author: req.body.author,
    yearPublication: req.body.yearPublication,
    pages: req.body.pages,
    gender: req.body.gender,
    price: req.body.price,
  });
  if (existingBook) return res.status(400).send("The book already exist");

  const bookUpdate = await book.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    author: req.body.author,
    yearPublication: req.body.yearPublication,
    pages: req.body.pages,
    gender: req.body.gender,
    price: req.body.price,
  });

  return !bookUpdate
    ? res.status(400).send("Error editing data")
    : res.status(200).send({ bookUpdate });
};

const deleteBook = async (req, res) => {
  const bookDelete = await book.findByIdAndDelete({ _id: req.params["_id"] });
  return !bookDelete
    ? res.status(400).send("book not found")
    : res.status(200).send("book deleted");
};

export default { registerBook, listBook, updateBook, deleteBook };