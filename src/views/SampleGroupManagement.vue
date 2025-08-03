<template>
  <div class="sample-group-management">
    <div class="d-flex justify-space-between align-center mb-4">
      <h1 class="text-h4">样品组管理</h1>
      <v-btn color="primary" @click="editSampleGroup()">
        <v-icon start>mdi-plus</v-icon>
        添加样品组
      </v-btn>
    </div>

    <v-row>
      <!-- Left column: Sample Group List -->
      <v-col cols="8">
        <v-card class="mb-4">
          <v-card-title class="d-flex align-center">
            <span>样品组列表</span>
            <v-spacer></v-spacer>
            <v-select
              v-model="statusFilter"
              :items="statusOptions"
              label="状态筛选"
              dense
              outlined
              hide-details
              style="max-width: 200px;"
            ></v-select>
          </v-card-title>
          <v-data-table
            :headers="tableHeaders"
            :items="filteredSampleGroups"
            :loading="loading"
            item-key="id"
            @click:row="selectSampleGroup"
          >
            <template v-slot:item.storageCondition="{ item }">
              <v-chip :color="getConditionColor(item.storageCondition)" small>
                {{ item.storageCondition }}
              </v-chip>
            </template>
            <template v-slot:item.status="{ item }">
              <v-chip :color="getStatusColor(item.status)" small>
                {{ item.status }}
              </v-chip>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn icon @click.stop="editSampleGroup(item)">
                <v-icon small>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click.stop="deleteSampleGroup(item)" color="error">
                <v-icon small>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>

      <!-- Right column: Sample Group Details -->
      <v-col cols="4">
        <v-card v-if="selectedSampleGroup" class="sticky-top">
          <v-card-title>样品组详情</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-title>条码</v-list-item-title>
                <v-list-item-subtitle>{{ selectedSampleGroup.id }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>接收时间</v-list-item-title>
                <v-list-item-subtitle>{{ selectedSampleGroup.createTime }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>存储温度</v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip :color="getConditionColor(selectedSampleGroup.storageCondition)" small>
                    {{ selectedSampleGroup.storageCondition }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>当前温度</v-list-item-title>
                <v-list-item-subtitle>
                  {{ currentTemperature }}°C
                  <v-icon v-if="isTemperatureCritical" color="error">mdi-alert</v-icon>
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>状态</v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip :color="getStatusColor(selectedSampleGroup.status)" small>
                    {{ selectedSampleGroup.status }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>

            <v-divider class="my-4"></v-divider>
            
            <h3 class="text-h6 mb-2">温度监控</h3>
            <div class="temperature-history">
              <div v-for="(temp, index) in temperatureHistory" :key="index" class="temp-item">
                <span class="time">{{ formatTime(index) }}</span>
                <span class="value" :class="{ critical: isCriticalTemp(temp) }">{{ temp }}°C</span>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <v-card v-else>
          <v-card-text class="text-center text--disabled">
            请从左侧选择一个样品组查看详情
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="showEditDialog" max-width="600">
      <v-card>
        <v-card-title>{{ editingSampleGroup ? '编辑样品组' : '添加样品组' }}</v-card-title>
        <v-card-text>
          <!-- Sample Group Form Here -->
          <v-text-field v-model="formData.name" label="名称" required></v-text-field>
          <v-textarea v-model="formData.description" label="描述"></v-textarea>
          <v-select
            v-model="formData.sampleType"
            :items="sampleTypes"
            label="样品类型"
            required
          ></v-select>
          <v-text-field
            v-model="formData.quantity"
            label="数量"
            type="number"
            required
          ></v-text-field>
          <v-select
            v-model="formData.storageCondition"
            :items="storageConditions"
            label="存储条件"
            required
          ></v-select>
          <v-combobox
            v-model="formData.testItems"
            label="测试项目"
            multiple
            chips
            clearable
          ></v-combobox>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showEditDialog = false">取消</v-btn>
          <v-btn color="primary" @click="saveSampleGroup">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { sampleGroupService } from '@/services/sample-group.service';
import type { SampleGroupDetail, SampleGroupDTO } from '@/types/sample-group';

export default defineComponent({
  name: 'SampleGroupManagement',
  setup() {
    const sampleGroups = ref<SampleGroupDetail[]>([]);
    const selectedSampleGroup = ref<SampleGroupDetail | null>(null);
    const editingSampleGroup = ref<SampleGroupDetail | null>(null);
    const loading = ref(false);
    const showEditDialog = ref(false);
    const statusFilter = ref('all');
    const currentTemperature = ref(25);
    const temperatureHistory = ref<number[]>([]);
    const temperatureTimer = ref<number | null>(null);

    const formData = ref<SampleGroupDTO>({
      name: '',
      description: '',
      sampleType: '',
      quantity: 0,
      storageCondition: '',
      testItems: [],
    });

    const tableHeaders = ref([
      { text: '条码', value: 'id' },
      { text: '名称', value: 'name' },
      { text: '接收时间', value: 'createTime' },
      { text: '存储条件', value: 'storageCondition' },
      { text: '状态', value: 'status' },
      { text: '操作', value: 'actions', sortable: false },
    ]);

    const statusOptions = ref([
      { text: '全部', value: 'all' },
      { text: '正常', value: 'normal' },
      { text: '警告', value: 'warning' },
      { text: '紧急', value: 'critical' },
    ]);

    const sampleTypes = ref(['液体', '固体', '气体', '粉末']);
    const storageConditions = ref(['常温', '冷藏 (2-8°C)', '冷冻 (-20°C)', '超低温 (-80°C)']);

    const filteredSampleGroups = computed(() => {
      if (statusFilter.value === 'all') return sampleGroups.value;
      return sampleGroups.value.filter(g => g.status === statusFilter.value);
    });

    const isTemperatureCritical = computed(() => {
      if (!selectedSampleGroup.value) return false;
      const condition = selectedSampleGroup.value.storageCondition;
      
      if (condition.includes('冷藏') && currentTemperature.value > 8) return true;
      if (condition.includes('冷冻') && currentTemperature.value > -15) return true;
      if (condition.includes('超低温') && currentTemperature.value > -70) return true;
      
      return false;
    });

    const fetchSampleGroups = async () => {
      loading.value = true;
      try {
        const groups = await sampleGroupService.getAllSampleGroups();
        // Add simulated status for each group
        sampleGroups.value = groups.map(group => ({
          ...group,
          status: (['normal', 'warning', 'critical'] as const)[Math.floor(Math.random() * 3)]
        }));
      } catch (error) {
        console.error('获取样品组失败:', error);
      } finally {
        loading.value = false;
      }
    };

    const selectSampleGroup = (group: SampleGroupDetail) => {
      selectedSampleGroup.value = group;
      // Reset and start temperature monitoring
      temperatureHistory.value = [];
      startTemperatureMonitoring();
    };

    const startTemperatureMonitoring = () => {
      if (temperatureTimer.value) {
        clearInterval(temperatureTimer.value);
      }
      
      // Simulate temperature changes
      temperatureTimer.value = setInterval(() => {
        const change = (Math.random() - 0.5) * 2;
        currentTemperature.value = parseFloat((currentTemperature.value + change).toFixed(1));
        temperatureHistory.value.unshift(currentTemperature.value);
        
        // Keep only last 10 readings
        if (temperatureHistory.value.length > 10) {
          temperatureHistory.value.pop();
        }
      }, 1000) as unknown as number;
    };

    const formatTime = (index: number) => {
      const secondsAgo = index * 5;
      return `${secondsAgo}秒前`;
    };

    const isCriticalTemp = (temp: number) => {
      if (!selectedSampleGroup.value) return false;
      const condition = selectedSampleGroup.value.storageCondition;
      
      if (condition.includes('冷藏') && temp > 8) return true;
      if (condition.includes('冷冻') && temp > -15) return true;
      if (condition.includes('超低温') && temp > -70) return true;
      
      return false;
    };

    const editSampleGroup = (group?: SampleGroupDetail) => {
      if (group) {
        editingSampleGroup.value = group;
        formData.value = { ...group };
      } else {
        editingSampleGroup.value = null;
        formData.value = {
          name: '',
          description: '',
          sampleType: '',
          quantity: 0,
          storageCondition: '',
          testItems: [],
        };
      }
      showEditDialog.value = true;
    };

    const saveSampleGroup = async () => {
      if (!formData.value.name || !formData.value.sampleType) {
        console.error('缺少必填字段');
        return;
      }

      try {
        if (editingSampleGroup.value) {
          await sampleGroupService.updateSampleGroup(editingSampleGroup.value.id, formData.value);
        } else {
          await sampleGroupService.createSampleGroup(formData.value);
        }
        fetchSampleGroups();
        showEditDialog.value = false;
      } catch (error) {
        console.error('保存样品组失败:', error);
      }
    };

    const deleteSampleGroup = async (group: SampleGroupDetail) => {
      if (!confirm(`确定要删除样品组 "${group.name}" 吗？`)) return;
      
      try {
        await sampleGroupService.deleteSampleGroup(group.id);
        fetchSampleGroups();
        if (selectedSampleGroup.value?.id === group.id) {
          selectedSampleGroup.value = null;
        }
      } catch (error) {
        console.error('删除样品组失败:', error);
      }
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'normal': return 'success';
        case 'warning': return 'warning';
        case 'critical': return 'error';
        default: return 'info';
      }
    };

    const getConditionColor = (condition: string) => {
      if (condition.includes('超低温')) return 'indigo';
      if (condition.includes('冷冻')) return 'blue';
      if (condition.includes('冷藏')) return 'teal';
      return 'green';
    };

    onMounted(() => {
      fetchSampleGroups();
    });

    onBeforeUnmount(() => {
      if (temperatureTimer.value) {
        clearInterval(temperatureTimer.value);
      }
    });

    return {
      sampleGroups,
      selectedSampleGroup,
      editingSampleGroup,
      loading,
      showEditDialog,
      statusFilter,
      currentTemperature,
      temperatureHistory,
      tableHeaders,
      statusOptions,
      sampleTypes,
      storageConditions,
      formData,
      filteredSampleGroups,
      isTemperatureCritical,
      selectSampleGroup,
      editSampleGroup,
      saveSampleGroup,
      deleteSampleGroup,
      getStatusColor,
      getConditionColor,
      formatTime,
      isCriticalTemp
    };
  },
});
</script>

<style scoped>
.sticky-top {
  position: sticky;
  top: 20px;
}

.temperature-history {
  height: 200px;
  overflow-y: auto;
  border: 1px solid #eee;
  padding: 10px;
  border-radius: 4px;
}

.temp-item {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  border-bottom: 1px solid #f5f5f5;
}

.temp-item .time {
  color: #666;
}

.temp-item .value {
  font-weight: bold;
}

.temp-item .value.critical {
  color: #ff5252;
}
</style>