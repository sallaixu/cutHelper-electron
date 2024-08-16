<template>
    <div class="box">
    <!-- <div>{{ text }}</div> -->
    <!-- <a-button type="primary" @click="handleClick">Primary</a-button> -->
    <!-- <a-list size="default" :pagination="pagination" bordered  :data-source="data">
        <template #renderItem="{ item }">
            <a-list-item>{{ item }}</a-list-item>
        </template>
        <template #header>
            <div>历史复制</div>
        </template>
    
    </a-list> -->
    <a-table :columns="columns" :data-source="data" bordered :scroll="{y: 1000 }">
    <template #bodyCell="{ column }">
      <template v-if="column.key === 'operation'">
        <a>action</a>
      </template>
    </template>
  </a-table>
</div>
</template>

<script setup>
import { ref } from 'vue'
const text = ref()
const columns = ref([
  {
    title: '内容',
    width: 100,
    dataIndex: 'content',
    key: 'content',
    fixed: 'left',
  },
  {
    title: '操作',
    width: 10,
    dataIndex: 'age',
    key: 'age',
    fixed: 'left',
  }])
window.electron.ipcRenderer.on('update', (_, value) => update(value))
var data = ref([])
function update(t) {
    console.log(t)
    text.value = t
    data.value.push({
        "content":t
    })
}

const pagination = {
  onChange: (page) => {
    console.log(page);
  },
  pageSize: 10,
};
</script>


<style scoped>
.box{
    height: 100vh;
    width: 100vw;
}
</style>