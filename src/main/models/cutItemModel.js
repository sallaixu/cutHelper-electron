const { DataTypes } = require('sequelize');
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/database';

// 定义 User 模型
const CutItem = sequelize.define('CutItem', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: () =>uuidv4()
    },
    content: {
        type: DataTypes.TEXT,
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

export default CutItem;
