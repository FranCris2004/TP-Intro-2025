const pg = require("pg");

const con = new pg.Pool();
await con.connect();

module.exports = con;
