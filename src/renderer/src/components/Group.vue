<template>
    <div class="box">
        <div style="display: flex;flex-direction: row;justify-content: right;align-items: center;">
            <div style="padding-right: 5px !important;">
                <a-tooltip placement="topRight">
                    <template #title>同步</template>
                    <SyncOutlined @click="queryGroups" style="font-size: 16px;cursor: pointer;" />
                </a-tooltip>
            </div>



            <div style="padding-right: 5px !important;">

                <a-tooltip placement="topRight">
                    <template #title>新建文件夹</template>
                    <PlusCircleOutlined @click="createGroup" style="font-size: 16px;cursor: pointer;" />
                </a-tooltip>
            </div>

        </div>
        <div style="flex: 1;overflow-y: scroll;">
        <a-directory-tree :loadData="loadItem" v-model:expandedKeys="expandedKeys" v-model:selectedKeys="selectedKeys"
            multiple :tree-data="groupList" :loadedKeys="loadedKeys" :load="loadKey">

            <template #title="{ key: treeKey, title }">
                <a-dropdown :trigger="['contextmenu']">
                    <span>{{ title }}</span>
                    <template #overlay>
                        <a-menu @click="({ key: menuKey}) => onContextMenuClick(treeKey, menuKey,title)">

                            <a-menu-item key="1">
                                <div>
                                    <EditOutlined /><span style="margin-left: 8px;">编辑</span>
                                </div>
                            </a-menu-item>

                            <a-menu-item key="copy">
                                <div>
                                    <CopyOutlined /><span style="margin-left: 8px;">复制</span>
                                </div>
                            </a-menu-item>

                            <a-menu-item key="delete" style="color: #f5222d;">
                                <div>
                                    <delete-outlined /><span style="margin-left: 8px;">删除</span>
                                </div>
                            </a-menu-item>

                            

                        </a-menu>
                    </template>
                </a-dropdown>
            </template>

        </a-directory-tree>
        </div>
        <a-modal v-model:open="newGroup" title="新建文件夹" @ok="sendCreateRequest">
            <a-input v-model:value="newGroupName" placeholder="文件夹名称" />
        </a-modal>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { PlusCircleOutlined, SyncOutlined, DeleteOutlined, EditOutlined,CopyOutlined } from '@ant-design/icons-vue'
import { showMessageShort } from '../../utils/MessageUtil'
const expandedKeys = ref([]);
const selectedKeys = ref([]);
const newGroupName = ref("")
const newGroup = ref(false)
const groupList = ref([])

const loadedKeys = ref([]);

onMounted(() => {
    queryGroups()
})

function loadKey(keys) {
    console.log(keys)
}

function loadItem(node) {
    console.log(node)
    if (node.dataRef.isLeaf) {
        return;
    }
    return new Promise(resolve => {


        queryGroupItems(node.key).then(items => {
            console.log("test", items)
            node.dataRef.children = [...items]
            node.dataRef.isLeaf = false
            resolve()
        })
        loadedKeys.value.push(node.key)

    })


}



//查询所有分组
const queryGroups = () => window.electron.ipcRenderer.invoke("queryGroups", null).then((items) => {
    loadedKeys.value = []
    expandedKeys.value = []
    groupList.value = items.map(obj => {
        let newObj = {};
        newObj.title = obj.name
        newObj.key = obj.id
        newObj.createTime = obj.createTime
        newObj.children = [],
            newObj.isLeaf = false
        return newObj;
    });

})
//查询分组下的数据
const queryGroupItems = (groupId) => window.electron.ipcRenderer.invoke("queryGroupItems", groupId).then((items) => {
    return items.map(obj => {
        let newObj = {};
        newObj.title = obj.title
        newObj.content = obj.content
        newObj.key = obj.id
        newObj.createTime = obj.createTime
        newObj.groupId = obj.groupId
        newObj.isLeaf = true
        return newObj;
    });

})

const deleteGroupItem = (groupItemId) => window.electron.ipcRenderer.invoke("deleteGroupItem", groupItemId).then((item) => {
    if (item) {
        showMessageShort("删除成功")
    }
})

function createGroup() {
    newGroup.value = true;
}


function sendCreateRequest() {
    console.log(newGroupName.value)
    window.electron.ipcRenderer.invoke('createGroup', newGroupName.value).then((item) => {
        console.log(item)
    })
    newGroup.value = false
    newGroupName.value = ""
}


function onContextMenuClick(treeKey, menuKey,title) {
    console.log("item", treeKey, menuKey,title)
    switch (menuKey) {
        case "delete":
            console.log("删除key", treeKey)
            deleteGroupItem(treeKey)
            break
        case "copy":
            let tmp_data = {content:title}
            window.electron.ipcRenderer.send('sendCopyItem', JSON.stringify(tmp_data))
            showMessageShort("复制成功")
            break
        default:
            console.log("没有匹配操作")


    }
}

//删除item
function deleteItem({ event, node }) {
    console.log("item", event)
}


</script>

<style scoped>
.box{
   display: flex;
   flex-direction: column;
   height: 100%;
}

</style>