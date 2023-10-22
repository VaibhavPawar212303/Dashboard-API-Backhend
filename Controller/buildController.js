const sql = require("../config/db");
const createBuild = async (req, res) => {
  const { project_type, project_id, BuildData } = req.body;
  if (!project_type) {
    res.status(400);
    throw new Error("Please add project type");
  } else if (!project_id) {
    res.status(400);
    throw new Error("Please add project ID");
  } else {
    try {
      if (project_type == "Cypress") {
        await sql`INSERT INTO builddata(project_id,status,totalSuites,totalTests,testPassed,testFailed,testSkipped,buildStart_AT,buildEnd_AT,browserPath,browserName,browserVersion,osName,osVersion,cypressVersion)
      VALUES (${project_id}, ${BuildData.status},${BuildData.totalSuites},${BuildData.totalTests},${BuildData.totalPassed},${BuildData.totalFailed},${BuildData.totalSkipped},${BuildData.startedTestsAt},${BuildData.endedTestsAt},${BuildData.browserPath},${BuildData.browserName},${BuildData.browserVersion},${BuildData.osName},${BuildData.osVersion},${BuildData.cypressVersion});`;
        res.status(200).json({ message: "Build Added Successfully" });
      } else if (project_type == "Postman_API Test") {
        try {
          var json = JSON.stringify(BuildData);
          var query = `INSERT INTO builddata(project_id,status,buildStart_AT,build_data)
          VALUES(${project_id},'${BuildData.status}','${BuildData.startedTestsAt}','${json}');`;
          sql.client.query(query, function (err, result) {
            if (err) throw err;
            res.status(200).json({ message: "Build Added Successfully" });
          });
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
};

const getBuilds = (req, res) => {
  const projectId = req.params.id;
  try {
    var query = `SELECT * FROM builddata 
   WHERE project_id = '${projectId}';`;
    sql.client.query(query, function (err, result) {
      if (err) throw err;
      res.status(200).json({ Builds: result.rows });
    });
  } catch (error) {
    console.log(error);
  }
};

const getBuildById = (req, res) => {
  const buildid = req.params.id;
  try {
    var query = `SELECT * FROM builddata 
   WHERE buildid = '${buildid}';`;
    sql.client.query(query, function (err, result) {
      if (err) throw err;
      res.status(200).json({ Builds: result.rows });
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createBuild, getBuilds, getBuildById };
