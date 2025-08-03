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
        
        <!-- 新增试验管理菜单组 -->
        <v-list-group value="experiment-process" prepend-icon="mdi-flask">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" title="试验管理"></v-list-item>
          </template>
          
          <!-- 委托登记子菜单 -->
          <v-list-item
            prepend-icon="mdi-clipboard-text"
            title="委托登记"
            value="/reports/entrustment"
            :active="activeIndex.startsWith('/reports/entrustment')"
            @click="$router.push('/reports/entrustment')"
          />
          <v-list-item
            prepend-icon="mdi-clipboard-text"
            title="任务分配"
            value="/reports/task-assignments"
            :active="activeIndex.startsWith('/reports/task-assignments')"
            @click="$router.push('/reports/task-assignments')"
          />
          <v-list-item
          prepend-icon="mdi-pencil-box"
          title="数据录入"
          value="/reports/data-entry"
          :active="activeIndex.startsWith('/reports/data-entry')"
          @click="$router.push('/reports/data-entry')"
          />
          <v-list-item
            prepend-icon="mdi-file-document-outline"
            title="报告编制"
            value="/reports/compile"
            :active="activeIndex.startsWith('/reports/compile')"
            @click="$router.push('/reports/compile')"
          />
          <v-list-item
            prepend-icon="mdi-file-document-edit"
            title="报告审核"
            value="/reports/review"
            :active="activeIndex.startsWith('/reports/review')"
            @click="$router.push('/reports/review')"
          />
          <v-list-item
            prepend-icon="mdi-file-check"
            title="报告批准"
            value="/reports/approve"
            :active="activeIndex.startsWith('/reports/approve')"
            @click="$router.push('/reports/approve')"
          />
          <v-list-item
            prepend-icon="mdi-email"
            title="报告发放"
            value="/reports/issue"
            :active="activeIndex.startsWith('/reports/issue')"
            @click="$router.push('/reports/issue')"
            data-testid="report-issue-menu"
          />
        <v-list-item
          prepend-icon="mdi-archive"
          title="报告归档"
          value="/reports/archive"
          :active="activeIndex.startsWith('/reports/archive')"
          @click="$router.push('/reports/archive')"
          data-testid="report-archive-menu"
        />
        </v-list-group>
        
        <v-list-group value="sys" prepend-icon="mdi-cog">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" title="系统管理"></v-list-item>
          </template>

          <v-list-item
            prepend-icon="mdi-account-multiple"
            title="用户管理"
            value="/sys/user"
            :active="activeIndex.startsWith('/sys/user')"
            @click="$router.push('/sys/user')"
          />
          <v-list-item
            prepend-icon="mdi-account-cog"
            title="角色管理"
            value="/sys/role"
            :active="activeIndex.startsWith('/sys/role')"
            @click="$router.push('/sys/role')"
          />
          <v-list-item
            prepend-icon="mdi-shield-account"
            title="权限管理"
            value="/sys/permission"
            :active="activeIndex.startsWith('/sys/permission')"
            @click="$router.push('/sys/permission')"
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
