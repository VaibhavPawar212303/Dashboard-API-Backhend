// Do not expose your Neon credentials to the browser
// .env
let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

PGHOST = "ep-mute-art-89463778.us-east-2.aws.neon.tech";
PGDATABASE = "neondb";
PGUSER = "pawarvaibhav.vppv";
PGPASSWORD = "3HPMfCQsZWI1";
ENDPOINT_ID = "ep-mute-art-89463778";

// app.js
const postgres = require("postgres");

const sql = postgres({
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
  const result = await sql`select version()`;
  console.log("Postgrace Is Connected");
}

getPgVersion();

module.exports = sql;
