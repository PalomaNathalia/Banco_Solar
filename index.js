const express = require("express");
const app = express();

app.listen(3000, console.log("Servidor en puerto 3000"));
app.use(express.json());

const {
  guardarClientes,
  getClientes,
  editarClientes,
  eliminarCliente,
  registrarTransferencia,
  getTransferencia,
} = require("./consultas");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/usuario", async (req, res) => {
  try {
    const clientes = req.body;
    const result = await guardarClientes(clientes);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send(error);
    console.log("Error código: " + error.code);
  }
});

app.get("/usuarios", async (req, res) => {
  try {
    const result = await getClientes();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send(error);
    console.log("Error código: " + error.code);
  }
});

app.put("/usuario", async (req, res) => {
  try {
    const data = req.body;
    const result = await editarClientes(data);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send(error);
    console.log("Error código: " + error.code);
  }
});

app.delete("/usuario", async (req, res) => {
  try {
    const { id } = req.query;
   await eliminarCliente(id);
   res.send("Usuario eliminado con éxito!");
  } catch (error) {
    res.status(500).send(error);
    console.log("Error código: " + error.code);
  }
});

app.post("/transferencia", async (req, res) => {
  try {
    const data = Object.values(req.body);
    const result = await registrarTransferencia(data);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send(error);
    console.log("Error código: " + error.code);
  }
});

app.get("/transferencias", async (req, res) => {
  try {
    const result = await getTransferencia();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
});
