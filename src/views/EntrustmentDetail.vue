<template>
  <div class="entrustment-detail">
    <div v-if="loading" class="loading-overlay">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    
    <div v-if="error" class="error-message">
      <v-alert type="error">{{ error }}</v-alert>
    </div>

    <div v-if="entrustment">
      <!-- 顶部基本信息 -->
      <v-card class="mb-6">
        <v-card-title>委托基本信息</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <div class="detail-item">
                <span class="label">委托单位：</span>
                <span class="value">{{ entrustment.entrustUnit }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="detail-item">
                <span class="label">联系人：</span>
                <span class="value">{{ entrustment.contactPerson }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="detail-item">
                <span class="label">联系电话：</span>
                <span class="value">{{ entrustment.contactPhone }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" v-if="entrustment.contactEmail">
              <div class="detail-item">
                <span class="label">邮箱：</span>
                <span class="value">{{ entrustment.contactEmail }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="detail-item">
                <span class="label">委托日期：</span>
                <span class="value">{{ entrustment.entrustDate }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="detail-item">
                <span class="label">状态：</span>
                <v-chip :color="getStatusColor(entrustment.reportStatus)">
                  {{ entrustment.reportStatus }}
                </v-chip>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- 中部详细信息 -->
      <v-card class="mb-6">
        <v-card-title>检测信息</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <div class="detail-item">
                <span class="label">检测项目：</span>
                <span class="value">{{ entrustment.inspectionItems }}</span>
              </div>
            </v-col>
            <v-col cols="12" v-if="entrustment.sampleStatus">
              <div class="detail-item">
                <span class="label">样品状态：</span>
                <span class="value">{{ entrustment.sampleStatus }}</span>
              </div>
            </v-col>
            <v-col cols="12" v-if="entrustment.remarks">
              <div class="detail-item">
                <span class="label">备注：</span>
                <span class="value">{{ entrustment.remarks }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- 底部操作按钮 -->
      <div class="action-buttons">
        <v-btn color="primary" @click="goToList" class="mr-2">返回列表</v-btn>
        <v-btn color="secondary" @click="editEntrustment" class="mr-2">编辑</v-btn>
        <v-btn color="error" @click="deleteEntrustment" class="mr-2">删除</v-btn>
        <v-btn 
          color="success" 
          @click="submitEntrustment"
          :disabled="entrustment.reportStatus !== '待处理'"
        >
          提交委托
        </v-btn>
      </div>

      <!-- 样品组管理区域 -->
      <v-card class="mt-6">
        <v-card-title>样品组管理</v-card-title>
        <v-card-text>
          <v-data-table
            :headers="sampleGroupHeaders"
            :items="sampleGroups"
            :loading="sampleGroupsLoading"
            hide-default-footer
          >
            <template v-slot:item.actions="{ item }">
              <div style="display: flex; gap: 8px">
                <v-btn size="small" @click="viewSampleGroup(item)">查看</v-btn>
                <v-btn size="small" @click="editSampleGroup(item)">编辑</v-btn>
                <v-btn size="small" color="error" @click="deleteSampleGroup(item)">删除</v-btn>
              </div>
            </template>
          </v-data-table>
          <div class="mt-4">
            <v-btn color="primary" @click="addSampleGroup">添加样品组</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { entrustmentService } from '@/services/entrustment.service';
import { sampleGroupService } from '@/services/sample-group.service';
import type { EntrustmentDetail } from '@/types/entrustment';
import type { SampleGroupDetail } from '@/types/sample-group';

export default defineComponent({
  name: 'EntrustmentDetail',
  setup() {
    const route = useRoute();
    const router = useRouter();
    
    const entrustment = ref<EntrustmentDetail | null>(null);
    const loading = ref(true);
    const error = ref('');
    
    const sampleGroups = ref<SampleGroupDetail[]>([]);
    const sampleGroupsLoading = ref(false);
    
    const id = ref(Number(route.params.id));
    
    const sampleGroupHeaders = ref([
      { title: '样品组名称', key: 'name' },
      { title: '样品类型', key: 'sampleType' },
      { title: '数量', key: 'quantity' },
      { title: '操作', key: 'actions', sortable: false }
    ]);

    const fetchEntrustmentDetail = async () => {
      loading.value = true;
      error.value = '';
      try {
        entrustment.value = await entrustmentService.getEntrustmentDetail(id.value);
        await fetchSampleGroups();
      } catch (err) {
        error.value = '获取委托详情失败';
        console.error('获取委托详情失败:', err);
      } finally {
        loading.value = false;
      }
    };

    const fetchSampleGroups = async () => {
      sampleGroupsLoading.value = true;
      try {
        // 实际项目中这里应该根据委托ID获取关联的样品组
        // 当前先获取所有样品组作为演示
        sampleGroups.value = await sampleGroupService.getAllSampleGroups();
      } catch (err) {
        console.error('获取样品组失败:', err);
      } finally {
        sampleGroupsLoading.value = false;
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

    const goToList = () => {
      router.push({ name: 'EntrustmentList' });
    };

    const editEntrustment = () => {
      router.push({ name: 'EntrustmentEdit', params: { id: id.value } });
    };

    const deleteEntrustment = async () => {
      if (confirm('确定要删除此委托吗？')) {
        try {
          await entrustmentService.deleteEntrustment(id.value);
          goToList();
        } catch (err) {
          error.value = '删除委托失败';
          console.error('删除委托失败:', err);
        }
      }
    };

    const submitEntrustment = async () => {
      try {
        await entrustmentService.submitEntrustment(id.value);
        await fetchEntrustmentDetail();
      } catch (err) {
        error.value = '提交委托失败';
        console.error('提交委托失败:', err);
      }
    };

    const viewSampleGroup = (sampleGroup: SampleGroupDetail) => {
      // 实际项目中应跳转到样品组详情页
      alert(`查看样品组: ${sampleGroup.name}`);
    };

    const editSampleGroup = (sampleGroup: SampleGroupDetail) => {
      // 实际项目中应跳转到样品组编辑页
      alert(`编辑样品组: ${sampleGroup.name}`);
    };

    const deleteSampleGroup = (sampleGroup: SampleGroupDetail) => {
      if (confirm(`确定要删除样品组 "${sampleGroup.name}" 吗？`)) {
        sampleGroupService.deleteSampleGroup(sampleGroup.id)
          .then(() => fetchSampleGroups())
          .catch(err => console.error('删除样品组失败:', err));
      }
    };

    const addSampleGroup = () => {
      // 实际项目中应跳转到添加样品组页面
      alert('添加样品组');
    };

    onMounted(fetchEntrustmentDetail);

    return {
      entrustment,
      loading,
      error,
      sampleGroups,
      sampleGroupsLoading,
      sampleGroupHeaders,
      getStatusColor,
      goToList,
      editEntrustment,
      deleteEntrustment,
      submitEntrustment,
      viewSampleGroup,
      editSampleGroup,
      deleteSampleGroup,
      addSampleGroup
    };
  }
});
</script>

<style scoped>
.entrustment-detail {
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