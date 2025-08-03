<template>
  <v-container v-if="loading" class="d-flex justify-center align-center" style="height: 300px;">
    <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
  </v-container>
  
  <v-container v-else-if="error" class="d-flex justify-center align-center" style="height: 300px;">
    <v-alert type="error" prominent>
      {{ error }}
    </v-alert>
  </v-container>

  <v-container v-else-if="report">
    <v-card>
      <v-card-title class="text-h5">报告归档详情 - {{ report.id }}</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              label="委托单位"
              :value="report.entrustment.clientName"
              readonly
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="联系人"
              :value="report.entrustment.contactPerson"
              readonly
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="联系电话"
              :value="report.entrustment.contactPhone"
              readonly
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="报告类型"
              :value="report.type"
              readonly
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="报告状态"
              :value="report.status"
              readonly
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="检测项目"
              :value="report.entrustment.inspectionItems.join(', ')"
              readonly
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-textarea
              :value="report.remarks"
              label="备注"
              outlined
              rows="6"
              readonly
            ></v-textarea>
          </v-col>
          
          <!-- 状态变更历史区域 -->
          <v-col cols="12">
            <v-subheader>状态变更历史</v-subheader>
            <v-data-table
              :headers="historyHeaders"
              :items="statusHistory"
              hide-default-footer
              class="elevation-1"
            >
              <template v-slot:item.timestamp="{ item }">
                {{ formatDateTime(item.timestamp) }}
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          v-if="report.status === '已发放'"
          @click="submitArchive"
          color="primary"
          :loading="submitting"
        >
          提交归档
        </v-btn>
        <v-btn
          v-if="report.status === '已归档'"
          @click="withdrawArchive"
          color="error"
          :loading="withdrawing"
          class="ml-4"
        >
          撤回归档
        </v-btn>
        <v-btn
          @click="goBack"
          color="secondary"
          class="ml-4"
        >
          返回列表
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getReportEntry } from '@/services/report.service';
import type { Report } from '@/types/report';

const router = useRouter();
const route = useRoute();

const report = ref<Report | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const submitting = ref(false);
const withdrawing = ref(false);

// 状态变更历史数据（示例）
const statusHistory = ref([
  { status: '已录入', timestamp: '2025-07-01T10:30:00Z', operator: '张三' },
  { status: '已提交', timestamp: '2025-07-02T14:15:00Z', operator: '李四' },
  { status: '已审核', timestamp: '2025-07-03T09:45:00Z', operator: '王五' },
  { status: '已批准', timestamp: '2025-07-04T16:20:00Z', operator: '赵六' },
  { status: '已发放', timestamp: '2025-07-05T11:10:00Z', operator: '钱七' },
]);

const historyHeaders = [
  { title: '状态', key: 'status' },
  { title: '变更时间', key: 'timestamp' },
  { title: '操作人', key: 'operator' },
];

onMounted(async () => {
  try {
    const id = Number(route.params.id);
    if (isNaN(id)) {
      throw new Error('无效的报告ID');
    }
    
    report.value = await getReportEntry(id);
  } catch (err) {
    error.value = '获取报告详情失败: ' + (err instanceof Error ? err.message : '未知错误');
    console.error(err);
  } finally {
    loading.value = false;
  }
});

async function submitArchive() {
  submitting.value = true;
  // TODO: 实现提交归档逻辑
  console.log('提交归档操作');
  submitting.value = false;
}

async function withdrawArchive() {
  withdrawing.value = true;
  // TODO: 实现撤回归档逻辑
  console.log('撤回归档操作');
  withdrawing.value = false;
}

function formatDateTime(dateTime: string) {
  return new Date(dateTime).toLocaleString('zh-CN');
}

function goBack() {
  router.push({ name: 'ReportArchiveList' });
}
</script>