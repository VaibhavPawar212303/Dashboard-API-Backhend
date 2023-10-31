const sql = require("../config/db");
const fsPromises = require("fs").promises;

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

const createBuildByPassingData = async (req, res) => {
  const { project_type, project_id, BuildData } = req.body;
  const testArray = [];
  const assertionArray = [];
  const eventArray = [];

  let totalAssertion = 0;
  let totalPassAssertion = 0;
  let totalFailAssertion = 0;

  let buildStatus;

  if (!project_type) {
    res.status(400);
    throw new Error("Please add project type");
  } else if (!project_id) {
    res.status(400);
    throw new Error("Please add project ID");
  } else {
    BuildData.run.executions.forEach((element) => {
      if (element.assertions) {
        const eventArray = [];
        const assertionArray = [];
        let totalAssertionPass = 0;
        let totalAssertionFail = 0;
        let testStatus;

        element.item.event.map((event) => {
          const scriptArray = [];
          event.script.exec.map((exec) => {
            formatedEvent = exec.replace(/'/g, "");
            scriptArray.push(formatedEvent);
          });
          eventArray.push(scriptArray);
        });
        element.assertions.map((assert) => {
          if (assert.error) {
            let formatedMessage = assert.error.message.replace(/'/g, "");
            let formatedStack = assert.error.stack.replace(/'/g, "");
            const assertion = {
              assertion: assert.assertion,
              skipped: assert.skipped,
              error: {
                name: assert.error.name,
                index: assert.error.index,
                test: assert.error.test,
                message: formatedMessage,
                stack: formatedStack,
              },
            };
            assertionArray.push(assertion);
          } else {
            const assertion = {
              assertion: assert.assertion,
              skipped: assert.skipped,
            };
            assertionArray.push(assertion);
          }
        });

        element.assertions.forEach((assert) => {
          if (assert.hasOwnProperty("error")) {
            totalAssertionFail++;
          } else {
            totalAssertionPass++;
          }
        });

        if (totalAssertionPass == assertionArray.length) {
          testStatus = "pass";
        } else {
          testStatus = "fail";
        }

        const testData = {
          testid: element.item.id,
          testname: element.item.name,
          requestMethod: element.request.method,
          event: eventArray,
          assertions: assertionArray,
          totalAssertion:assertionArray.length,
          totalAssertionPass: totalAssertionPass,
          totalAssertionFail: totalAssertionFail,
          testStatus: testStatus,
        };

        testArray.push(testData);
      } else {
        const totalAssertion = 0;
        let totalAssertionPass = 0;
        let totalAssertionFail = 0;
        let testStatus;
        if (totalAssertionPass == totalAssertion) {
          testStatus = "pass";
        } else {
          testStatus = "fail";
        }
        const testData = {
          testid: element.item.id,
          testname: element.item.name,
          testMethod: element.item.request.method,
          event: element.item.event,
          assertions: [],
          totalAssertion:assertionArray.length,
          totalAssertionPass: totalAssertionPass,
          totalAssertionFail: totalAssertionFail,
          testStatus: testStatus,
        };
        testArray.push(testData);
      }
    });

    //get the total number of assertions
    testArray.map((element) => {
      totalAssertion = element.totalAssertion + totalAssertion;
      totalPassAssertion = element.totalAssertionPass + totalPassAssertion;
      totalFailAssertion = element.totalAssertionFail + totalFailAssertion;
    });

    if (totalAssertion == totalPassAssertion) {
      buildStatus = "pass";
    } else {
      buildStatus = "fail";
    }

    const formatedBuildData = {
      buildName: BuildData.collection.info.name,
      buildStatus: buildStatus,
      tests: testArray,
      runStats: BuildData.run.stats,
      totalRequestMade: testArray.length,
      totalAssertion: totalAssertion,
      totalPassAssertion: totalPassAssertion,
      totalFailAssertion: totalFailAssertion,
      buildStartedAt: BuildData.run.timings.started,
      buildendAt: BuildData.run.timings.completed,
    };

    try {
      if (project_type == "Cypress") {
        await sql`INSERT INTO builddata(project_id,status,totalSuites,totalTests,testPassed,testFailed,testSkipped,buildStart_AT,buildEnd_AT,browserPath,browserName,browserVersion,osName,osVersion,cypressVersion)
      VALUES (${project_id}, ${BuildData.status},${BuildData.totalSuites},${BuildData.totalTests},${BuildData.totalPassed},${BuildData.totalFailed},${BuildData.totalSkipped},${BuildData.startedTestsAt},${BuildData.endedTestsAt},${BuildData.browserPath},${BuildData.browserName},${BuildData.browserVersion},${BuildData.osName},${BuildData.osVersion},${BuildData.cypressVersion});`;
        res.status(200).json({ message: "Build Added Successfully" });
      } else if (project_type == "Postman_API Test") {
        try {
          var json = JSON.stringify(formatedBuildData);
          var query = `INSERT INTO builddata(project_id,status,buildStart_AT,build_data)
            VALUES( ${project_id},'${formatedBuildData.buildStatus}',${formatedBuildData.buildStartedAt},'${json}');`;
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

module.exports = {
  createBuild,
  getBuilds,
  getBuildById,
  createBuildByPassingData,
};
