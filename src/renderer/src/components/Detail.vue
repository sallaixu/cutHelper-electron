<template>
<div class="detail-page">
    <a-card title="内容详情" bordered>
      <a-meta 
        :title="item.title" 
        :description="formattedCreateTime"
        style="margin-bottom: 16px;"
      />
      <a-divider />
      <div class="content">
        <p>{{ item.content }}</p>
      </div>
      <a-button type="primary" @click="goBack">返回</a-button>
    </a-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
var item = ref({
    title:"复制内容",
    content: "eopfsldfodsfsdjfsdfjdslfdslfdsjsl"
})
</script>

<style scoped>

</style>