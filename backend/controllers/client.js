import client from "../models/client.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import moment from "moment";

const registerClient = async (req, res) => {
  //name, email, password, registerDate, dbStatus
  if (!req.body.name || !req.body.email || !req.body.password)
    return res.status(400).send("Incomplete Data");

  const existingClient = await client.findOne({ name: req.body.name });
  if (existingClient) return res.status(400).send({message: "The client already exist"});

  const hash = await bcrypt.hash(req.body.password, 10);

  const clientSchema = new client({
    name: req.body.name,
    email: req.body.email,
    password: hash,
    dbStatus: true,
  });

  const result = await clientSchema.save();
  if (!result) return res.status(400).send("Failed to register client");
  return res.status(200).send({ result });
};

const listClient = async (req, res) => {
  const clientList = await client.find();
  return clientList.length === 0
    ? res.status(400).send({ message: "Empty clients list" })
    : res.status(200).send({ clientList });
};

const updateClient = async (req, res) => {
  if (!req.body.name || !req.body.email)
    return res.status(400).send("Incomplete data");

  let pass = "";

  if (req.body.password) {
    pass = await bcrypt.hash(req.body.password, 10)
  } else {
    const clientFind = await client.findOne({ email: req.body.email });
    pass = clientFind.password;
  }

  // Validamos el correo del usuario
  const existingEmail = await client.findOne({ email: req.body.email });
  if (!existingEmail) {
    // si el email no existe sacamos el siguiente mensaje (significa que lo cambio y no se puede)
    return res.status(400).send({ message: "Email cannot be changed" });
  } else {
    // si existe y el id pertenece a otro usuario sacamos el siguiente mensaje
    if (existingEmail._id != req.body._id)
      return res
        .status(400)
        .send({ message: "the email already belongs to another client" });
  }

  const existingClient = await client.findOne({
    name: req.body.name,
    email: req.body.email,
  });
  if (existingClient)
    return res.status(400).send("You didn't make any changes");

  const clientUpdate = await client.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    email: req.body.email,
    password: pass,
  });

  return !clientUpdate
    ? res.status(400).send({ message: "Error editing data" })
    : res.status(200).send({ message: "Client updated" });
};

const deleteClient = async (req, res) => {
  const clientDelete = await client.findByIdAndDelete({
    _id: req.params["_id"],
  });
  return !clientDelete
    ? res.status(400).send("client not found")
    : res.status(200).send("client deleted");
};

const findClient = async (req, res) => {
  const clientfind = await client.findById({ _id: req.params["_id"] });
  return !clientfind
    ? res.status(400).send({ message: "No search results" })
    : res.status(200).send({ clientfind });
};

const login = async (req, res) => {
  if (!req.body.email || !req.body.password)
    return res.status(400).send({ message: "Incomplete data" });

  const clientLogin = await client.findOne({ email: req.body.email });
  if (!clientLogin)
    return res.status(400).send({ message: "Wrong email or password" });

  // if (clientLogin.password !== req.body.password)
  //   res.status(400).send({ message: "Wrong email or password" });

  const hash = await bcrypt.compare(req.body.password, clientLogin.password);
  if (!hash)
    return res.status(400).send({ message: "Wrong email or password" });

  try {
    return res.status(200).json({
      token: jwt.sign(
        {
          _id: clientLogin._id,
          name: clientLogin.name,
          iat: moment().unix(),
        },
        process.env.SECRET_KEY_JWT
      ),
    });
  } catch (e) {
    return res.status(400).send({ message: "login error" }, e);
  }
};

export default {
  registerClient,
  listClient,
  updateClient,
  findClient,
  deleteClient,
  login,
};
