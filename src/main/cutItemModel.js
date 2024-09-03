const { DataTypes } = require('sequelize');
import sequelize from './database';

// 定义 User 模型
const CutItem = sequelize.define('CutItem', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    createTime:{
        type: DataTypes.DATE,
        allowNull:false
    }
}, {
    timestamps: false
});

export default CutItem;
