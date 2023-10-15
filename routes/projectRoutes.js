const express = require("express");
const router = express.Router();
var fs = require("fs");
const fsPromises = require("fs").promises;

router.post("/createproject", (req, res) => {
  const { projectName, projectDesc, userID } = req.body;
  if (!projectName) {
    res.status(200).json({ message: "Please Add Project Name" });
  } else if (!projectDesc) {
    res.status(200).json({ message: "Please Add Project Describtion" });
  } else {
    fsPromises.readFile("ProjectData.json", "utf-8").then((data) => {
      let json = JSON.parse(data);
      json.push({
        ProjectID: `project0${json.length + 1}`,
        UserId: `${userID}`,
        projectName: `${projectName}`,
        projectDesc: `${projectDesc}`,
      });
      fsPromises
        .writeFile("ProjectData.json", JSON.stringify(json))
        .then(() => {
          res.status(200).json({
            ProjectID: `project0${json.length + 1 - 1}`,
            UserId: `${userID}`,
            projectName: `${projectName}`,
            projectDesc: `${projectDesc}`,
            message: "Project Created Successfully",
          });
        })
        .catch((err) => {
          res.status(400);
          throw new Error("Append Failed: " + err);
        });
    });
  }
});

router.get("/getproject/:id", (req, res) => {
  const userID = req.params.id;
  let projectArray = [];
  fsPromises.readFile("ProjectData.json", "utf-8").then((data) => {
    let json = JSON.parse(data);
    for (var i = 0; i < json.length; i++) {
      if (json[i].UserId === userID) {
        projectArray.push(json[i]);
      }
    }
    res.status(200).json({ projects: projectArray });
  });
});

module.exports = router;
