// 数据库
const {Sequelize} = require('sequelize');
const allocation = require('../alloction');


module.exports = new Sequelize({
    dialect: 'mysql',
    host: allocation.host,
    port: allocation.port,
    username: allocation.username,
    password: allocation.password,
    database: allocation.database,
});
