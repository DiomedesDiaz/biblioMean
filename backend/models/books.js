import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  name: String,
  author: String,
  yearPublication: Number,
  registerDate: { type: Date, default: Date.now },
  pages: Number, 
  gender: String, 
  price: Number,
});

const books = mongoose.model("books", bookSchema);

export default books;
