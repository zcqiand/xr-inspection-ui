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
      <v-card-title class="text-h5">报告批准详情 - {{ report.id }}</v-card-title>
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
              label="编制内容"
              outlined
              rows="6"
              readonly
            ></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          v-if="report.status === '已审核'"
          @click="handleSubmitApprove"
          color="primary"
          :loading="submitting"
        >
          批准
        </v-btn>
        <v-btn
          v-if="report.status === '已批准'"
          @click="handleWithdrawApprove"
          color="error"
          :loading="withdrawing"
          class="ml-4"
        >
          撤回批准
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
import { getReportEntry, submitApprove as apiSubmitApprove, withdrawApprove as apiWithdrawApprove } from '@/services/report.service';
import type { Report } from '@/types/report';

const router = useRouter();
const route = useRoute();

const report = ref<Report | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const submitting = ref(false);
const withdrawing = ref(false);

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

async function handleSubmitApprove() {
  if (!report.value) return;
  
  try {
    submitting.value = true;
    await apiSubmitApprove(report.value.id);
    report.value.status = '已批准';
    alert('报告批准成功');
  } catch (err) {
    alert('报告批准失败: ' + (err instanceof Error ? err.message : '未知错误'));
    console.error(err);
  } finally {
    submitting.value = false;
  }
}

async function handleWithdrawApprove() {
  if (!report.value) return;
  
  try {
    withdrawing.value = true;
    await apiWithdrawApprove(report.value.id);
    report.value.status = '已审核';
    alert('报告撤回批准成功');
  } catch (err) {
    alert('报告撤回批准失败: ' + (err instanceof Error ? err.message : '未知错误'));
    console.error(err);
  } finally {
    withdrawing.value = false;
  }
}

function goBack() {
  router.push({ name: 'ReportApproveList' });
}
</script>