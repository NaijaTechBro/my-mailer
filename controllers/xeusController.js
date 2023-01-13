const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");

const contactUs = asyncHandler(async (req, res) => {
    const { subjects, email, message } = req.body;
    const user = await User.findById(req.user._id);

  
   //send welcome mail
  const subject = "Cryptea - Olubori Paul";
  const send_to = email;
  const sent_from = process.env.EMAIL_USER;
  const reply_to = "hello@cryptea.me";
  const fullname = user.name;
  const template = "xeus";

  try {
    await sendEmail(
      subject,
      send_to,
      sent_from,
      reply_to,
      template,
      fullname,
    );
    res
    .status(200)
    .json({ success: true, message: "Email Sent"});
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent, please try again");
  }

});

module.exports = {
    contactUs,
};