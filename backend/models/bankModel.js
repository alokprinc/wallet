const { mongoose, mongo } = require("mongoose");

const BankSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
    unique: true,
  },
  balance: { type: Number, required: true, default: 0 },
});

const Account = mongoose.model("Account", BankSchema);
module.exports = { Account };
