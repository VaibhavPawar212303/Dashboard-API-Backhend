const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const connect = require("./config/db");
const PORT = process.env.PORT;
const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/", require("./routes/blogRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/project", require("./routes/projectRoutes"));
app.use("/api/build", require("./routes/buildRoutes"));
app.use("/api/test", require("./routes/testRoutes"));
app.listen(PORT, () => {
  console.log(`App Is Listening On Port ${PORT}`);
});
