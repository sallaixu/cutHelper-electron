const { DataTypes } = require('sequelize');
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/database';

// 定义 GroupItem 模型
const GroupItem = sequelize.define('GroupItem', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: () =>uuidv4()
    },
    groupId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: false
    },
    createTime:{
        type: DataTypes.DATE,
        allowNull:false
    },
    updateTime:{
        type: DataTypes.DATE,
        allowNull:true
    }
}, {
    timestamps: false
});

export default GroupItem;
