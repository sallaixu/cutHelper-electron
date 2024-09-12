<template>
 <div>
    <label>唤起应用/最小化:</label><a-input v-model:value="hotKey.wakeup" placeholder=" ctrl + space" />
    <div>{{ pressKeys }}</div>
    <button>修改</button>
    <edit-hot-key></edit-hot-key>
 </div>
</template>

<script setup>
import { ref,onMounted } from 'vue';
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





</script>

<style scoped>

</style>