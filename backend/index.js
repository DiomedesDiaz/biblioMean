//Importar express, cors
import express from "express";
import cors from "cors";
import db from "./db/db.js";
import dotenv from "dotenv";
import books from "./routes/books.js"
import client from "./routes/client.js"
import vendor from "./routes/vendors.js"
import role from "./routes/role.js"
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/books", books);
app.use("/api/client", client);
app.use("/api/role", role);
app.use("/api/vendor", vendor);

app.listen(process.env.PORT, () =>
  console.log("Backend server running on port: " + process.env.PORT)
);

db.dbConnection();
