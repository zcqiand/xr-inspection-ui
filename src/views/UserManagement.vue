<template>
  <div class="user-management-content">
    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
      <div style="font-size: 20px; font-weight: bold">用户管理</div>
      <v-btn color="primary" @click="openCreateDialog">添加用户</v-btn>
    </div>
    
    <v-data-table :items="users">
      <template v-slot:headers>
        <tr>
          <th>ID</th>
          <th>用户名</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.id }}</td>
          <td>{{ item.username }}</td>
          <td>
            <v-switch
              v-model="item.enabled"
              @change="toggleStatus(item)"
              :true-value="true"
              :false-value="false"
              hide-details
            />
          </td>
          <td>
            <div style="display: flex; gap: 8px">
              <v-btn size="small" @click="openEditDialog(item)">编辑</v-btn>
              <v-btn size="small" color="error" @click="deleteUser(item.id)">删除</v-btn>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>

    <!-- 用户表单对话框 -->
    <v-dialog v-model="showDialog" width="500">
      <v-card>
        <v-card-title>{{ isEditing ? '编辑用户' : '添加用户' }}</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="submitForm">
            <v-text-field
              label="用户名"
              v-model="formData.username"
              required
            />
            <v-text-field
              label="密码"
              type="password"
              v-model="formData.password"
              :required="!isEditing"
            />
            <div style="display: flex; align-items: center; gap: 8px">
              <span>状态：</span>
              <v-switch
                v-model="formData.enabled"
                label="启用"
                hide-details
              />
            </div>
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
  getUsers,
  createUser,
  updateUser,
  deleteUser as deleteUserApi,
  updateUserStatus
} from '@/services/user.service';
import type { UserResponse, UserRequest } from '@/types/user';

export default defineComponent({
  name: 'UserManagement',
  setup() {
    const users = ref<UserResponse[]>([]);
    const showDialog = ref(false);
    const isEditing = ref(false);
    const formData = ref<UserRequest>({
      username: '',
      password: '',
      enabled: true
    });
    const currentUserId = ref<number | null>(null);

    const fetchUsers = async () => {
      try {
        users.value = await getUsers();
      } catch (error) {
        console.error('获取用户数据失败:', error);
      }
    };

    onMounted(fetchUsers);

    const openCreateDialog = () => {
      formData.value = { username: '', password: '', enabled: true };
      isEditing.value = false;
      showDialog.value = true;
    };

    const openEditDialog = (user: UserResponse) => {
      formData.value = {
        username: user.username,
        password: '',
        enabled: user.enabled
      };
      currentUserId.value = user.id;
      isEditing.value = true;
      showDialog.value = true;
    };

    const closeDialog = () => {
      showDialog.value = false;
    };

    const submitForm = async () => {
      try {
        if (isEditing.value && currentUserId.value !== null) {
          await updateUser(currentUserId.value, formData.value);
        } else {
          await createUser(formData.value);
        }
        fetchUsers();
        closeDialog();
      } catch (error) {
        console.error('保存用户失败:', error);
      }
    };

    const toggleStatus = async (user: UserResponse) => {
      try {
        await updateUserStatus(user.id, !user.enabled);
        fetchUsers();
      } catch (error) {
        console.error('更新用户状态失败:', error);
      }
    };

    const deleteUser = async (id: number) => {
      try {
        await deleteUserApi(id);
        fetchUsers();
      } catch (error) {
        console.error('删除用户失败:', error);
      }
    };

    return {
      users,
      showDialog,
      isEditing,
      formData,
      openCreateDialog,
      openEditDialog,
      closeDialog,
      submitForm,
      toggleStatus,
      deleteUser
    };
  }
});
</script>

<style scoped>
.user-management-content {
  padding: 20px;
  width: 100%;
}

.actions {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>