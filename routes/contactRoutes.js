const express = require("express");
const { contactUs } = require("../controllers/xeusController");
const router = express.Router();
const { isAuthenticatedUser } = require("../middleware/authMiddleware");

router.post("/contacts", isAuthenticatedUser, contactUs);

module.exports = router;