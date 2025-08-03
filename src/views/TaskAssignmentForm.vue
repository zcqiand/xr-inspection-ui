<template>
  <div class="task-assignment-form">
    <v-form ref="formRef" v-model="valid">
      <v-row>
        <!-- 委托选择 -->
        <v-col cols="12">
          <v-select
            v-model="assignmentForm.entrustmentId"
            :items="entrustmentOptions"
            item-title="name"
            item-value="id"
            label="委托"
            placeholder="请选择委托"
            clearable
            :rules="entrustmentRules"
          />
        </v-col>

        <!-- 分配人（当前用户） -->
        <v-col cols="12">
          <v-text-field
            :model-value="currentUser.name"
            label="分配人"
            disabled
          />
        </v-col>

        <!-- 接收人 -->
        <v-col cols="12">
          <v-select
            v-model="assignmentForm.assigneeIds"
            :items="userOptions"
            item-title="name"
            item-value="id"
            label="接收人"
            placeholder="请选择接收人"
            multiple
            clearable
            :rules="assigneeRules"
          />
        </v-col>

        <!-- 状态 -->
        <v-col cols="12">
          <v-select
            v-model="assignmentForm.status"
            :items="statusOptions"
            label="状态"
            placeholder="请选择状态"
            :rules="statusRules"
          />
        </v-col>

        <!-- 截止日期 -->
        <v-col cols="12">
          <v-text-field
            v-model="assignmentForm.dueDate"
            label="截止日期"
            placeholder="选择截止日期"
            type="datetime-local"
            :rules="dueDateRules"
          />
        </v-col>

        <!-- 备注 -->
        <v-col cols="12">
          <v-textarea
            v-model="assignmentForm.remarks"
            label="备注"
            :rows="3"
          />
        </v-col>

        <v-col cols="12" class="d-flex justify-end">
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
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { taskAssignmentService } from '@/services/task-assignment.service'
import { entrustmentService } from '@/services/entrustment.service'
import { userService } from '@/services/user.service'
import type {
  UnassignedReportSubmitRequest,
  TaskAssignmentUpdateRequest,
  TaskAssignmentDetail
} from '@/types/task-assignment'

const router = useRouter()
const route = useRoute()
const formRef = ref()
const valid = ref(false)
const submitting = ref(false)
const isEditMode = ref(false)
const currentId = ref<number | null>(null)

// 当前用户（模拟数据，实际应从store获取）
const currentUser = ref({
  id: 1,
  name: '管理员'
})

// 表单数据结构
interface TaskAssignmentFormData {
  entrustmentId: number | null
  assigneeIds: number[]
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
  dueDate: string
  remarks: string
}

// 表单数据
const assignmentForm = reactive<TaskAssignmentFormData>({
  entrustmentId: null,
  assigneeIds: [],
  status: 'PENDING',
  dueDate: '',
  remarks: ''
})

// 状态选项
const statusOptions = [
  { title: '待处理', value: 'PENDING' },
  { title: '进行中', value: 'IN_PROGRESS' },
  { title: '已完成', value: 'COMPLETED' }
]

// 委托选项
const entrustmentOptions = ref<{id: number, name: string}[]>([])

// 用户选项
const userOptions = ref<{id: number, name: string}[]>([])

// 表单验证规则
const entrustmentRules = [
  (v: any) => !!v || '请选择委托'
]

const assigneeRules = [
  (v: any) => (v && v.length > 0) || '请选择接收人'
]

const statusRules = [
  (v: any) => !!v || '请选择状态'
]

const dueDateRules = [
  (v: any) => !!v || '请选择截止日期'
]

// 加载委托和用户选项
const loadOptions = async () => {
  try {
    // 加载委托列表
    const entrustments = await entrustmentService.listEntrustments()
    entrustmentOptions.value = entrustments.map(e => ({ id: e.id, name: e.entrustUnit }))
    
    // 加载用户列表
    const users = await userService.listUsers()
    userOptions.value = users.map((u: any) => ({ id: u.id, name: u.name }))
  } catch (error) {
    console.error('加载选项失败', error)
  }
}

// 加载任务分配详情（编辑模式）
const loadAssignmentDetail = async (id: number) => {
  try {
    const detail = await taskAssignmentService.getTaskAssignmentDetail(id)
    // 填充表单数据
    Object.assign(assignmentForm, {
      entrustmentId: detail.entrustmentId,
      assigneeIds: [detail.assigneeId], // 注意：编辑模式是单个接收人
      status: detail.status,
      dueDate: detail.dueDate,
      remarks: detail.remarks
    })
  } catch (error) {
    console.error('加载任务分配详情失败', error)
  }
}

// 初始化
onMounted(async () => {
  await loadOptions()
  
  if (route.params.id) {
    isEditMode.value = true
    currentId.value = Number(route.params.id)
    await loadAssignmentDetail(currentId.value)
  }
})

// 提交表单
const handleSubmit = async () => {
  try {
    const valid = await formRef.value.validate()
    if (!valid.valid) return
    
    submitting.value = true
    
    if (isEditMode.value && currentId.value) {
      // 编辑模式
      const updateData: TaskAssignmentUpdateRequest = {
        assigneeId: assignmentForm.assigneeIds[0], // 取第一个接收人
        status: assignmentForm.status,
        dueDate: assignmentForm.dueDate,
        remarks: assignmentForm.remarks,
        sampleGroupIds: [] // 暂时空数组，后续可扩展
      }
      
      await taskAssignmentService.updateTaskAssignment(currentId.value, updateData)
    } else {
      // 新建模式
      const createData: UnassignedReportSubmitRequest = {
        entrustmentId: assignmentForm.entrustmentId as number,
        assigneeIds: assignmentForm.assigneeIds,
        dueDate: assignmentForm.dueDate,
        remarks: assignmentForm.remarks
      }
      
      await taskAssignmentService.submitUnassignedReport(createData)
    }
    
    router.push({ name: 'TaskAssignmentList' })
  } catch (error) {
    console.error('表单提交失败:', error)
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
  router.push({ name: 'TaskAssignmentList' })
}
</script>

<style scoped>
.task-assignment-form {
  padding: 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>