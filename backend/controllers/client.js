import client from "../models/client.js";
import role from "../models/role.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import moment from "moment";

const registerClient = async (req, res) => {
  //name, email, password, registerDate, dbStatus
  if (!req.body.name || !req.body.email || !req.body.password)
    return res.status(400).send("Incomplete Data");

  const existingClient = await client.findOne({ email: req.body.email });
  if (existingClient)
    return res.status(400).send({ message: "The client already exist" });

  const roleId = await role.findOne({ name: "user" });
  if (!role) return res.status(400).send({ message: "No role was assigned" });

  const passHash = await bcrypt.hash(req.body.password, 10);

  const clientSchema = new client({
    name: req.body.name,
    email: req.body.email,
    password: passHash,
    roleId: roleId._id,
    dbStatus: true,
  });

  const result = await clientSchema.save();
  // if (!result) return res.status(400).send("Failed to register client");
  // return res.status(200).send({ result });
  try {
    return res.status(200).json({
      token: jwt.sign(
        {
          _id: result._id,
          name: result.name,
          roleId: result.roleId,
          iat: moment().unix(),
        },
        process.env.SECRET_KEY_JWT
      ),
    });
  } catch (e) {
    return res.status(400).send({ message: "Login error" });
  }
};

const registerAdmin = async (req, res) => {
  if (
    !req.body.name ||
    !req.body.email ||
    !req.body.password ||
    !req.body.roleId
  )
    return res.status(400).send({ message: "Incomplete data" });

  const existingAdmin = await client.findOne({ email: req.body.email });
  if (existingAdmin)
    return res.status(400).send({ message: "The user is already registered" });

  const passHash = await bcrypt.hash(req.body.password, 10);

  const adminRegister = new client({
    name: req.body.name,
    email: req.body.email,
    password: passHash,
    roleId: req.body.roleId,
    dbStatus: true,
  });

  const result = await adminRegister.save();
  return !result
    ? res.status(400).send({ message: "Failed to register user" })
    : res.status(200).send({ result });
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

  const changeEmail = await client.findById({ _id: req.body._id });
  if (req.body.email !== changeEmail.email)
    return res
      .status(400)
      .send({ message: "The email should never be changed" });

  let pass = "";

  if (req.body.password) {
    pass = await bcrypt.hash(req.body.password, 10);
  } else {
    const clientFind = await client.findOne({ email: req.body.email });
    pass = clientFind.password;
  }

  // // Validamos el correo del usuario
  // const existingEmail = await client.findOne({ email: req.body.email });
  // if (!existingEmail) {
  //   // si el email no existe sacamos el siguiente mensaje (significa que lo cambio y no se puede)
  //   return res.status(400).send({ message: "Email cannot be changed" });
  // } else {
  //   // si existe y el id pertenece a otro usuario sacamos el siguiente mensaje
  //   if (existingEmail._id != req.body._id)
  //     return res
  //       .status(400)
  //       .send({ message: "the email already belongs to another client" });

  const existingClient = await client.findOne({
    name: req.body.name,
    email: req.body.email,
    roleId: req.body.roleId,
  });
  if (existingClient)
    return res.status(400).send("You didn't make any changes");

  const clientUpdate = await client.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    email: req.body.email,
    password: pass,
    roleId: req.body.roleId,
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
          roleId: clientLogin.roleId,
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
  registerAdmin,
  listClient,
  updateClient,
  findClient,
  deleteClient,
  login,
};
