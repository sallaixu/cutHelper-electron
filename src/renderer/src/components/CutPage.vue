<template>
  <div class="box">
    <a-tabs class="box-tabs" style="height: 100%" v-model:activeKey="activeKey" type="card" size="small">
    <a-tab-pane  key="timeList" tab="文本" style="height:100%;">
        <time-list id="timelist" ref="timeListVue"></time-list>
    </a-tab-pane>
    <a-tab-pane key="imageList" tab="图片"><image-item></image-item></a-tab-pane>
    <a-tab-pane key="groupList" tab="分组"><group></group></a-tab-pane>
    <a-tab-pane key="time" tab="白板">
      <!-- <time-page></time-page> -->
       <text-edit></text-edit>
    </a-tab-pane>
    <template #rightExtra>
      <a-button :type="appConfig.top?'primary':'default'" @click="top()">
        <template #icon><PushpinOutlined /></template>
      </a-button>
      <a-input v-model:value="searchkey" :change="search()" size="default" style="width: 8em;margin-left: 4px;" placeholder="搜索" allow-clear />
    </template>
  </a-tabs> 
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { MoreOutlined,PushpinOutlined,SearchOutlined } from '@ant-design/icons-vue'



const text = ref()
var searchkey = ref(null)
var activeKey = ref("timeList")
const timeListVue = ref(null);

var updateTop = (isTop) => window.electron.ipcRenderer.send('top',isTop)

const appConfig = ref({
  "top":true,
})


// 固定界面到最上层
function top(event) {
  appConfig.value.top = !appConfig.value.top
  //nodejs 设置窗口置顶状态
  updateTop(appConfig.value.top)
}
// 搜索关键词
function search() {
  console.log(searchkey.value)
  if(timeListVue.value != null) {
    timeListVue.value.search(searchkey.value)
  }
}
</script>


<style scoped>
.box {
  height: 100vh;
  width: 100vw;
}

.box-tabs :deep() .ant-tabs-content {
  height: 100%;
}

.box :deep() .ant-list-item-action{
  margin-left:10px !important;
}

.box :deep() .ant-tabs-nav {
  margin: 0 0 2px 0;
}
</style>