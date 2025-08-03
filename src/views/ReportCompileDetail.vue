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
      <v-card-title class="text-h5">报告编制详情 - {{ report.id }}</v-card-title>
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
              v-model="report.remarks"
              label="编制内容"
              outlined
              rows="6"
              :readonly="report.status !== '已分配' && report.status !== '已录入'"
            ></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions v-if="report.status === '已分配' || report.status === '已录入'">
        <v-btn
          @click="submitReport"
          color="primary"
          :loading="submitting"
        >
          提交报告
        </v-btn>
        <v-btn
          @click="withdrawReport"
          color="error"
          :loading="withdrawing"
          class="ml-4"
        >
          撤回报告
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getCompileReport, submitCompileReport, withdrawCompileReport } from '@/services/report.service';
import { useAppSnackbar } from '@/composables/useSnackbar';
import type { Report } from '@/types/report';

const route = useRoute();
const { show } = useAppSnackbar();

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
    
    report.value = await getCompileReport(id);
  } catch (err) {
    error.value = '获取报告详情失败: ' + (err instanceof Error ? err.message : '未知错误');
    console.error(err);
  } finally {
    loading.value = false;
  }
});

async function submitReport() {
  if (!report.value) return;
  
  try {
    submitting.value = true;
    await submitCompileReport(report.value.id);
    report.value.status = '已提交';
    show('报告提交成功', 'success');
  } catch (err) {
    show('报告提交失败: ' + (err instanceof Error ? err.message : '未知错误'), 'error');
    console.error(err);
  } finally {
    submitting.value = false;
  }
}

async function withdrawReport() {
  if (!report.value) return;
  
  try {
    withdrawing.value = true;
    await withdrawCompileReport(report.value.id);
    report.value.status = '已录入';
    show('报告撤回成功', 'success');
  } catch (err) {
    show('报告撤回失败: ' + (err instanceof Error ? err.message : '未知错误'), 'error');
    console.error(err);
  } finally {
    withdrawing.value = false;
  }
}
</script>