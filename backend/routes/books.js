import express from "express";
import books from "../controllers/books.js";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/admin.js";
const router = express.Router();


router.post("/registerBooks", auth, admin, books.registerBook);
router.get("/listBooks", auth, books.listBook);
router.get("/findBook/:_id", auth, books.findBook);
router.put("/updateBooks", auth, admin, books.updateBook);
router.delete("/deleteBooks/:_id", auth, admin, books.deleteBook);

export default router