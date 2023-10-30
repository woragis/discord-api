const express = require("express");
require("dotenv").config();

const port = process.env.SERVER_PORT;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1);

app.listen(port, () => console.log(`Server Running on ${port}`));
