<template>
  <div class="entrustment-form">
    <v-form ref="formRef">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="entrustmentForm.entrustUnit"
            label="委托单位"
            :rules="entrustUnitRules"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="entrustmentForm.contactPerson"
            label="联系人"
            :rules="contactPersonRules"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="entrustmentForm.contactPhone"
            label="联系电话"
            :rules="contactPhoneRules"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="entrustmentForm.contactEmail"
            label="联系邮箱"
          />
        </v-col>
      </v-row>

      <v-textarea
        v-model="entrustmentForm.inspectionItems"
        label="检测项目"
        :rules="inspectionItemsRules"
        :rows="3"
      />

      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="entrustmentForm.sampleStatus"
            label="样品状态"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="entrustmentForm.templateId"
            :items="templateOptions"
            item-title="label"
            item-value="value"
            label="模板"
            placeholder="请选择模板"
          />
        </v-col>
      </v-row>

      <v-textarea
        v-model="entrustmentForm.remarks"
        label="备注"
        :rows="2"
      />

      <v-divider class="my-4">样品组管理</v-divider>
      <sample-group-manager
        v-model="entrustmentForm.sampleGroups"
        @add="addSampleGroup"
        @remove="removeSampleGroup"
      />

      <div class="d-flex justify-end mt-4">
        <v-btn
          color="primary"
          @click="handleSubmit"
          :loading="submitting"
          class="mr-2"
        >
          提交
        </v-btn>
        <v-btn @click="resetForm" class="mr-2">重置</v-btn>
        <v-btn @click="goBack">取消</v-btn>
      </div>
    </v-form>

    <v-snackbar v-model="snackbar.visible" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  EntrustmentCreateRequest,
  EntrustmentUpdateRequest
} from '@/types/entrustment'
import { entrustmentService } from '@/services/entrustment.service'
import SampleGroupManager from '@/components/SampleGroupManager.vue'

const snackbar = reactive({
  visible: false,
  message: '',
  color: 'success'
})

const router = useRouter()
const route = useRoute()
const formRef = ref()
const submitting = ref(false)
const isEditMode = ref(false)
const currentId = ref<number | null>(null)

// 表单数据
const entrustmentForm = reactive<EntrustmentCreateRequest | EntrustmentUpdateRequest>({
  entrustUnit: '',
  contactPerson: '',
  contactPhone: '',
  contactEmail: '',
  inspectionItems: '',
  sampleStatus: '',
  remarks: '',
  templateId: undefined,
  sampleGroups: [] // 样品组
})

// 表单验证规则
const entrustUnitRules = [
  (v: any) => !!v || '请输入委托单位'
]

const contactPersonRules = [
  (v: any) => !!v || '请输入联系人'
]

const contactPhoneRules = [
  (v: any) => !!v || '请输入联系电话'
]

const inspectionItemsRules = [
  (v: any) => !!v || '请输入检测项目'
]

// 模板选项（示例）
const templateOptions = ref([
  { value: 1, label: '标准模板' },
  { value: 2, label: '快速模板' }
])

// 初始化加载数据
onMounted(async () => {
  if (route.params.id) {
    isEditMode.value = true
    currentId.value = Number(route.params.id)
    try {
      const data = await entrustmentService.getEntrustmentDetail(currentId.value)
      Object.assign(entrustmentForm, data)
    } catch (error) {
      console.error('加载委托信息失败', error)
    }
  }
})

// 添加样品组
const addSampleGroup = () => {
  entrustmentForm.sampleGroups.push({
    name: '',
    description: '',
    sampleType: '',
    quantity: 1,
    storageCondition: '',
    testItems: []
  })
}

// 移除样品组
const removeSampleGroup = (index: number) => {
  entrustmentForm.sampleGroups.splice(index, 1)
}

// 提交表单
const handleSubmit = async () => {
  const valid = await formRef.value.validate()
  if (!valid.valid) return
  
  try {
    submitting.value = true
    
    if (isEditMode.value && currentId.value) {
      await entrustmentService.updateEntrustment(currentId.value, entrustmentForm as EntrustmentUpdateRequest)
      snackbar.message = '委托信息更新成功'
      snackbar.color = 'success'
      snackbar.visible = true
    } else {
      await entrustmentService.createEntrustment(entrustmentForm as EntrustmentCreateRequest)
      snackbar.message = '委托创建成功'
      snackbar.color = 'success'
      snackbar.visible = true
    }
    
    router.push({ name: 'EntrustmentList' })
  } catch (error) {
    console.error('表单提交失败:', error)
    snackbar.message = '表单提交失败，请检查输入'
    snackbar.color = 'error'
    snackbar.visible = true
  } finally {
    submitting.value = false
  }
}

// 重置表单
const resetForm = () => {
  formRef.value.reset()
}

// 返回列表
const goBack = () => {
  router.push({ name: 'EntrustmentList' })
}
</script>

<style scoped>
.entrustment-form {
  padding: 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>