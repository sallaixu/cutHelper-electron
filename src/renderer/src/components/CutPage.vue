<template>
  <div class="box">
    <a-tabs class="box-tabs" style="height: 100%" v-model:activeKey="activeKey" type="card" size="small">
    <a-tab-pane key="timeList" tab="列表" style="height:100%;overflow-y:scroll;"><time-list ref="timeListVue"</time-list></a-tab-pane>
    <a-tab-pane key="groupList" tab="分组">分组页面todo</a-tab-pane>
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


<style>
.box {
  height: 100vh;
  width: 100vw;
}

.box-tabs .ant-tabs-content {
  height: 100%;
}

.ant-list-item-action{
  margin-left:10px !important;
}
</style>