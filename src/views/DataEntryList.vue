<template>
  <div class="data-entry-list">
    <div style="margin-bottom: 20px;">
      <div style="font-size: 20px; font-weight: bold">数据录入列表</div>
    </div>

    <v-data-table
      :headers="headers"
      :items="reports"
      :loading="loading"
      hide-default-footer
    >
      <template v-slot:item.status="{ item }">
        <v-chip :color="getStatusColor(item.status)">
          {{ item.status }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn size="small" @click="viewDetail(item)">查看详情</v-btn>
      </template>
    </v-data-table>

    <v-snackbar v-model="error" color="error">
      {{ errorMessage }}
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { request } from '@/utils/request';
import type { ReportEntry } from '@/types/report'; // 需要创建此类型

export default defineComponent({
  name: 'DataEntryList',
  setup() {
    const router = useRouter();
    const reports = ref<ReportEntry[]>([]);
    const loading = ref(false);
    const error = ref(false);
    const errorMessage = ref('');

    const headers = ref([
      { title: '报告ID', key: 'id' },
      { title: '委托单位', key: 'entrustUnit' },
      { title: '状态', key: 'status' },
      { title: '操作', key: 'actions', sortable: false }
    ]);

    const fetchReports = async () => {
      loading.value = true;
      try {
        const response = await request.get('/api/reports/entry');
        reports.value = response.data;
      } catch (err) {
        error.value = true;
        errorMessage.value = '获取数据录入列表失败';
        console.error('获取数据录入列表失败:', err);
      } finally {
        loading.value = false;
      }
    };

    const getStatusColor = (status: string) => {
      switch(status) {
        case '已完成': return 'success';
        case '处理中': return 'primary';
        case '待处理': return 'warning';
        default: return 'info';
      }
    };

    const viewDetail = (item: ReportEntry) => {
      router.push({ name: 'ReportDetail', params: { id: item.id } });
    };

    onMounted(fetchReports);

    return {
      reports,
      loading,
      error,
      errorMessage,
      headers,
      getStatusColor,
      viewDetail
    };
  }
});
</script>

<style scoped>
.data-entry-list {
  padding: 20px;
  width: 100%;
}
</style>