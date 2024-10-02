<template>
<div class="detail-page">
    <a-card :title="item.title" bordered>
      <a-meta 
        :title=item.title 
        :description="formattedCreateTime"
        
      />
      <div class="content">
        <pre>{{ item.content }}</pre>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute();
    // 获取查询参数
const queryParams = route.query;
const params = new URLSearchParams(window.location.search)
var item = ref({
    id: params.get("id"),
    title: params.get("createTime"),
    content: params.get("content")
})
</script>

<style scoped>

.detail-page {
  width: 100vw;
  height: 100vh;
  overflow-y: scroll;
}
</style>