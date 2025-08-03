<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="reports"
      :loading="loading"
    >
      <template v-slot:item.actions="{ item }">
        <v-btn icon @click="viewDetail(item.id)">
          <v-icon>mdi-eye</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getApproveList } from '@/services/report.service';
import type { Report } from '@/types/report';

const router = useRouter();
const headers = ref([
  { title: '报告ID', key: 'id', align: 'center' as const },
  { title: '委托单位', key: 'entrustment.clientName', align: 'center' as const },
  { title: '状态', key: 'status', align: 'center' as const },
  { title: '操作', key: 'actions', align: 'center' as const, sortable: false },
]);

const reports = ref<Report[]>([]);
const loading = ref(true);

onMounted(() => {
  fetchReports();
});

async function fetchReports() {
  try {
    loading.value = true;
    reports.value = await getApproveList();
  } catch (error) {
    console.error('获取待批准报告列表失败:', error);
    alert('获取待批准报告列表失败');
  } finally {
    loading.value = false;
  }
}

function viewDetail(id: number) {
  router.push({
    name: 'ReportApproveDetail',
    params: { id }
  });
}
</script>