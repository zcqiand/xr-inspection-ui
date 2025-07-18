<template>
  <div>
    <!-- 子路由视图 -->
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SystemManagement'
});
</script>