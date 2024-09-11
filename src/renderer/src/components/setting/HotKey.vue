<template>
 <div>
    <label>唤起应用/最小化:</label><a-input v-model:value="hotKey.wakeup" placeholder=" ctrl + space" />
    <div>{{ pressKeys }}</div>
    <button @click="recordSequence">修改</button>
 </div>
</template>

<script setup>
import { ref,onMounted } from 'vue';
import Mousetrap  from 'mousetrap';
var pressKeys = ref("")
const hotKey = ref({
   "wakeup":""
})
onMounted(()=>{
    queryAppConfig()
}) 
var queryAppConfig = () => window.electron.ipcRenderer.invoke('queryConfig').then(config => {
    console.log(config.hotkey)
    hotKey.value = config.hotkey
})

function recordSequence() {

    window.addEventListener('keydown', function(event) {
            var key = event.key; // 获取按键
            pressKeys.value +=key
        });
}




</script>

<style scoped>

</style>