const mongoose = require("mongoose");
const { leerUriMongo } = require("./entorno");

async function conectarBaseDatos() {
  await mongoose.connect(leerUriMongo(), {
    serverSelectionTimeoutMS: 10000,
  });
  console.log("Conexión con MongoDB establecida.");
}

async function desconectarBaseDatos() {
  await mongoose.disconnect();
}

module.exports = { conectarBaseDatos, desconectarBaseDatos };
