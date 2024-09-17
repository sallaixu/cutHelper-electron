<template>
   <div>
      <label>唤起应用/最小化:</label>
      <div style="display: flex;">

         <div style="flex: 10;border: 0px solid;border-width: 0 0 1px 0;">{{ hotKey.wakeup }}</div>
         <a-button style="flex: 1;" type="primary" @click="showModal">更改</a-button>

      </div>
      
      <!-- <edit-hot-key></edit-hot-key> -->

      <a-modal v-model:visible="editHotKeyShow" title="热键设置" @ok="handleOk" @cancel="editHotKeyCancel">
         <div class="keyword_input">
            <div v-for="item,index in pressKeys" style="height: 100%;">
            <label color="#FFDAB9" v-if="index != 0">+ </label>
            <a-tag color="green">{{ item }}</a-tag>
         </div>
         <close-circle-outlined style="position: absolute; right: 0;cursor: pointer;" @click="clearInput" />  
         </div>
         
      </a-modal>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {CloseCircleOutlined} from '@ant-design/icons-vue'
const pressKeys = ref([])
const editHotKeyShow = ref(false);
const showModal = () => {
   editHotKeyShow.value = true;
   window.addEventListener('keydown', handleKeyDown);
};
const hotKey = ref({
   "wakeup": ""
})



// 定义事件处理函数
function handleKeyDown(event) {
   var key = event.key; // 获取按键
   if (event.ctrlKey) {
      key = 'Control';
    }
    // 检查是否按下了Command键
    if (event.metaKey) {
      key = 'Command';
    }
    // 检查是否按下了Shift键
    if (event.shiftKey) {
      key = 'Shift';
    }
    // 检查是否按下了Alt键
    if (event.altKey) {
      key = 'Alt';
    }
    if (key == " ") {
      key = 'SPACE';
    }
   if (!pressKeys.value.includes(key)) {
      pressKeys.value.push(key);
   }
}

const handleOk = e => {
   console.log(e);
   window.electron.ipcRenderer.send('setStore',"hotkey.wakeup",pressKeys.value.join('+'))
   editHotKeyShow.value = false;
   window.removeEventListener('keydown', handleKeyDown);
   window.location.reload();
};

function editHotKeyCancel() {
   pressKeys.value = []
}

onMounted(() => {
   queryAppConfig()
})
var queryAppConfig = () => window.electron.ipcRenderer.invoke('queryConfig').then(config => {
   console.log(config.hotkey)
   hotKey.value = config.hotkey
})


function clearInput() {
   pressKeys.value = []
}

</script>

<style scoped>

.keyword_input{
   position: relative;
   display: flex;
   flex-direction: row;
   border: solid rgb(196, 199, 199);
   border-width: 0 0 2px 0;
   padding: 3px;
   border-radius: 5px;
   justify-items: center;
   align-items: center;
   flex-wrap: wrap;
   min-height: 3em;
}

</style>