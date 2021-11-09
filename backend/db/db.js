// Importar libreria
//const mongoose = require("mongoose");
import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connection with MongoDB: OK");
  } catch (e) {
    console.log("Connection with MongoDB: FAILED - ERROR: \n" + e);
  }
};

export default { dbConnection };
