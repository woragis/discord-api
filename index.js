const express = require("express");
const session = require("express-session");
const redis = require("redis");
const RedisStore = require("connect-redis").default;
require("dotenv").config();

const port = process.env.SERVER_PORT;
const app = express();

const redisClient = redis.createClient({
  name: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
});
// Initialize client.
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: false,
      maxAge: 1000 * 60 * 10,
    },
  })
);
redisClient.connect().catch(console.error);
redisClient.on("error", (err) =>
  console.log("Could not establish a connection with redis.\n" + err)
);
redisClient.on("connect", (err) =>
  console.log("Connected to redis successfully")
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1);

const logger = require("./middlewares/log");
app.use(logger);
const authentication = require("./routes/authentication");
app.use("/auth", authentication);
const messages = require("./routes/messages");
app.use("/messages", messages);

app.listen(port, () => console.log(`Server Running on ${port}`));
