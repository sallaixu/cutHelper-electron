import CutItem from "../models/cutItemModel"
import { v4 as uuidv4 } from 'uuid';

class CutItemService {
    // 创建用户
    static async addCutItem(content) {
        try {
            const item = await CutItem.create({id:uuidv4(),content:content,createTime:new Date()});
            return item.toJSON();
        } catch (error) {
            throw new Error('Error creating user: ' + error.message);
        }
    }

    // 查询用户通过ID
    static async getUserById(id) {
        try {
            const user = await User.findByPk(id);
            if (!user) throw new Error('User not found');
            return user;
        } catch (error) {
            throw new Error('Error retrieving user: ' + error.message);
        }
    }

    // 查询所有用户
    static async getAllItem() {
        try {
            const itemList = (await CutItem.findAll({order:[["createTime","DESC"]]}));
            return itemList.map(item => item.toJSON());
        } catch (error) {
            throw new Error('Error retrieving users: ' + error.message);
        }
    }

    // 更新用户
    static async updateUser(id, updates) {
        try {
            const user = await User.findByPk(id);
            if (!user) throw new Error('User not found');
            await user.update(updates);
            return user;
        } catch (error) {
            throw new Error('Error updating user: ' + error.message);
        }
    }

    // 删除用户
    static async deleteUser(id) {
        try {
            const user = await User.findByPk(id);
            if (!user) throw new Error('User not found');
            await user.destroy();
            return { message: 'User deleted successfully' };
        } catch (error) {
            throw new Error('Error deleting user: ' + error.message);
        }
    }
}

export default CutItemService;