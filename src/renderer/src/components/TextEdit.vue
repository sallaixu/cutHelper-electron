<template>
<textarea id="text-editor" placeholder="粘贴到此处快速调整内容" spellcheck="false"></textarea>

</template>

<script setup>
 
</script>

<style scoped>
  body, html {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    font-family: Arial, sans-serif;
  }

  #text-editor {
    width: 100%;
    height: 100%;
    border: none; /* 去除边框线 */
    outline: none; /* 去除获得焦点时的轮廓线 */
    resize: none; /* 禁止调整大小 */
    padding: 10px;
    box-sizing: border-box;
    font-size: 16px;
    color: #333;
    background-color: transparent; /* 使文本框背景透明 */
  }

  #text-editor::placeholder {
    color: #aaa;
    font-style: italic;
  }
</style>