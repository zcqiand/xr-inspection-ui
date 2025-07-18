<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeIndex = ref(route.path)
</script>

<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-title  class="font-weight-bold">LIMS系统</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer permanent color="primary-lighten-1">
      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-home"
          title="首页"
          value="/"
          :active="activeIndex === '/'"
          @click="$router.push('/')"
        />
        <v-list-group value="system" prepend-icon="mdi-cog">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" title="系统管理"></v-list-item>
          </template>

          <v-list-item
            prepend-icon="mdi-account-multiple"
            title="用户管理"
            value="/system/users"
            :active="activeIndex.startsWith('/system/users')"
            @click="$router.push('/system/users')"
          />
          <v-list-item
            prepend-icon="mdi-account-cog"
            title="角色管理"
            value="/system/roles"
            :active="activeIndex.startsWith('/system/roles')"
            @click="$router.push('/system/roles')"
          />
          <v-list-item
            prepend-icon="mdi-shield-account"
            title="权限管理"
            value="/system/permissions"
            :active="activeIndex.startsWith('/system/permissions')"
            @click="$router.push('/system/permissions')"
          />
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-main style="height: 100%">
      <router-view style="height: 100%"/>
    </v-main>
  </v-app>
</template>

<style scoped>
.v-navigation-drawer {
  width: 200px !important;
}
.v-list-group {
  --prepend-w: 0px
}
</style>
