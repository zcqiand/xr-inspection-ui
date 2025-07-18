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

export const getUsers = () => request.get<UserResponse[]>('/api/system/users');
export const getUser = (id: number) => request.get<UserResponse>(`/api/system/users/${id}`);
export const createUser = (data: UserRequest) => request.post<UserResponse>('/api/system/users', data);
export const updateUser = (id: number, data: UserRequest) => request.put<UserResponse>(`/api/system/users/${id}`, data);
export const deleteUser = (id: number) => request.delete(`/api/system/users/${id}`);
export const updateUserStatus = (id: number, enabled: boolean) => 
  request.patch(`/api/system/users/${id}/status`, { enabled });