const express = require("express");
const dbConnect = require("./db.js");
const rootRouter = require("./routers/index.js");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { uri } = require("./config.js");
const port = 3000;
const app = express();
// app config
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
// db connection
dbConnect(uri);
// routes
app.use("/api/v1", rootRouter);

app.listen(port, () => {
  console.log(`Connected to ${port}`);
});
