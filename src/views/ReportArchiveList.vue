<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6">报告归档管理</h1>
      </v-col>
    </v-row>

    <!-- 待归档报告表格 -->
    <v-row>
      <v-col cols="12">
        <h2 class="text-h6 mb-4">待归档报告</h2>
        <v-data-table
          :headers="headers"
          :items="pendingArchiveReports"
          :loading="loading"
          item-key="id"
        >
          <template v-slot:item.actions="{ item }">
            <v-btn
              color="primary"
              @click="submitArchive(item.id)"
              :disabled="item.status !== '已发放'"
            >
              提交归档
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- 已归档报告表格 -->
    <v-row class="mt-8">
      <v-col cols="12">
        <h2 class="text-h6 mb-4">已归档报告</h2>
        <v-data-table
          :headers="headers"
          :items="archivedReports"
          :loading="loading"
          item-key="id"
        >
          <template v-slot:item.actions="{ item }">
            <v-btn
              color="error"
              @click="withdrawArchive(item.id)"
              :disabled="item.status !== '已归档'"
            >
              撤回归档
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Report } from '@/types/report';

const headers = ref([
  { title: '报告ID', key: 'id', align: 'center' },
  { title: '委托单位', key: 'entrustment.clientName', align: 'center' },
  { title: '报告类型', key: 'type', align: 'center' },
  { title: '状态', key: 'status', align: 'center' },
  { title: '操作', key: 'actions', align: 'center', sortable: false },
]);

const reports = ref<Report[]>([]);
const loading = ref(true);

// 计算属性：待归档报告
const pendingArchiveReports = computed(() => {
  return reports.value.filter(report => report.status === '已发放');
});

// 计算属性：已归档报告
const archivedReports = computed(() => {
  return reports.value.filter(report => report.status === '已归档');
});

onMounted(() => {
  fetchReports();
});

async function fetchReports() {
  try {
    loading.value = true;
    // 临时模拟数据
    reports.value = [
      {
        id: 1,
        entrustmentId: 1,
        entrustment: {
          id: 1,
          clientName: '客户A',
          contactPerson: '联系人A',
          contactPhone: '12345678901',
          inspectionItems: ['检测项1', '检测项2']
        },
        reportNumber: 'REPORT-001',
        status: '已发放',
        type: '检测报告',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01'
      },
      {
        id: 2,
        entrustmentId: 2,
        entrustment: {
          id: 2,
          clientName: '客户B',
          contactPerson: '联系人B',
          contactPhone: '12345678902',
          inspectionItems: ['检测项3']
        },
        reportNumber: 'REPORT-002',
        status: '已归档',
        type: '分析报告',
        createdAt: '2025-01-02',
        updatedAt: '2025-01-03'
      },
      {
        id: 3,
        entrustmentId: 3,
        entrustment: {
          id: 3,
          clientName: '客户C',
          contactPerson: '联系人C',
          contactPhone: '12345678903',
          inspectionItems: ['检测项4', '检测项5']
        },
        reportNumber: 'REPORT-003',
        status: '已发放',
        type: '评估报告',
        createdAt: '2025-01-03',
        updatedAt: '2025-01-04'
      }
    ] as Report[];
  } catch (error) {
    console.error('获取报告数据失败:', error);
  } finally {
    loading.value = false;
  }
}

// 提交归档方法（待实现）
async function submitArchive(reportId: number) {
  console.log(`提交归档报告ID: ${reportId}`);
  // 后续将调用归档API
}

// 撤回归档方法（待实现）
async function withdrawArchive(reportId: number) {
  console.log(`撤回归档报告ID: ${reportId}`);
  // 后续将调用撤回归档API
}
</script>