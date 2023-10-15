const express = require("express");
const router = express.Router();
let buildData = require("../BuildData.json");
var fs = require("fs");
const fsPromises = require("fs").promises;

router.post("/createbuild", (req, res) => {
  const { ProjectName, ProjectID, BuildData } = req.body;
  var test = [];
  BuildData.runs.forEach((runs) => {
    test.push(JSON.stringify(runs.tests));
  });
  if (!ProjectName) {
    res.status(400);
    throw new Error("Please add project name");
  } else if (!ProjectID) {
    res.status(400);
    throw new Error("Please add project ID");
  } else {
    fsPromises.readFile("BuildData.json", "utf-8").then((data) => {
      let json = JSON.parse(data);
      json.push({
        BuildID: `build0${json.length + 1}`,
        ProjectName: `${ProjectName}`,
        ProjectID: `${ProjectID}`,
        status: BuildData.status,
        totalSuites: BuildData.totalSuites,
        totalTests: BuildData.totalTests,
        testPassed: BuildData.totalPassed,
        testFailed: BuildData.totalFailed,
        testSkipped: BuildData.totalSkipped,
        buildStart_AT: BuildData.startedTestsAt,
        buildEnd_AT: BuildData.endedTestsAt,
        browserPath: BuildData.browserPath,
        browserName: BuildData.browserName,
        browserVersion: BuildData.browserVersion,
        osName: BuildData.osName,
        osVersion: BuildData.osVersion,
        cypressVersion: BuildData.cypressVersion,
        Tests: test,
      });
      fsPromises
        .writeFile("BuildData.json", JSON.stringify(json))
        .then(() => {
          res.status(200).json({
            BuildID: `build0${json.length + 1 - 1}`,
            ProjectName: `${ProjectName}`,
            ProjectID: `${ProjectID}`,
            status: BuildData.status,
            totalSuites: BuildData.totalSuites,
            totalTests: BuildData.totalTests,
            testPassed: BuildData.totalPassed,
            testFailed: BuildData.totalFailed,
            testSkipped: BuildData.totalSkipped,
            buildStart_AT: BuildData.startedTestsAt,
            buildEnd_AT: BuildData.endedTestsAt,
            browserPath: BuildData.browserPath,
            browserName: BuildData.browserName,
            browserVersion: BuildData.browserVersion,
            osName: BuildData.osName,
            osVersion: BuildData.osVersion,
            cypressVersion: BuildData.cypressVersion,
            Tests: test,
          });
        })
        .catch((err) => {
          res.status(400);
          throw new Error("Append Failed: " + err);
        });
    });
  }
});

router.get("/getbuild/:id", (req, res) => {
  const projectId = req.params.id;
  let buildArray = [];
  fsPromises.readFile("BuildData.json", "utf-8").then((data) => {
    let json = JSON.parse(data);
    for (var i = 0; i < json.length; i++) {
      if (json[i].ProjectID === projectId) {
        buildArray.push(json[i]);
      }
    }
    res.status(200).json({ builds: buildArray });
  });
});

module.exports = router;
