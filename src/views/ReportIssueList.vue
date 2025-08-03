<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" md="4">
        <v-select
          v-model="statusFilter"
          :items="statusOptions"
          label="状态过滤"
          clearable
        ></v-select>
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="filteredReports"
      :loading="loading"
      item-key="id"
    >
      <template v-slot:item.actions="{ item }">
        <v-btn
          color="primary"
          @click="submitIssue(item.id)"
          :disabled="item.status !== '待发放'"
        >
          提交发放
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getIssueReports, submitIssue as apiSubmitIssue } from '@/services/report.service';
import type { Report } from '@/types/report';

const headers = ref([
  { title: '报告ID', key: 'id', align: 'center' },
  { title: '委托单位', key: 'entrustment.clientName', align: 'center' },
  { title: '状态', key: 'status', align: 'center' },
  { title: '操作', key: 'actions', align: 'center', sortable: false },
]);

const reports = ref<Report[]>([]);
const loading = ref(true);
const statusFilter = ref('');

// 状态选项
const statusOptions = [
  { title: '待发放', value: '待发放' },
  { title: '已发放', value: '已发放' },
  { title: '已取消', value: '已取消' },
];

// 过滤后的报告列表
const filteredReports = computed(() => {
  if (!statusFilter.value) return reports.value;
  return reports.value.filter(report => report.status === statusFilter.value);
});

onMounted(() => {
  fetchReports();
});

async function fetchReports() {
  try {
    loading.value = true;
    reports.value = await getIssueReports();
  } catch (error) {
    console.error('获取待发放报告失败:', error);
    alert('获取待发放报告失败');
  } finally {
    loading.value = false;
  }
}

async function submitIssue(reportId: number) {
  try {
    await apiSubmitIssue(reportId);
    alert('报告发放成功');
    // 刷新列表
    await fetchReports();
  } catch (error) {
    console.error('报告发放失败:', error);
    alert('报告发放失败');
  }
}
</script>