<template>
  <div class="task-assignment-list">
    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
      <div style="font-size: 20px; font-weight: bold">任务分配列表</div>
      <v-btn color="primary" @click="goToCreate">新建任务分配</v-btn>
    </div>

    <v-data-table
      :headers="headers"
      :items="assignments"
      :loading="loading"
      :items-per-page="pagination.pageSize"
      :page="pagination.currentPage"
      hide-default-footer
    >
      <template v-slot:item.status="{ item }">
        <v-chip :color="getStatusColor(item.status)">
          {{ formatStatus(item.status) }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <div style="display: flex; gap: 8px">
          <v-btn size="small" @click="viewDetail(item)">查看详情</v-btn>
        </div>
      </template>
    </v-data-table>

    <div class="pagination-container">
      <v-pagination
        v-model="pagination.currentPage"
        :length="Math.ceil(assignments.length / pagination.pageSize)"
        @input="handlePageChange"
      />
    </div>

    <v-snackbar v-model="error" color="error">
      {{ errorMessage }}
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { taskAssignmentService } from '@/services/task-assignment.service';
import type { TaskAssignmentItem } from '@/types/task-assignment';

export default defineComponent({
  name: 'TaskAssignmentList',
  setup() {
    const router = useRouter();
    const assignments = ref<TaskAssignmentItem[]>([]);
    const loading = ref(false);
    const error = ref(false);
    const errorMessage = ref('');
    
    const pagination = ref({
      currentPage: 1,
      pageSize: 10
    });

    const headers = ref([
      { title: '任务ID', key: 'id' },
      { title: '委托ID', key: 'entrustmentId' },
      { title: '分配状态', key: 'status' },
      { title: '创建时间', key: 'assignedDate' },
      { title: '截止日期', key: 'dueDate' },
      { title: '操作', key: 'actions', sortable: false }
    ]);

    const fetchAssignments = async () => {
      loading.value = true;
      try {
        assignments.value = await taskAssignmentService.listTaskAssignments();
      } catch (err) {
        error.value = true;
        errorMessage.value = '获取任务分配列表失败';
        console.error('获取任务分配列表失败:', err);
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
      const statusMap: Record<string, string> = {
        'PENDING': '待处理',
        'IN_PROGRESS': '进行中',
        'COMPLETED': '已完成'
      };
      return statusMap[status] || status;
    };

    const goToCreate = () => {
      // 临时跳转到委托创建页面
      router.push({ name: 'EntrustmentCreate' });
    };

    const viewDetail = (item: TaskAssignmentItem) => {
      router.push({ name: 'TaskAssignmentDetail', params: { id: item.id } });
    };

    const handlePageChange = (page: number) => {
      pagination.value.currentPage = page;
    };

    onMounted(fetchAssignments);

    return {
      assignments,
      loading,
      error,
      errorMessage,
      pagination,
      headers,
      getStatusColor,
      formatStatus,
      goToCreate,
      viewDetail,
      handlePageChange
    };
  }
});
</script>

<style scoped>
.task-assignment-list {
  padding: 20px;
  width: 100%;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>