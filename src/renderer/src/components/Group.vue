<template>
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

    <a-directory-tree :loadData="loadItem" v-model:expandedKeys="expandedKeys" v-model:selectedKeys="selectedKeys"
        multiple :tree-data="groupList">

        <template #title="{ key: treeKey, title }">
            <a-dropdown :trigger="['contextmenu']">
                <span>{{ title }}</span>
                <template #overlay>
                    <a-menu @click="({ key: menuKey }) => onContextMenuClick(treeKey, menuKey)">

                        <a-menu-item @click="deleteItem(item)" key="1">
                            <div>
                                <EditOutlined /><span style="margin-left: 8px;">编辑</span>
                            </div>
                        </a-menu-item>
                        <a-menu-item @click="deleteItem(item)" key="0" style="color: #f5222d;">
                            <div>
                                <delete-outlined /><span style="margin-left: 8px;">删除</span>
                            </div>
                        </a-menu-item>

                    </a-menu>
                </template>
            </a-dropdown>
        </template>

    </a-directory-tree>

    <a-modal v-model:open="newGroup" title="新建文件夹" @ok="sendCreateRequest">
        <a-input v-model:value="newGroupName" placeholder="文件夹名称" />
    </a-modal>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { PlusCircleOutlined, SyncOutlined, MoreOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons-vue'
const expandedKeys = ref([]);
const selectedKeys = ref([]);
const newGroupName = ref("")
const newGroup = ref(false)
const groupList = ref([])

onMounted(() => {
    queryGroups()
})

function loadItem(node) {
    console.log(node)
    return new Promise(resolve=>{
        
    if (node.dataRef.children) {
        resolve();
        return;
    }

    queryGroupItems(node.key).then(items=>{
        console.log("test",items)
        node.dataRef.children = [...items]
        node.dataRef.isLeaf = false
        resolve()
    })
    
    })
    

}



//查询所有分组
const queryGroups = () => window.electron.ipcRenderer.invoke("queryGroups", null).then((items) => {
    groupList.value = items.map(obj => {
        let newObj = {};
        newObj.title = obj.name
        newObj.key = obj.id
        newObj.createTime = obj.createTime
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

</script>