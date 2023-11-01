const client = require("../config/db");

const createProject = async (req, res) => {
  const { user_id, Project_Name, Project_Desc, Project_Type, Project_ID } =
    req.body;
  if (!Project_Name) {
    res.status(200).json({ message: "Please Add Project Name" });
  } else if (!Project_Desc) {
    res.status(200).json({ message: "Please Add Project Describtion" });
  } else if (!Project_Type) {
    res.status(200).json({ message: "Please Add Project Type" });
  } else {
    try {
      await sql`INSERT INTO projectdata(user_id,Project_Name, Project_ID,Project_Desc,Project_Type)
      VALUES (${user_id},${Project_Name},${Project_ID}, ${Project_Desc},${Project_Type});`;
      res.status(200).json({ message: "Build Added Successfully" });
    } catch (error) {
      console.log(error);
    }
  }
};

const getProject = async (req, res) => {
  const userID = req.params.id;
  try {
    var query = `SELECT * FROM projectdata 
   WHERE user_id = '${userID}';`;
    client.query(query, function (err, result) {
      if (err) throw err;
      res.status(200).json({ projects: result.rows });
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createProject, getProject };
