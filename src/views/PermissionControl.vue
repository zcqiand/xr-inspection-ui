<template>
  <div class="permission-management-content">
    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
      <div style="font-size: 20px; font-weight: bold">权限管理</div>
      <v-btn color="primary" @click="openCreateDialog">添加权限</v-btn>
    </div>
    
    <v-data-table :items="permissions">
      <template v-slot:headers>
        <tr>
          <th>ID</th>
          <th>权限代码</th>
          <th>描述</th>
          <th>操作</th>
        </tr>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.id }}</td>
          <td>{{ item.code }}</td>
          <td>{{ item.description }}</td>
          <td>
            <div style="display: flex; gap: 8px">
              <v-btn size="small" @click="openEditDialog(item)">编辑</v-btn>
              <v-btn size="small" color="error" @click="deletePermission(item.id)">删除</v-btn>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>

    <!-- 权限表单对话框 -->
    <v-dialog v-model="showDialog" width="500">
      <v-card>
        <v-card-title>{{ isEditing ? '编辑权限' : '添加权限' }}</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="submitForm">
            <v-text-field
              label="权限代码"
              v-model="formData.code"
              required
            />
            <v-textarea
              label="描述"
              v-model="formData.description"
              rows="4"
            />
            <div class="actions">
              <v-btn @click="closeDialog">取消</v-btn>
              <v-btn color="primary" @click="submitForm">保存</v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import {
  getPermissions,
  createPermission,
  updatePermission,
  deletePermission as deletePermissionApi
} from '@/services/permission.service';
import type { PermissionResponse } from '../types/permission';

interface PermissionRequest {
  code: string;
  description?: string;
}

export default defineComponent({
  name: 'PermissionControl',
  setup() {
    const permissions = ref<PermissionResponse[]>([]);
    const showDialog = ref(false);
    const isEditing = ref(false);
    const formData = ref<PermissionRequest>({
      code: '',
      description: ''
    });
    const currentPermissionId = ref<number | null>(null);

    const fetchPermissions = async () => {
      try {
        permissions.value = await getPermissions();
      } catch (error) {
        console.error('获取权限数据失败:', error);
      }
    };

    onMounted(fetchPermissions);

    const openCreateDialog = () => {
      formData.value = { code: '', description: '' };
      isEditing.value = false;
      showDialog.value = true;
    };

    const openEditDialog = (permission: PermissionResponse) => {
      formData.value = {
        code: permission.code,
        description: permission.description
      };
      currentPermissionId.value = permission.id;
      isEditing.value = true;
      showDialog.value = true;
    };

    const closeDialog = () => {
      showDialog.value = false;
    };

    const submitForm = async () => {
      try {
        if (isEditing.value && currentPermissionId.value !== null) {
          await updatePermission(currentPermissionId.value, formData.value);
        } else {
          await createPermission(formData.value);
        }
        fetchPermissions();
        closeDialog();
      } catch (error) {
        console.error('保存权限失败:', error);
      }
    };

    const deletePermission = async (id: number) => {
      try {
        await deletePermissionApi(id);
        fetchPermissions();
      } catch (error) {
        console.error('删除权限失败:', error);
      }
    };

    return {
      permissions,
      showDialog,
      isEditing,
      formData,
      openCreateDialog,
      openEditDialog,
      closeDialog,
      submitForm,
      deletePermission
    };
  }
});
</script>

<style scoped>
.permission-management-content {
  padding: 20px;
}

.actions {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>