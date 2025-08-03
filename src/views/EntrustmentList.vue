<template>
  <div class="entrustment-list">
    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
      <div style="font-size: 20px; font-weight: bold">委托登记列表</div>
      <v-btn color="primary" @click="goToCreate">新建委托</v-btn>
      <!-- 已添加创建按钮 -->
    </div>

    <v-data-table
      :headers="headers"
      :items="entrustments"
      :loading="loading"
      :items-per-page="pagination.pageSize"
      :page="pagination.currentPage"
      hide-default-footer
    >
      <template v-slot:item.reportStatus="{ item }">
        <v-chip :color="getStatusColor(item.reportStatus)">
          {{ item.reportStatus }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <div style="display: flex; gap: 8px">
          <v-btn size="small" @click="viewDetail(item)">查看</v-btn>
          <v-btn size="small" @click="editEntrustment(item)">编辑</v-btn>
          <v-btn size="small" color="error" @click="deleteItem(item)">删除</v-btn>
        </div>
      </template>
    </v-data-table>

    <div class="pagination-container">
      <v-pagination
        v-model="pagination.currentPage"
        :length="Math.ceil(entrustments.length / pagination.pageSize)"
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
import { entrustmentService } from '@/services/entrustment.service';
import type { EntrustmentDetail } from '@/types/entrustment';

export default defineComponent({
  name: 'EntrustmentList',
  setup() {
    const router = useRouter();
    const entrustments = ref<EntrustmentDetail[]>([]);
    
    // 跳转到创建页面
    const loading = ref(false);
    const error = ref(false);
    const errorMessage = ref('');
    
    const pagination = ref({
      currentPage: 1,
      pageSize: 10
    });

    const headers = ref([
      { title: '委托单位', key: 'entrustUnit' },
      { title: '联系人', key: 'contactPerson' },
      { title: '联系电话', key: 'contactPhone' },
      { title: '委托日期', key: 'entrustDate' },
      { title: '状态', key: 'reportStatus' },
      { title: '操作', key: 'actions', sortable: false }
    ]);

    const fetchEntrustments = async () => {
      loading.value = true;
      try {
        entrustments.value = await entrustmentService.listEntrustments();
      } catch (err) {
        error.value = true;
        errorMessage.value = '获取委托列表失败';
        console.error('获取委托列表失败:', err);
      } finally {
        loading.value = false;
      }
    };

    const getStatusColor = (status: string) => {
      switch(status) {
        case '已完成': return 'success';
        case '处理中': return 'primary';
        case '待处理': return 'warning';
        default: return 'info';
      }
    };

    const goToCreate = () => {
      router.push({ name: 'EntrustmentCreate' });
    };

    const viewDetail = (item: EntrustmentDetail) => {
      router.push({ name: 'EntrustmentDetail', params: { id: item.id } });
    };

    const editEntrustment = (item: EntrustmentDetail) => {
      router.push({ name: 'EntrustmentEdit', params: { id: item.id } });
    };

    const handleDelete = async (id: number) => {
      try {
        await entrustmentService.deleteEntrustment(id);
        fetchEntrustments();
      } catch (err) {
        error.value = true;
        errorMessage.value = '删除委托失败';
        console.error('删除委托失败:', err);
      }
    };

    const deleteItem = (item: EntrustmentDetail) => {
      if (confirm(`确定要删除 ${item.entrustUnit} 的委托吗？`)) {
        handleDelete(item.id);
      }
    };

    const handlePageChange = (page: number) => {
      pagination.value.currentPage = page;
    };

    onMounted(fetchEntrustments);

    return {
      entrustments,
      loading,
      error,
      errorMessage,
      pagination,
      headers,
      getStatusColor,
      goToCreate,
      viewDetail,
      editEntrustment,
      deleteItem,
      handlePageChange
    };
  }
});
</script>

<style scoped>
.entrustment-list {
  padding: 20px;
  width: 100%;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>