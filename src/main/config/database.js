import {
    app
  } from 'electron'
const { Sequelize } = require('sequelize');

const userData = app.getPath('userData');
// 创建 Sequelize 实例
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: userData + '/database.db'
});


export default sequelize
