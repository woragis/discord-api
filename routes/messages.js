const router = require("express").Router();

const {
  sendMessage,
  getMessage,
  editMessage,
  deleteMessage,
} = require("../controllers/messages");

router.route("/").post(sendMessage);
router
  .route("/:id")
  .put(getMessage, editMessage)
  .patch(getMessage, editMessage)
  .delete(getMessage, deleteMessage);

module.exports = router;
