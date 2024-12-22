import CutItem from "../models/cutItemModel"
import { v4 as uuidv4 } from 'uuid';
import {configStore} from '../config/config'
import CutImageItem from "../models/cutImageItem";

class CutImageItemService {

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
    // 添加图片记录
    static async addCutImageItem(image) {
        try {
            await CutImageItem.create({id:uuidv4(),content:image,createTime:new Date()});
            // await CutImageItemService.checkMaxItem()
            return image;
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

    // 查询所有图片
    static async getAllItem() {
        try {
            const itemList = (await CutImageItem.findAll({order:[["createTime","DESC"]]}));
            return itemList;
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

export default CutImageItemService;