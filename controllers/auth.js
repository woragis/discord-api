const bcrypt = require("bcrypt");
const pg = require("pg");
const pgConnectionString = {
  host: "localhost",
  port: "5432",
  database: "discord",
  user: "discord_admin",
  password: "discord_123",
};
let databaseUsersTable = "discord_users";
const registerUser = async (req, res) => {
  const sess = req.session;
  const { username, email, password } = req.body;
  const client = new pg.Client(pgConnectionString);
  try {
    await client.connect();
    client.query(
      `INSERT INTO ${databaseUsersTable} (username, email, password) VALUES ($1, $2, $3) RETURNING *;`,
      [username, email, password],
      (err, result) => {
        const newUser = result;
        res.status(201).json(newUser);
      }
    );
  } finally {
    await client.end();
  }
  //   const client = new pg.Client(pgConnectionString);
  //   try {
  //     await client.connect();
  //     client.query(
  //       `INSERT INTO ${databaseUsersTable} (username, email, password) VALUES ($1, $2, $3) RETURNING *;`,
  //       [username, email, password],
  //       (err, result) => {
  //         if (err) res.status(400).json({ message: "invalid inputs" });
  //         sess.username = username;
  //         sess.email = email;
  //         sess.password = password;
  //         // const createdUser = result.rows[0];
  //         res.status(201).json({ message: "created" });
  //       }
  //     );
  //   } finally {
  //     await client.end();
  //   }
};
const loginUser = async (req, res) => {
  const sess = req.session;
  const { username, email, password } = req.body;
  const client = new pg.Client(pgConnectionString);
  try {
    await client.connect();
    const passwordResult = await client.query(
      `SELECT password FROM ${databaseUsersTable} WHERE email=$1;`,
      [email]
    );
    bcrypt.compare(password, passwordResult.rows[0], (err, same) => {
      if (same) {
        sess.username = username;
        sess.email = email;
        sess.password = password;
        res.status(200).json({ message: "logged in" });
      }
    });
  } finally {
    await client.end();
  }
};

const logoutUser = async (req, res) => {
  if (req.session.username) {
    req.session.destroy();
    res.json({ message: "logged out" });
  } else {
    res.json({ message: "u're logged out" });
  }
};

module.exports = { registerUser, loginUser, logoutUser };
