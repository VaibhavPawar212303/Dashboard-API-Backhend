// app.js
const postgres = require("postgres");
let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

PGHOST = "ep-mute-art-89463778.us-east-2.aws.neon.tech";
PGDATABASE = "neondb";
PGUSER = "pawarvaibhav.vppv";
PGPASSWORD = "3HPMfCQsZWI1";
ENDPOINT_ID = "ep-mute-art-89463778";

require("dotenv").config();


const connect = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: "require",
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});

async function getPgVersion() {
  const result = await connect`select version()`;
  console.log(result);
}

getPgVersion();

module.exports = { connect };
