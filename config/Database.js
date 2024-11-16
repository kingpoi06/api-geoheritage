import { Sequelize } from "sequelize";

const db = new Sequelize("db-geoheritage", "root", "", {
  host: "localhost",
  dialect: "mysql",
});
export default db;

// import { Sequelize } from "sequelize";

// const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DBDATABASE } = process.env;

// const db = new Sequelize(DB_DBDATABASE, DB_USERNAME, DB_PASSWORD, {
//   host: DB_HOST,
//   dialect: "mysql",
// });

// export default db;