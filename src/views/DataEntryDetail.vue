<template>
  <div class="data-entry-detail">
    <h2 class="page-title">数据录入详情</h2>
    
    <div v-if="loading" class="loading-indicator">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    
    <div v-else-if="report" class="report-details">
      <v-card class="mb-4">
        <v-card-title>委托信息</v-card-title>
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
                label="检测项目"
                :value="report.entrustment.inspectionItems.join(', ')"
                readonly
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card class="mb-4">
        <v-card-title>报告信息</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="报告编号"
                :value="report.reportNumber"
                readonly
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="状态"
                :value="report.status"
                readonly
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                label="备注"
                :value="report.remarks"
                readonly
                outlined
                auto-grow
                rows="2"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <div class="action-buttons">
        <v-btn
          v-if="report.status === '已分配'"
          color="primary"
          @click="submitReport"
          :loading="submitting"
        >
          提交报告
        </v-btn>
        
        <v-btn
          v-else-if="report.status === '已录入'"
          color="warning"
          @click="withdrawReport"
          :loading="withdrawing"
        >
          撤回报告
        </v-btn>
      </div>
    </div>
    
    <div v-else class="no-data">
      <v-alert type="error">未找到报告信息</v-alert>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppSnackbar } from '@/composables/useSnackbar';
import { Report } from '@/types/report';
import { getReportEntry, submitReportEntry, withdrawReportEntry } from '@/services';

export default defineComponent({
  name: 'DataEntryDetail',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { show } = useAppSnackbar();
    
    const report = ref<Report | null>(null);
    const loading = ref(true);
    const submitting = ref(false);
    const withdrawing = ref(false);
    
    const reportId = Number(route.params.id);
    
    const fetchReportDetails = async () => {
      try {
        loading.value = true;
        report.value = await getReportEntry(reportId);
      } catch (error) {
        show('获取报告详情失败', 'error');
        console.error('获取报告详情失败:', error);
      } finally {
        loading.value = false;
      }
    };
    
    const submitReport = async () => {
      try {
        submitting.value = true;
        await submitReportEntry(reportId);
        show('报告提交成功', 'success');
        await fetchReportDetails();
      } catch (error) {
        show('报告提交失败', 'error');
        console.error('报告提交失败:', error);
      } finally {
        submitting.value = false;
      }
    };
    
    const withdrawReport = async () => {
      try {
        withdrawing.value = true;
        await withdrawReportEntry(reportId);
        show('报告撤回成功', 'success');
        await fetchReportDetails();
      } catch (error) {
        show('报告撤回失败', 'error');
        console.error('报告撤回失败:', error);
      } finally {
        withdrawing.value = false;
      }
    };
    
    onMounted(() => {
      if (isNaN(reportId)) {
        show('无效的报告ID', 'error');
        router.back();
        return;
      }
      fetchReportDetails();
    });
    
    return {
      report,
      loading,
      submitting,
      withdrawing,
      submitReport,
      withdrawReport
    };
  }
});
</script>

<style scoped>
.data-entry-detail {
  padding: 20px;
}

.page-title {
  margin-bottom: 24px;
  font-size: 1.5rem;
  font-weight: 500;
}

.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}
</style>