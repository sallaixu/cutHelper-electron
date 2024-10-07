import Group from "../models/groupModel"
import { v4 as uuidv4 } from 'uuid';
import {configStore} from '../config/config'

class GroupService {

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
    static async createGroup(name) {
        try {
            const item = await Group.create({id:uuidv4(),name:name,createTime:new Date()});
            return item.toJSON();
        } catch (error) {
            throw new Error('Error creating user: ' + error.message);
        }
    }
    
    // 查询用户通过ID
    static async queryGroupById(id) {
        try {
            const group = await Group.findByPk(id);
            if (!group) throw new Error('User not found');
            return group.toJSON;
        } catch (error) {
            throw new Error('Error retrieving user: ' + error.message);
        }
    }

    // 查询所有内容
    static async getAllItem() {
        try {
            const itemList = (await Group.findAll({order:[["createTime","DESC"]]}));
            return itemList.map(item => item.toJSON());
        } catch (error) {
            throw new Error('Error retrieving users: ' + error.message);
        }
    }

}

export default GroupService;