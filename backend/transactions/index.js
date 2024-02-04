const mongoose = require("mongoose");
const Account = require("../models/bankModel");

const transferFunds = async (fromAccount, toAccount, amount) => {
  const session = mongoose.startSession();

  session.startTransaction();
  try {
    await Account.findByIdAndUpdate(fromAccount, {
      $inc: { balance: -amount },
    });
    await Account.findByIdAndUpdate(toAccount, {
      $inc: { balance: amount },
    });

    await session.commitTransaction();
    await session.endSession();
    console.log("Transaction successfully completed");
    return true;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();

    console.log("Transaction failed");
    return false;
  }
};

module.exports = { transferFunds };
