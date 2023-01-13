const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");

const contactUs = asyncHandler(async (req, res) => {
    const { subjects, email, message } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
    res.status(400);
    throw new Error("User not found, please signup");
    }

  //   Validation
    if (!subjects || !message) {
    res.status(400);
    throw new Error("Please add subject and message");
    }

