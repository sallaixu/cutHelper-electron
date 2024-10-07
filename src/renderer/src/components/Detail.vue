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

const params = new URLSearchParams(window.location.search)
console.log(params)
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
  -webkit-user-select: text;
}
</style>