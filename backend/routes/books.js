import express from "express";
import books from "../controllers/books.js";
const router = express.Router();


router.post("/registerBooks", books.registerBook);
router.get("/listBooks", books.listBook);
router.put("/updateBooks", books.updateBook);
router.delete("/deleteBooks/:_id", books.deleteBook);

export default router