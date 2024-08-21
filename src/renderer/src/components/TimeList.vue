<template>
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
</template>

<script setup>
import { format } from 'timeago.js';
import { ref } from 'vue'
import { MoreOutlined } from '@ant-design/icons-vue'

window.electron.ipcRenderer.on('update', (_, value) => update(value))
var data = ref([])
const text = ref()
function update(t) {
  console.log(t)
  text.value = t
  data.value.push({
    "content": t,
    "time": new Date()
  })
}
</script>


<style scoped>

</style>