const { Sequelize, DataTypes } = require('sequelize');

//const sequelize = new Sequelize('db1', 'user1', 'password1', {
//    host: 'website1-db',
//    dialect: 'postgres',
//  });

const sequelize = new Sequelize('db1', 'user1', 'password1', {
  host: 'website1-db',
  dialect: 'postgres',
});

/*
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
  }
);
*/

const Website = sequelize.define('Website', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = { sequelize, Website };
