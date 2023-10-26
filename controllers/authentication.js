const pg = require("pg");
const pgConnectionString = {
  host: "localhost",
  port: "5432",
  database: "discord_api",
  user: "woragis",
  password: "woragispg",
};
let table_name = "discord_users";
const checkUsernameExistence = `CHECK EXISTS (SELECT 1 FROM ${table_name} WHERE username=$1) as username_existence`;
const checkEmailExistence = `CHECK EXISTS (SELECT 1 FROM ${table_name} WHERE email=$1) as email_existence`;

const registerUser = async (req, res) => {
  const client = new pg.Client(pgConnectionString);
  const registerQuery = `INSERT INTO ${table_name} (username, email, password) VALUES ($1, $2, $3);`;
  try {
    await client.connect();
    const { username, email, password } = req.body;
    const { username_existence } = await client.query(checkUsernameExistence, [
      username,
    ]);
    const { email_existence } = await client.query(checkEmailExistence, [
      email,
    ]);
    if (!username_existence && !email_existence) {
      const createUser = await client.query(registerQuery, [
        username,
        email,
        password,
      ]);
      let info = createUser.rows[0];
      res.status(201).json({ info });
    } else if (username_existence && email_existence) {
      res.status(400).json({ message: "username and email already exists" });
    } else if (username_existence) {
      res.status(400).json({ message: "username already exists" });
    } else if (email_existence) {
      res.status(400).json({ message: "email already exists" });
    }
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }
};

const loginUser = async (req, res) => {
  const { username, email, password } = req.body;
  const client = new pg.Client(pgConnectionString);
  try {
    await client.connect();
    if (username.length > 1) {
      const { username_existence } = await client.query(
        checkUsernameExistence,
        [username]
      );
      if (username_existence) {
        const passwordQuery = `CHECK EXISTS (SELECT 1 FROM ${table_name} WHERE username=$1 and password=$2) as correct_password;`;
        const result = await client.query(passwordQuery, [username, password]);
        const passwordCorrectness = result.rows[0];
        if (passwordCorrectness) {
          res.status(200).json({ message: "logged in" });
        } else {
          res.status(400).json({ message: "wrong password" });
        }
      }
    } else if (email.length > 1) {
      const result = await client.query(checkEmailExistence, [email]);
      const email_existence = result.rows[0];
      if (email_existence) {
        const passwordQuery = `CHECK EXISTS (SELECT 1 FROM ${table_name} WHERE email=$1 and password=$2) as correct_password;`;
        const result = await client.query(passwordQuery, [email, password]);
        const passwordCorrectness = result.rows[0];
        if (passwordCorrectness) {
          res.status(200).json({ message: "logged in" });
        } else {
          res.status(400).json({ message: "wrong password" });
        }
      }
    }
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }
};

module.exports = { registerUser, loginUser };
