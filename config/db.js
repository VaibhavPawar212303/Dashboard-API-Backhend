const { Client } = require("pg");

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

PGHOST = "ep-mute-art-89463778.us-east-2.aws.neon.tech";
PGDATABASE = "neondb";
PGUSER = "pawarvaibhav.vppv";
PGPASSWORD = "3HPMfCQsZWI1";
ENDPOINT_ID = "ep-mute-art-89463778";

const client = new Client({
  host: PGHOST,
  port: 5432,
  user: PGUSER,
  password: PGPASSWORD,
  database: PGDATABASE,
  ssl: true,
});
const getConnected = async () => {
  await client.connect();
  const res = await client.query("SELECT $1::text as connected", [
    "Connection to postgres successful!",
  ]);
  console.log(res.rows[0].connected);
};

getConnected();

module.exports = { client };
