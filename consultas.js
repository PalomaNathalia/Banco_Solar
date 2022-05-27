const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "postgres",
  database: "bancosolar",
  port: 5432,
});

const guardarClientes = async (clientes) => {
  const values = Object.values(clientes);
  console.log(values);
  const consulta = {
    text: "INSERT INTO usuarios (nombre, balance) VALUES ($1, $2) ",
    values,
  };
  const result = await pool.query(consulta);
  return result;
};

const getClientes = async () => {
  const { rows } = await pool.query(
    "SELECT * FROM usuarios WHERE estado = true"
  );
  return rows;
};

const editarClientes = async (clientes) => {
  const values = Object.values(clientes);
  const consulta = {
    text: `UPDATE usuarios SET nombre = $1, balance = $2 WHERE nombre = $1 RETURNING *`,
    values,
  };
  const { rows } = await pool.query(consulta);
  return rows;
};

const eliminarCliente = async (id) => {
  const { rows } = await pool.query(`UPDATE usuarios SET estado = false WHERE id = ${id}`);
  return rows;
};

const registrarTransferencia = async (data) => {
  const values = [data[0], data[1], Number(data[2])];
  // console.log(values)
  const historialTransferencia = {
    text: "INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES ($1,$2,$3,now())",
    values,
  };
  const cuentaEmisor = {
    text: "UPDATE usuarios SET balance = balance - $2 WHERE id = $1",
    values: [data[0], Number(data[2])],
  };

  const cuentaReceptor = {
    text: "UPDATE usuarios SET balance = balance + $2 WHERE id = $1",
    values: [data[1], Number(data[2])],
  };

  try {
    await pool.query("BEGIN");
    await pool.query(historialTransferencia);
    await pool.query(cuentaEmisor);
    await pool.query(cuentaReceptor);
    await pool.query("COMMIT");
    return true;
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
};

const getTransferencia = async () => {
  const consulta = {
    text: "SELECT e.nombre, r.nombre, monto, fecha FROM transferencias AS u INNER JOIN usuarios AS e ON u.emisor = e.id INNER JOIN usuarios AS r ON u.receptor = r.id",
    rowMode: "array",
  };
  const { rows } = await pool.query(consulta);
  return rows;
};

module.exports = {
  guardarClientes,
  getClientes,
  editarClientes,
  eliminarCliente,
  registrarTransferencia,
  getTransferencia,
};
