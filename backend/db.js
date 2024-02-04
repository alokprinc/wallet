const mongoose = require("mongoose");


function dbConnect(uri) {
  mongoose.connect(uri).then(() => {
    console.log(`Connected DB to ${uri}`);
  });
}

module.exports = dbConnect;
