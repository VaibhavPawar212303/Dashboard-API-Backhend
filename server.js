const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
var bodyParser = require("body-parser");
const connect = require("./config/db");
const PORT = process.env.PORT;
const app = express();
app.use(
  cors({
    origin: "*",
  })
);

// app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "200mb",
    extended: true,
    parameterLimit: 1000000,
  })
);

//app.use("/api/", require("./routes/blogRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/project", require("./routes/projectRoutes"));
app.use("/api/build", require("./routes/buildRoutes"));

app.listen(PORT, () => {
  console.log(`App Is Listening On Port ${PORT}`);
});
