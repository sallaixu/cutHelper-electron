<template>
  <div class="cut-list" ref="scrollerRef" style="height: 100%;">
    <a-back-top :target="()=>getTarget()"/>
    <RecycleScroller class="scroller" :items="showItemList" :item-size="40" v-slot="{ index, item }"
      :key="listKey" id="cutItemBox" :page-mode>
      <!-- page-mode -->
      <!--  -->
      
      <div class="list-item" v-on:dblclick="sendCopyItem(item)" style="padding: 5px">
        <!-- 原有的 a-list-item 内容 -->
        <div style="height: 1.5em;line-height:1.5em;flex:1;overflow: hidden;margin-right: 6px;">
        <a-skeleton avatar :title="false" :loading="!!item.loading" active>
          <a-list-item-meta >
            <template #title>
              <a-popover trigger="hover" :mouseEnterDelay="1" placement="topLeft">
                <template #title>{{ formatDate(item.createTime) }}</template>
                <template #content>
                  <div class="detail-style" style="max-height: 80vh;max-width: 90vw;">
                    <pre>{{ item.content }}</pre>
                  </div>
                </template>
                <div style="margin-right: 6px;white-space: nowrap;">
                  <label>{{ (index) }} . {{ item.content }}</label>
                </div>
              </a-popover>
            </template>
          </a-list-item-meta>
        </a-skeleton>
        </div>
        <div style="display: flex;justify-content: space-between;align-items: center; width: fit-content">
          <div>{{ format(item.createTime, 'short') }}</div>
          <a-dropdown :trigger="['click']">
            <more-outlined class="jump" @click.prevent style="cursor: pointer;color: black;" />
            <template #overlay>
              <a-menu>
                <a-menu-item @click="deleteItem(item)" key="0" style="color: #f5222d;">
                  <div>
                    <delete-outlined /><span style="margin-left: 8px;">删除</span>
                  </div>
                </a-menu-item>
                <a-menu-item @click="openDetail(item)" key="1">
                  <div>
                    <EditOutlined /><span style="margin-left: 8px;">详情</span>
                  </div>
                </a-menu-item>
                <a-menu-item @click="openGroupSelect(item)" key="2">
                  <div>
                    <GroupOutlined /><span style="margin-left: 8px;">分组</span>
                  </div>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
    </RecycleScroller>
    <div  style="overflow: scroll;">
      <a-modal v-model:open="groupSelectOpen" title="添加分组" ok-text="确认" cancel-text="取消" @ok="addItemToGroup()">
      <a-radio-group v-model:value="groupSelectId">
        <div v-for="item,index in groupList" :key="item.id">
          <a-radio :style="radioStyle" :value="item.id">{{ item.name }}</a-radio>
        </div>
      </a-radio-group>
    </a-modal>

    </div>
    
  </div>

</template>

<script setup>
import { format, register } from 'timeago.js';
import { ref, onMounted, computed, nextTick, watch, watchEffect } from 'vue'
import { MoreOutlined, DeleteOutlined, EditOutlined ,GroupOutlined} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue';
import { RecycleScroller } from 'vue-virtual-scroller';
import { containsIgnoreCase } from '../../utils/StringUtil'
import { showMessageShort } from '../../utils/MessageUtil'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'


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
const allCutList = ref([])

const showItemList = ref([])
var initLoading = ref(true)
// 搜索key
var searchKey = ref("")
var cutDetailVisible = ref(false)
var cutDetail = "";
var doubleClick = false;
let timeoutId = null;
const listKey = ref(0)

const groupList = ref([])

const groupSelectOpen = ref(false)
const groupSelectId = ref("")
const currCutItem = ref({})

const scrollerRef = ref(null);
onMounted(() => {
  // 获取全量数据
  sendQueryCutList();
  initLoading.value = false
})

watchEffect(()=>{
  //获取总列表的状态
  if (searchKey.value){
    showItemList.value = allCutList.value.filter(filterData)
  }else{
    showItemList.value = allCutList.value
  }
  listKey.value = 0
})

// =============================发射
//查询全部剪切列表
var sendQueryCutList = () => window.electron.ipcRenderer.invoke('queryCutList').then(resp => {
  allCutList.value = resp
})

var sendDeleteItem = (remove) => window.electron.ipcRenderer.send('deleteCutListItem', JSON.stringify(remove))

var sendOpenDetail = (item) => window.electron.ipcRenderer.send('openDetailWindow', JSON.stringify(item))


//查询所有分组
const queryGroups = () => window.electron.ipcRenderer.invoke("queryGroups", null).then((items) => {
  groupList.value = items
})

const addGroupItem = (groupItem) => window.electron.ipcRenderer.invoke("addGroupItem", groupItem).then((item) => {
  if(item){
    showMessageShort("添加成功")
  }
})

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
  // console.log(value)
  allCutList.value.unshift(value);
  allCutList.value.pop()
  // listKey.value += 1;

  // nextTick(() => {
  //   // scrollerRef.value.$el.scrollTop += 1;
  //   document.getElementsByClassName('cut-list').scrollTop = 100
  // });
}
// 关闭弹出信息

// 打开选择分组Model
function openGroupSelect(item) {
    groupSelectOpen.value = true
    currCutItem.value = item
    queryGroups()
    

}

function openDetail(item) {
  sendOpenDetail(item)
}

function addItemToGroup() {
    groupSelectOpen.value = false
    let item = currCutItem.value
    if (!item){
      return
    }
    let tmpGroupItem = {
      groupId : groupSelectId.value,
      title : item.content,
      content : item.content,
    }
    addGroupItem(tmpGroupItem)
}
function hidePop() {
  closed.value = false
}


function getTarget() {
  return document.getElementById("cutItemBox")
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
  } else {
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
  height: 3em;
  align-items: center;
}

.list-item:hover {
  background-color: rgb(171, 225, 153);
}

.click—class {
  cursor: pointer !important;
}

.detail-style {
  overflow-y: scroll;
  overflow-x: scroll;
}

.scroller {
  height: 100%;
}
</style>