require('dotenv').config();
const envConfig = require('./env');

const dbConfig = {
  username: envConfig.db.user || 'postgres',
  password: envConfig.db.pass || 'postgres',
  database: envConfig.db.name || 'taskflow',
  host: envConfig.db.host || 'localhost',
  port: envConfig.db.port || 5432,
  dialect: 'postgres',
  logging: envConfig.env === 'development' ? console.log : false,
};

// Exporting in a format that Sequelize CLI expects (development, test, production keys)
// as well as the raw connection config for the application to initialize the Sequelize instance.
module.exports = {
  development: dbConfig,
  test: {
    ...dbConfig,
    database: `${dbConfig.database}_test`,
    logging: false
  },
  production: {
    username: envConfig.db.user,
    password: envConfig.db.pass,
    database: envConfig.db.name,
    host: envConfig.db.host,
    port: envConfig.db.port,
    dialect: 'postgres',
    logging: false
  },
  // the raw config to easily pull in our app
  config: dbConfig
};
