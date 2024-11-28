<template>
  <div class="cut-list">
    <RecycleScroller
      class="scroller"
      :items="allCutList"
      :item-size="50"
      :page-mode="true"
      v-slot="{ item, index }"
    >
        <div
          class="list-item"
          v-on:click="showDetail(item)"
          v-on:dblclick="sendCopyItem(item)"
          style="padding: 7px"
          :class="{ 'bg': index % 2 === 0 }"
          <!-- v-if="filterItems.includes(item)" -->
        >
          <!-- 原有的 a-list-item 内容 -->
          <div>
            <a-dropdown :trigger="['click']">
              <more-outlined class="jump" @click.prevent style="cursor: pointer;color: black;" />
              <template #overlay>
                <a-menu>
                  <a-menu-item  @click="deleteItem(item)" key="0" style="color: #f5222d;">
                    <div >
                      <delete-outlined /><span  style="margin-left: 8px;">删除</span>
                    </div>
                  </a-menu-item>
                  <a-menu-item @click="openDetail(item)" key="1">
                    <div >
                    <EditOutlined  /><span  style="margin-left: 8px;">详情</span>
                    </div>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
          <a-skeleton avatar :title="false" :loading="!!item.loading" active>
            <a-list-item-meta style="height: 1.5em;line-height:1.5em;overflow: hidden">
              <template #title>
                <a-popover  trigger="hover" :mouseEnterDelay="0.8" placement="topLeft">
                  <template #title>{{ formatDate(item.createTime) }}</template>
                  <template #content>
                    <div class="detail-style" style="max-height: 80vh;max-width: 90vw;"><pre>{{ item.content }}</pre></div></template>
                <div style="margin-right: 6px; overflow: hidden;">{{ item.content }}</div>
              </a-popover>
              </template>
            </a-list-item-meta>
            <div>{{ format(item.createTime, 'short') }}</div>
          </a-skeleton>
        </div>
    </RecycleScroller>
  </div>
</template>

<script setup>
import { format, register } from 'timeago.js';
import { ref, onMounted, computed } from 'vue'
import { MoreOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue';
import { RecycleScroller } from 'vue-virtual-scroller';
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
var initLoading = ref(true)
// 搜索key
var searchKey = ref("")
var cutDetailVisible = ref(false)
var cutDetail = "";
var doubleClick = false;
let timeoutId = null;
onMounted(() => {
  // 获取全量数据
  sendQueryCutList();
  initLoading.value = false
})

// =============================发射
//查询全部剪切列表
var sendQueryCutList = () => window.electron.ipcRenderer.invoke('queryCutList').then(resp => {
  allCutList.value = resp
})

var sendDeleteItem = (remove) => window.electron.ipcRenderer.send('deleteCutListItem', JSON.stringify(remove))

var sendOpenDetail = (item) => window.electron.ipcRenderer.send('openDetailWindow', JSON.stringify(item))

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


function openDetail(item) {
  sendOpenDetail(item)
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
  clearTimeout(timeoutId); // 取消之前的定时器
  timeoutId = setTimeout(() => {
    console.log(key)
    searchKey.value = key
  }, 500);
}

function filterData(item) {
  return containsIgnoreCase(item.content, searchKey.value)
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

function formatDate(dateStr) {
  const date = new Date(dateStr);
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始
const day = String(date.getDate()).padStart(2, '0');
const hours = String(date.getHours()).padStart(2, '0');
const minutes = String(date.getMinutes()).padStart(2, '0');
const seconds = String(date.getSeconds()).padStart(2, '0');

const formattedDate = `${year}年${month}月${day}日，${hours}:${minutes}:${seconds}`;
return formattedDate
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

.list-item {
  display: flex;
}
.list-item:hover {
  background-color: rgb(173, 202, 203);
}

.click—class {
  cursor: pointer !important;
}

.detail-style{
  overflow-y:scroll;
  overflow-x: scroll;
}
</style>