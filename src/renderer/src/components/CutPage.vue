<template>
  <div class="box">
    <a-tabs v-model:activeKey="activeKey" type="card" size="small">
    <a-tab-pane key="timeList" tab="列表"><time-list></time-list></a-tab-pane>
    <a-tab-pane key="groupList" tab="分组">分组页面todo</a-tab-pane>
    <template #rightExtra>
      <a-button type="primary" @click="top()">
        <template #icon><PushpinOutlined /></template>
      </a-button>

      <a-button>Right Extra Action</a-button>
    </template>
  </a-tabs>
    
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { MoreOutlined,PushpinOutlined,SearchOutlined } from '@ant-design/icons-vue'


const text = ref()
var activeKey = ref("timeList")

var updateTop = (isTop) => window.electron.ipcRenderer.send('top')
const appConfig = ref({
  "top":true,
})
// 固定界面到最上层
function top(event) {
  appConfig.value.top = !appConfig.value.top
  //nodejs 设置窗口置顶状态
  console.log("click")
  updateTop(appConfig.value.top)
}


</script>


<style>
.box {
  height: 100vh;
  width: 100vw;
}

.ant-list-item-action{
  margin-left:10px !important;
}
</style>