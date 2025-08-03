<template>
  <div class="task-assignment-detail">
    <div v-if="loading" class="loading-overlay">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    
    <div v-if="error" class="error-message">
      <v-alert type="error">{{ error }}</v-alert>
    </div>

    <div v-if="assignment">
      <!-- 委托基本信息 -->
      <v-card class="mb-6">
        <v-card-title>委托基本信息</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <div class="detail-item">
                <span class="label">委托ID：</span>
                <span class="value">{{ assignment.entrustmentId }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="detail-item">
                <span class="label">委托名称：</span>
                <span class="value">{{ assignment.entrustmentName }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="detail-item">
                <span class="label">创建时间：</span>
                <span class="value">{{ assignment.assignedDate }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- 任务分配详情 -->
      <v-card class="mb-6">
        <v-card-title>任务分配详情</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <div class="detail-item">
                <span class="label">分配人：</span>
                <span class="value">{{ assignment.assigneeName }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="detail-item">
                <span class="label">接收人：</span>
                <span class="value">{{ assignment.assigneeName }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="detail-item">
                <span class="label">分配人ID：</span>
                <span class="value">{{ assignment.assignerId }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="detail-item">
                <span class="label">分配时间：</span>
                <span class="value">{{ assignment.assignedDate }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="detail-item">
                <span class="label">完成状态：</span>
                {{ formatStatus(assignment.status) }}
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="detail-item">
                <span class="label">截止日期：</span>
                <span class="value">{{ assignment.dueDate }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" v-if="assignment.completedDate">
              <div class="detail-item">
                <span class="label">完成时间：</span>
                <span class="value">{{ assignment.completedDate }}</span>
              </div>
            </v-col>
            <v-col cols="12" v-if="assignment.remarks">
              <div class="detail-item">
                <span class="label">备注：</span>
                <span class="value">{{ assignment.remarks }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- 底部操作按钮 -->
      <div class="action-buttons">
        <v-btn color="primary" @click="goToList" class="mr-2">返回列表</v-btn>
        <v-btn color="secondary" @click="editAssignment" class="mr-2">编辑</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { taskAssignmentService } from '@/services/task-assignment.service';
import type { TaskAssignmentDetail } from '@/types/task-assignment';

export default defineComponent({
  name: 'TaskAssignmentDetail',
  setup() {
    const route = useRoute();
    const router = useRouter();
    
    const assignment = ref<TaskAssignmentDetail | null>(null);
    const loading = ref(true);
    const error = ref('');

    const id = ref(Number(route.params.id));
    
    const fetchAssignmentDetail = async () => {
      loading.value = true;
      error.value = '';
      try {
        assignment.value = await taskAssignmentService.getTaskAssignmentDetail(id.value);
      } catch (err) {
        error.value = '获取任务分配详情失败';
        console.error('获取任务分配详情失败:', err);
      } finally {
        loading.value = false;
      }
    };

    const getStatusColor = (status: string) => {
      switch(status) {
        case 'COMPLETED': return 'success';
        case 'IN_PROGRESS': return 'primary';
        case 'PENDING': return 'warning';
        default: return 'info';
      }
    };

    const formatStatus = (status: string) => {
      switch(status) {
        case 'COMPLETED': return '已完成';
        case 'IN_PROGRESS': return '进行中';
        case 'PENDING': return '待处理';
        default: return status;
      }
    };

    const goToList = () => {
      router.push({ name: 'TaskAssignmentList' });
    };

    const editAssignment = () => {
      router.push({ name: 'TaskAssignmentEdit', params: { id: id.value } });
    };

    onMounted(fetchAssignmentDetail);

    return {
      assignment,
      loading,
      error,
      getStatusColor,
      formatStatus,
      goToList,
      editAssignment
    };
  }
});
</script>

<style scoped>
.task-assignment-detail {
  padding: 20px;
  position: relative;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.detail-item {
  margin-bottom: 12px;
}

.label {
  font-weight: bold;
  margin-right: 8px;
}

.value {
  color: #555;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 12px;
}

.error-message {
  margin-bottom: 20px;
}
</style>