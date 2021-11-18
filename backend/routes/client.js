import express from "express";
import client from "../controllers/client.js";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/admin.js";
const router = express.Router();


router.post("/registerClient", client.registerClient);
router.post("/registerAdmin",  client.registerAdmin);
router.post("/login", client.login);
router.get("/listClient", auth, admin, client.listClient);
router.get("/findClient/:_id", auth, admin, client.findClient);
router.put("/updateClient", auth, admin, client.updateClient);
router.delete("/deleteClient/:_id", auth, admin, client.deleteClient);


export default router