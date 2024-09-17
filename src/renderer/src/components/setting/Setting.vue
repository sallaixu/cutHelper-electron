<!--  -->
<template>
    <div class="setting">
        <a-tabs class="tabs" v-model:activeKey="activeKey" :tab-position="mode" @tabScroll="callback">
            <a-tab-pane :key="1" tab="热键">
                <hot-key></hot-key>
            </a-tab-pane>
            
            <a-tab-pane :key="2" tab="常规">
                
            </a-tab-pane>
            


        </a-tabs>
    </div>

</template>


<script setup>
import { ref,onMounted } from 'vue';
const mode = ref('left');
const activeKey = ref(1);
const appConfig = ref({})

onMounted(()=>{
    queryAppConfig()
}) 
var queryAppConfig = () => window.electron.ipcRenderer.invoke('queryConfig').then(config => {
    console.log(config)
    appConfig.value = config
})

const callback = val => {
    console.log("123 %s",val);
};
</script>

<style scoped>
.setting{

}

.tabs {
  width: 100vw;
  height: 100vh;
}
</style>