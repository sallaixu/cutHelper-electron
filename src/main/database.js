const { Sequelize } = require('sequelize');

// 创建 Sequelize 实例
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.db'
});


export default sequelize
