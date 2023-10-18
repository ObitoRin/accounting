<script setup lang="ts">
import { ref } from "vue";
const refCount = ref(0);
const onClick = () => {
  refCount.value += 1;
};
</script>
<template>
  <div>
    {{ refCount }}
  </div>
  <div>
    <button @click="onClick">+1</button>
  </div>
</template>
<style></style>