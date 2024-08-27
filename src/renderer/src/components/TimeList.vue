<template>
  <div class="cut-list">
    <a-list class="list" :loading="initLoading" item-layout="horizontal" :data-source="allCutList">
      <template #renderItem="{ item, index }">
        <a-list-item class="list-item" v-on:click="showDetail(item)" v-on:dblclick="sendCopyItem(item)"
          style="padding: 7px" :class="{ 'bg': index % 2 === 0 }" v-if="filterItems.includes(item)">
          <template #actions>
            <a-dropdown :trigger="['click']">
              <!-- <a class="ant-dropdown-link">
                Click me
                <DownOutlined />
              </a> -->
              <more-outlined class="jump" @click.prevent style="cursor: pointer;color: black;" />
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="deleteItem(item)" key="0" style="color: #f5222d;">
                    <delete-outlined /><label style="margin-left: 8px;">删除</label>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
          <a-skeleton avatar :title="false" :loading="!!item.loading" active>
            <a-list-item-meta style="height: 1.5em;line-height:1.5em;overflow: hidden">
              <template #title>
                <div>{{ item.text }}</div>
              </template>
            </a-list-item-meta style="padding:1px">
            <div>{{ format(item.time, 'short') }}</div>
          </a-skeleton>
        </a-list-item>
      </template>

    </a-list>

  </div>
</template>

<script setup>
import { format, register } from 'timeago.js';
import { ref, onMounted, computed } from 'vue'
import { MoreOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue';
import { containsIgnoreCase } from '../../utils/StringUtil'
import { showMessageShort } from '../../utils/MessageUtil'


const localeFunc = (number, index, totalSec) => {
  return [
    ['刚刚', 'right now'],
    ['%s秒前', 'in %s seconds'],
    ['1分前', 'in 1 minute'],
    ['%s分前', 'in %s minutes'],
    ['1小时前', 'in 1 hour'],
    ['%s小时前', 'in %s hours'],
    ['昨天', 'in 1 day'],
    ['%s天前', 'in %s days'],
    ['1周前', 'in 1 week'],
    ['%s周前', 'in %s weeks'],
    ['1月前', 'in 1 month'],
    ['%s月前', 'in %s months'],
    ['1年前', 'in 1 year'],
    ['%s年前', 'in %s years']
  ][index];
};

register('short', localeFunc)
//全量剪切版数据
var allCutList = ref([])
// 搜索key
var searchKey = ref("")
var cutDetailVisible = ref(false)
var cutDetail = "";
var doubleClick = false;
onMounted(() => {
  // 获取全量数据
  sendQueryCutList();
})

// =============================发射
//查询全部剪切列表
var sendQueryCutList = () => window.electron.ipcRenderer.invoke('queryCutList').then(resp => {
  allCutList.value = resp
})

var sendDeleteItem = (remove) => window.electron.ipcRenderer.send('deleteCutListItem', JSON.stringify(remove))

//剪切板拷贝
var sendCopyItem = (item) => {
  doubleClick = true;
  console.log(item)
  window.electron.ipcRenderer.send('sendCopyItem', JSON.stringify(item))
  showMessageShort("拷贝成功")
}
//接收
window.electron.ipcRenderer.on('update', (_, value) => update(value))

function update(value) {
  allCutList.value.unshift(value)
}

// 关闭弹出信息

function showDetail(item) {

  setTimeout(() => {
    // 在延时结束时检查是否触发了双击事件，如果没有则执行单击操作
    if (!doubleClick) {
      // 执行单击操作
      console.log("click")
      cutDetailVisible.value = true;
      cutDetail = item.text
    }
    doubleClick = false; // 重置标志
  }, 250); // 设置合适的延时


}

function hidePop() {
  closed.value = false
}


const filterItems = computed(() => {
  return allCutList.value.filter(filterData);
});

function copyItem() {

}

const search = (key) => {
  searchKey.value = key
  console.log(key)
}

function filterData(item) {
  return containsIgnoreCase(item.text, searchKey.value)
}


// 删除列表中的某一项
function deleteItem(remove) {
  let index = allCutList.value.findIndex(item => item._id === remove._id);

  // 删除对象
  if (index !== -1) {
    sendDeleteItem(remove)
    allCutList.value.splice(index, 1);
    showMessageShort("删除成功")
  }else{
    showMessageShort("删除失败")
  }
}


// 暴漏方法
defineExpose({ search });
</script>


<style scoped>
/* .cut-list .ant-list-item-action li  {
  padding: 0 !important;
} */
.cut-list ::v-deep(.ant-list-item-action li) {
  padding: 0 !important;
}

.cut-list ::v-deep(.ant-list-item-action) {
  margin-left: 5px !important;
}

.cut-list ::v-deep(.ant-list-item) {
  padding-right: 3px !important;
}

.bg {
  background-color: rgb(221, 219, 219);
}

.list-item:hover {
  background-color: rgb(173, 202, 203);
}
</style>