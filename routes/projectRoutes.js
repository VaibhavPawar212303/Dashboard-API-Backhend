const express = require("express");
const router = express.Router();

const {createProject,getProject} = require("../Controller/projectController");

router.post("/createproject", createProject);
router.get("/getproject/:id", getProject);

module.exports = router;
