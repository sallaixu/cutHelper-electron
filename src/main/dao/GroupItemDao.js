import Group from "../models/groupModel"
import GroupItem from "../models/groupItemModel"
import { v4 as uuidv4 } from 'uuid';
import {configStore} from '../config/config'

class GroupItemService {
    // 创建用户
    static async addGroupItem(groupItem) {
        try {
            groupItem.id = uuidv4();
            groupItem.createTime = new Date();
            const item = await GroupItem.create(groupItem);
            return item.toJSON();
        } catch (error) {
            throw new Error('Error add groupItem: ' + error.message);
        }
    }
    
    // 查询用户通过ID
    static async queryItemByGroupId(groupId) {
        try {
            const groupItems = await GroupItem.findAll({
                where: {
                  groupId: groupId,
                },
              });
            if (!groupItems) throw new Error('User not found');
            return groupItems.map(item => item.toJSON());
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


    static async deleteItem(groupItemId) {
        try {
            const item = (await GroupItem.findOne({where:{id:groupItemId}}));
            if (item){
                await item.destroy();
                return item.toJSON();
            }
            
        } catch (error) {
            throw new Error('Error retrieving users: ' + error.message);
        }
    }

}

export default GroupItemService;