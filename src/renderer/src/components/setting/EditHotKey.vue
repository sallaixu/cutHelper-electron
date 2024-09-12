<template>
 <div style="z-index:99999;height: 300px; width: 100%;">
    <div v-for="item in pressKeys">
        <a-tag color="green">{{ item }}</a-tag>
    </div>
 </div>
</template>

<script setup>
import { ref,onMounted } from 'vue';
const pressKeys = ref([])

window.addEventListener('keydown', function(event) {
            var key = event.key; // 获取按键
            if (!pressKeys.value.includes(key)) {
                pressKeys.value.push(key)
            }
});




</script>

<style scoped>

</style>