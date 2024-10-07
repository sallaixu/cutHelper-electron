const { DataTypes } = require('sequelize');
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/database';

// 定义 User 模型
const Group = sequelize.define('Group', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: () =>uuidv4()
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    createTime:{
        type: DataTypes.DATE,
        allowNull:false
    }
}, {
    timestamps: false
});

export default Group;
