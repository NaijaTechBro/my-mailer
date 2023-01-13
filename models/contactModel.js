const mongoose = require("mongoose");

const contactSchema = mongoose.Schema(
    {
        subjects: {
            type: String,
        },
        message: {
            type: String,
        },
        userId: {
            type: String
        },
    }
);

module.exports = mongoose.model("Contact", contactSchema);