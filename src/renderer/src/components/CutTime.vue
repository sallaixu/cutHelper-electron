<template>
  <div class="box">
    <a-list class="demo-loadmore-list" :loading="initLoading" item-layout="horizontal" :data-source="data">
      <!-- <template #loadMore>
        <div v-if="!initLoading && !loading"
          :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
          <a-button @click="onLoadMore">loading more</a-button>
        </div>
      </template> -->
      <template #renderItem="{ item }">
        <a-list-item style="padding: 8px">
          <template #actions>
            <!-- <a key="list-loadmore-edit">edit</a> -->
            <!-- <a key="list-loadmore-more"></a> -->
            <!-- <star-filled /> -->
            <more-outlined class="jump" style="cursor: pointer;color: black;"/>
          </template>
          <a-skeleton avatar :title="false" :loading="!!item.loading" active >
            <a-list-item-meta style="height: 1.5em;line-height:1.5em;overflow: hidden">
              <template #title>
                <a href="https://www.antdv.com/">{{ item.content }}</a>
              </template>
              <!-- <template #avatar>
                <a-avatar :src="item.picture.large" />
              </template> -->
            </a-list-item-meta style="padding:1px">
            <div>{{ format(item.time,'zh_CN') }}</div>
          </a-skeleton>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { MoreOutlined } from '@ant-design/icons-vue'
import { format } from 'timeago.js';
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
    "content": t,
    "time": new Date()
  })
}

const pagination = {
  onChange: (page) => {
    console.log(page);
  },
  pageSize: 10,
};
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