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
        <v-btn icon @click="confirmSubmit(item.id)" :disabled="item.status !== '已录入'">
          <v-icon>mdi-send</v-icon>
        </v-btn>
        <v-btn icon @click="confirmWithdraw(item.id)" :disabled="item.status !== '已录入'">
          <v-icon>mdi-undo</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="confirmDialog" max-width="400">
      <v-card>
        <v-card-title>确认提交</v-card-title>
        <v-card-text>确定要提交该报告吗？</v-card-text>
        <v-card-actions>
          <v-btn @click="confirmDialog = false">取消</v-btn>
          <v-btn color="primary" @click="doSubmitReport">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- 撤回确认对话框 -->
    <v-dialog v-model="withdrawDialog" max-width="400">
      <v-card>
        <v-card-title>确认撤回</v-card-title>
        <v-card-text>确定要撤回该报告吗？</v-card-text>
        <v-card-actions>
          <v-btn @click="withdrawDialog = false">取消</v-btn>
          <v-btn color="error" @click="withdrawReport(selectedReportId!)">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getCompileReports, submitCompileReport, withdrawCompileReport } from '@/services/report.service';
import type { Report } from '@/types/report';

const headers = ref([
  { title: '报告ID', key: 'id', align: 'center' as const },
  { title: '委托单位', key: 'entrustment.clientName', align: 'center' as const },
  { title: '状态', key: 'status', align: 'center' as const },
  { title: '操作', key: 'actions', align: 'center' as const, sortable: false },
]);

const reports = ref<Report[]>([]);
const loading = ref(true);
const confirmDialog = ref(false);
const withdrawDialog = ref(false); // 新增撤回对话框状态
const selectedReportId = ref<number | null>(null);

onMounted(() => {
  fetchReports();
});

async function fetchReports() {
  try {
    loading.value = true;
    reports.value = await getCompileReports();
  } catch (error) {
    console.error('获取报告编制列表失败:', error);
  } finally {
    loading.value = false;
  }
}

function viewDetail(id: number) {
  // TODO: 实现查看详情功能
  console.log('查看报告详情:', id);
}

function confirmSubmit(id: number) {
  selectedReportId.value = id;
  confirmDialog.value = true;
}

async function doSubmitReport() {
  if (!selectedReportId.value) return;
  
  try {
    loading.value = true;
    await submitCompileReport(selectedReportId.value);
    alert('报告提交成功');
    fetchReports();
  } catch (error) {
    console.error('提交报告失败:', error);
    alert('提交报告失败');
  } finally {
    loading.value = false;
    confirmDialog.value = false;
  }
}

async function withdrawReport(id: number) {
  try {
    loading.value = true;
    await withdrawCompileReport(id);
    alert('报告撤回成功');
    fetchReports(); // 刷新列表
  } catch (error) {
    console.error('撤回报告失败:', error);
    alert('撤回报告失败');
  } finally {
    loading.value = false;
    withdrawDialog.value = false; // 关闭对话框
  }
}

function confirmWithdraw(id: number) {
  selectedReportId.value = id;
  withdrawDialog.value = true;
}
</script>