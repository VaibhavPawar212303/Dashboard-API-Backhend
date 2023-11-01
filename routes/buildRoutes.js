const express = require("express");
const router = express.Router();
const {
  getBuilds,
  getBuildById,
  createBuildByPassingData,
} = require("../Controller/buildController");
router.post("/createbuild", createBuildByPassingData);
router.get("/getallbuild/:id", getBuilds);
router.get("/getbuild/:id", getBuildById);

module.exports = router;
    