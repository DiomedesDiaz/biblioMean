import vendor from "../models/vendors.js";

const registerVendor = async (req, res) => {
    //name, address, registerDate
  if (!req.body.name || !req.body.address )
    return res.status(400).send("Incomplete Data");
  const existingVendor = await vendor.findOne({ name: req.body.name });
  if (existingVendor) return res.status(400).send("The vendor already exist");

  const vendorSchema = new vendor({
    name: req.body.name,
    address: req.body.address,
  })

  const result = await vendorSchema.save();
  if(!result) return res.status(400).send("Failed to register vendor");
  return res.status(200).send({ result })
};

const listVendor = async (req , res) =>{
  const vendorSchema = await vendor.find();
 // if(!vendorSchema || vendorSchema.length == 0) return res.status(400).send("Empty vendor list");
 // return res.status(200).send({vendorSchema});
 
//ternario

 return !vendorSchema || vendorSchema.length == 0 ? res.status(400).send("Empty vendor list") : res.status(200).send({vendorSchema});
}

const updateVendor = async (req, res) => {
  if (!req.body.name || !req.body.address )
    return res.status(400).send("Incomplete data");

  const existingVendor = await vendor.findOne({
    name: req.body.name,
    address: req.body.address,
  });
  if (existingVendor) return res.status(400).send("The vendor already exist");

  const vendorUpdate = await vendor.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    address: req.body.address,
  });

  return !vendorUpdate
    ? res.status(400).send("Error editing data")
    : res.status(200).send({ vendorUpdate });
};

const deleteVendor = async (req, res) => {
  const vendorDelete = await vendor.findByIdAndDelete({ _id: req.params["_id"] });
  return !vendorDelete
    ? res.status(400).send("vendor not found")
    : res.status(200).send("vendor deleted");
};

export default { registerVendor, listVendor, updateVendor, deleteVendor };