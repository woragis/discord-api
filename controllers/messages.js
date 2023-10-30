/*
const mongoose = require("mongoose");
// mongoose.connect("mongodb://user:@127.0.0.1:27017/database")
mongoose
  .connect("mongodb://127.0.0.1:27017/test")
  .then(() => console.log("Connected to mongoDb server"))
  .catch(() => console.log("Error while trying to connect to mongoDb server"));

// create schema
const kittySchema = new mongoose.Schema({
  name: String,
});
kittySchema.methods.speak = function speak() {
  const greeting = this.name
    ? `Hello my name is ${this.name}`
    : "Hello I don't have a name";
  console.log(greeting);
};

// create model from schema
const Kitten = mongoose.model("Kitten", kittySchema);

const silence = new Kitten({ name: "silence" });
const fluffy = new Kitten({ name: "fluffy" });
silence.save();
fluffy.save();
silence.speak();
fluffy.speak();
let kittens = Kitten.find();
console.log(kittens);
*/
const Message = require("../models/messages");

const sendMessage = async (req, res) => {
  const sess = req.session;
  const username = sess.username;
  const { messageBody } = req.body;
  const message = new Message({
    author: username,
    body: messageBody,
  });
  try {
    const newMessage = await message.save();
    res.status(201).json(newMessage);
  } catch {
    res.status(400).json({ error: "Error sending message" });
  }
};

const getMessage = async (req, res, next) => {
  const { id } = req.params;
  let message;
  try {
    message = await Message.findById(id);
    if (message == null) {
      return res.status(404).json({ error: "Message not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server internal error" });
  }
  res.message = message;
  next();
};

const editMessage = async (req, res) => {
  const sess = res.session;
  const username = sess.username;
  const { messageBody } = req.body;
  if (username == res.message.author) {
    res.message.body = messageBody;
    res.message.lastEditedDate = Date.now;
    try {
      const editedMessage = await res.message.save();
      res.status(200).json(editedMessage);
    } catch {
      res.status(500).json({ message: "Server internal error" });
    }
  } else {
    res.status(405).json({ message: "your not allowed here" });
  }
};
const deleteMessage = async (req, res) => {
  const sess = res.session;
  const username = sess.username;
  if (username == res.message.author) {
    await res.message.deleteOne();
    res.status(200).json({ message: "message deleted" });
  } else {
    res.status(405).json({ message: "your not allowed here" });
  }
};
module.exports = { sendMessage, getMessage, editMessage, deleteMessage };
