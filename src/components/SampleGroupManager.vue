<template>
  <div class="sample-group-manager">
    <div v-for="(group, index) in modelValue" :key="index" class="group-item">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="样品组名称">
            <el-input v-model="group.name" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="样品类型">
            <el-input v-model="group.sampleType" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="数量">
            <el-input-number v-model="group.quantity" :min="1" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="存储条件">
            <el-input v-model="group.storageCondition" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检测项目">
            <el-select 
              v-model="group.testItems" 
              multiple 
              filterable 
              allow-create
              placeholder="请输入检测项目"
            >
              <el-option
                v-for="(item, idx) in group.testItems"
                :key="idx"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="描述">
        <el-input v-model="group.description" type="textarea" :rows="2" />
      </el-form-item>

      <el-button 
        type="danger" 
        icon="el-icon-delete" 
        circle 
        @click="emit('remove', index)"
      />
      <el-divider />
    </div>

    <el-button type="primary" @click="emit('add')">添加样品组</el-button>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'
import type { SampleGroupDTO } from '@/types/sample-group'

defineProps<{
  modelValue: SampleGroupDTO[]
}>()

const emit = defineEmits<{
  (e: 'add'): void
  (e: 'remove', index: number): void
}>()
</script>

<style scoped>
.sample-group-manager {
  margin-top: 20px;
}
.group-item {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}
</style>