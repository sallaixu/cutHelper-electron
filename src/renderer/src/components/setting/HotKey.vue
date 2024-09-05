<template>
 <div>
    <label>唤起应用/最小化:</label><a-input v-model:value="appConfig.hotkey.wakeup" placeholder=" ctrl + space" />
 </div>
</template>

<script setup>
import { ref,onMounted } from 'vue';
const appConfig = ref({"hotkey":{
   "wakeup":""
}})
onMounted(()=>{
    queryAppConfig()
}) 
var queryAppConfig = () => window.electron.ipcRenderer.invoke('queryConfig').then(config => {
    console.log(config)
    appConfig.value = config
})

</script>

<style scoped>

</style>