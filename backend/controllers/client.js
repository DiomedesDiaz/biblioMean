import client from "../models/client.js";

const registerClient = async (req, res) => {
    //name, email, password, registerDate, dbStatus
  if (!req.body.name || !req.body.email || !req.body.password || !req.body.dbStatus )
    return res.status(400).send("Incomplete Data");
  const existingClient = await client.findOne({ name: req.body.name });
  if (existingClient) return res.status(400).send("The client already exist");

  const clientSchema = new client({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    dbStatus: true,
  })

  const result = await clientSchema.save();
  if(!result) return res.status(400).send("Failed to register client");
  return res.status(200).send({ result })
};

const listClient = async (req , res) =>{
  const clientSchema = await client.find();
 // if(!clientSchema || clientSchema.length == 0) return res.status(400).send("Empty client list");
 // return res.status(200).send({clientSchema});
 
//ternario

 return !clientSchema || clientSchema.length == 0 ? res.status(400).send("Empty client list") : res.status(200).send({clientSchema});
}

const updateClient = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password || !req.body.dbStatus)
    return res.status(400).send("Incomplete data");

  const existingClient = await client.findOne({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    dbStatus: req.body.dbStatus,
  });
  if (existingClient) return res.status(400).send("The client already exist");

  const clientUpdate = await client.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    dbStatus: req.body.dbStatus,
  });

  return !clientUpdate
    ? res.status(400).send("Error editing data")
    : res.status(200).send({ clientUpdate });
};

const deleteClient = async (req, res) => {
  const clientDelete = await client.findByIdAndDelete({ _id: req.params["_id"] });
  return !clientDelete
    ? res.status(400).send("client not found")
    : res.status(200).send("client deleted");
};


export default { registerClient, listClient, updateClient, deleteClient};