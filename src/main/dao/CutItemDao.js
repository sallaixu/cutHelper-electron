import CutItem from "../models/cutItemModel"
import { v4 as uuidv4 } from 'uuid';
import {configStore} from '../config/config'

class CutItemService {

    static async checkMaxItem() {
        var max = configStore.get("cut.maxItem")
        var count = await CutItem.count()
        console.log(max + " " + count)
        if(count > max) {
          const oldestItems = await CutItem.findAll({
              order: [['createTime', 'ASC']], // 按创建时间升序排序
              limit: count - max // 获取超出最大数量的部分
          });

          // 删除最早的项目
          for (const item of oldestItems) {
              await item.destroy();
          }
        }
      }
    // 创建用户
    static async addCutItem(content) {
        try {
            const item = await CutItem.create({id:uuidv4(),content:content,createTime:new Date()});
            await CutItemService.checkMaxItem()
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
    static async deleteItem(item) {
        try {
            const cutItem = await CutItem.findByPk(item.id);
            if (!cutItem) throw new Error('cutItem not found');
            await cutItem.destroy();
        } catch (error) {
            throw new Error('Error deleting user: ' + error.message);
        }
    }
}

export default CutItemService;