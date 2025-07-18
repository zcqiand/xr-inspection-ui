<template>
  <div class="role-management-content">
    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
      <div style="font-size: 20px; font-weight: bold">角色管理</div>
      <v-btn color="primary" @click="openCreateDialog">添加角色</v-btn>
    </div>
    
    <v-data-table :items="roles">
      <template v-slot:headers>
        <tr>
          <th>ID</th>
          <th>角色名称</th>
          <th>描述</th>
          <th>操作</th>
        </tr>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.description }}</td>
          <td>
            <div style="display: flex; gap: 8px">
              <v-btn size="small" @click="openEditDialog(item)">编辑</v-btn>
              <v-btn size="small" color="error" @click="deleteRole(item.id)">删除</v-btn>
              <v-btn size="small" color="primary" @click="managePermissions(item)">管理权限</v-btn>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>

    <!-- 角色表单对话框 -->
    <v-dialog v-model="showDialog" width="500">
      <v-card>
        <v-card-title>{{ isEditing ? '编辑角色' : '添加角色' }}</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="submitForm">
            <v-text-field
              label="角色名称"
              v-model="formData.name"
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

    <!-- 权限管理对话框 -->
    <v-dialog v-model="showPermissionDialog" width="600">
      <v-card>
        <v-card-title>管理权限</v-card-title>
        <v-card-text>
          <div v-if="currentRole">
            <h3>角色: {{ currentRole.name }}</h3>
            <v-checkbox-group v-model="selectedPermissionIds">
              <v-checkbox
                v-for="perm in allPermissions"
                :key="perm.id"
                :label="`${perm.code} - ${perm.description}`"
                :value="perm.id"
              />
            </v-checkbox-group>
            <div class="actions">
              <v-btn @click="showPermissionDialog = false">取消</v-btn>
              <v-btn color="primary" @click="savePermissions">保存</v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole as deleteRoleApi,
  addPermissionToRole,
  removePermissionFromRole
} from '@/services/role.service';
import { getPermissions } from '@/services/permission.service';
import type { RoleResponse } from '../types/role';
import type { PermissionResponse } from '../types/permission';

interface RoleRequest {
  name: string;
  description?: string;
  permissionIds?: number[];
}

export default defineComponent({
  name: 'RoleManagement',
  setup() {
    const roles = ref<RoleResponse[]>([]);
    const showDialog = ref(false);
    const isEditing = ref(false);
    const formData = ref<RoleRequest>({
      name: '',
      description: ''
    });
    const currentRoleId = ref<number | null>(null);
    const showPermissionDialog = ref(false);
    const allPermissions = ref<PermissionResponse[]>([]);
    const selectedPermissionIds = ref<number[]>([]);
    const currentRole = ref<RoleResponse | null>(null);

    const fetchRoles = async () => {
      try {
        roles.value = await getRoles();
      } catch (error) {
        console.error('获取角色数据失败:', error);
      }
    };

    onMounted(fetchRoles);

    const openCreateDialog = () => {
      formData.value = { name: '', description: '' };
      isEditing.value = false;
      showDialog.value = true;
    };

    const openEditDialog = (role: RoleResponse) => {
      formData.value = {
        name: role.name,
        description: role.description
      };
      currentRoleId.value = role.id;
      isEditing.value = true;
      showDialog.value = true;
    };

    const closeDialog = () => {
      showDialog.value = false;
    };

    const submitForm = async () => {
      try {
        if (isEditing.value && currentRoleId.value !== null) {
          await updateRole(currentRoleId.value, formData.value);
        } else {
          await createRole(formData.value);
        }
        fetchRoles();
        closeDialog();
      } catch (error) {
        console.error('保存角色失败:', error);
      }
    };

    const deleteRole = async (id: number) => {
      try {
        await deleteRoleApi(id);
        fetchRoles();
      } catch (error) {
        console.error('删除角色失败:', error);
      }
    };

    const managePermissions = async (role: RoleResponse) => {
      currentRole.value = role;
      try {
        // 获取所有权限
        allPermissions.value = await getPermissions();
        // 初始化选中的权限
        selectedPermissionIds.value = [...role.permissionIds];
        showPermissionDialog.value = true;
      } catch (error) {
        console.error('获取权限数据失败:', error);
      }
    };

    const savePermissions = async () => {
      if (!currentRole.value) return;
      
      const roleId = currentRole.value.id;
      const originalIds = currentRole.value.permissionIds;
      const newIds = selectedPermissionIds.value;
      
      try {
        // 添加新权限
        const permissionsToAdd = newIds.filter(id => !originalIds.includes(id));
        for (const permId of permissionsToAdd) {
          await addPermissionToRole(roleId, permId);
        }
        
        // 移除取消的权限
        const permissionsToRemove = originalIds.filter(id => !newIds.includes(id));
        for (const permId of permissionsToRemove) {
          await removePermissionFromRole(roleId, permId);
        }
        
        // 更新本地权限数据
        currentRole.value.permissionIds = newIds;
        showPermissionDialog.value = false;
      } catch (error) {
        console.error('保存权限失败:', error);
      }
    };

    return {
      roles,
      showDialog,
      isEditing,
      formData,
      openCreateDialog,
      openEditDialog,
      closeDialog,
      submitForm,
      deleteRole,
      managePermissions,
      showPermissionDialog,
      allPermissions,
      selectedPermissionIds,
      currentRole,
      savePermissions
    };
  }
});
</script>

<style scoped>
.role-management-content {
  padding: 20px;
}

.actions {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>