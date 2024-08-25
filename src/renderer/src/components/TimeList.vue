<template>
<div class="cut-list">  
<a-list class="demo-loadmore-list" :loading="initLoading" item-layout="horizontal" :data-source="allCutList">
      <!-- <template #loadMore>
        <div v-if="!initLoading && !loading"
          :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
          <a-button @click="onLoadMore">loading more</a-button>
        </div>
      </template> -->
      <template #renderItem="{ item,index }">
        <a-list-item @dblclick="sendCopyItem(item)" style="padding: 7px" :class="{'bg':index % 2 === 0}" v-if="filterItems.includes(item)">
          <template #actions>
            <more-outlined class="jump" style="cursor: pointer;color: black;"/>
          </template>
          <a-skeleton avatar :title="false" :loading="!!item.loading" active >
            <a-list-item-meta style="height: 1.5em;line-height:1.5em;overflow: hidden">
              <template #title>
                <div>{{ item.text }}</div>
              </template>
              <!-- <template #avatar>
                <a-avatar :src="item.picture.large" />
              </template> -->
            </a-list-item-meta style="padding:1px">
            <div>{{ format(item.time,'short') }}</div>
          </a-skeleton>
        </a-list-item>
      </template>
    </a-list>

  </div>
</template>

<script setup>
import { format,register } from 'timeago.js';
import { ref,onMounted,computed } from 'vue'
import { MoreOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue';
import {containsIgnoreCase} from '../../utils/StringUtil'
import {showMessageShort} from '../../utils/MessageUtil'


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

register('short',localeFunc)
//全量剪切版数据
var allCutList = ref([])
// 搜索key
var searchKey = ref("")

onMounted(()=>{
  // 获取全量数据
  sendQueryCutList();
})

// =============================发射
//查询全部剪切列表
var sendQueryCutList = () => window.electron.ipcRenderer.invoke('queryCutList').then(resp=>{
  allCutList.value = resp
})
//剪切板拷贝
var sendCopyItem = (item) => {
  console.log(item)
  window.electron.ipcRenderer.send('sendCopyItem',JSON.stringify(item))
  showMessageShort("拷贝成功")
}
//接收
window.electron.ipcRenderer.on('update', (_, value) => update(value))

function update(value) {
  allCutList.value.unshift(value)
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
  return containsIgnoreCase(item.text,searchKey.value)
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
</style>