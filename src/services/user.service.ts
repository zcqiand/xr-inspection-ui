import { request } from '@/utils/request';

interface UserRequest {
  username: string;
  password: string;
  enabled?: boolean;
  roleIds?: number[];
}

interface UserResponse {
  id: number;
  username: string;
  enabled: boolean;
}

export const getUsers = () => request.get<UserResponse[]>('/api/sys/user');
export const getUser = (id: number) => request.get<UserResponse>(`/api/sys/user/${id}`);
export const createUser = (data: UserRequest) => request.post<UserResponse>('/api/sys/user', data);
export const updateUser = (id: number, data: UserRequest) => request.put<UserResponse>(`/api/sys/user/${id}`, data);
export const deleteUser = (id: number) => request.delete(`/api/sys/user/${id}`);
export const updateUserStatus = (id: number, enabled: boolean) =>
  request.patch(`/api/sys/user/${id}/status`, { enabled });

// 创建userService对象
export const userService = {
  getUsers,
  listUsers: getUsers,  // 添加listUsers别名
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus
};