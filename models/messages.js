const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  author: { type: String, required: true },
  body: { type: String, required: true },
  sentDate: { type: Date, required: true, default: Date.now },
  lastEditedDate: { type: Date, required: false },
});
module.exports = mongoose.model("Message", messageSchema);
