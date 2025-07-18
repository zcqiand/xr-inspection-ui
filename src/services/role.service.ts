import { request } from '@/utils/request';

interface RoleRequest {
  name: string;
  description?: string;
  permissionIds?: number[];
}

interface RoleResponse {
  id: number;
  name: string;
  description: string;
  permissionIds: number[];
}

export const getRoles = () => request.get<RoleResponse[]>('/api/system/roles');
export const getRole = (id: number) => request.get<RoleResponse>(`/api/system/roles/${id}`);
export const createRole = (data: RoleRequest) => request.post<RoleResponse>('/api/system/roles', data);
export const updateRole = (id: number, data: RoleRequest) => request.put<RoleResponse>(`/api/system/roles/${id}`, data);

// 角色权限关联操作
export const addPermissionToRole = (roleId: number, permissionId: number) => 
  request.post(`/api/system/roles/${roleId}/permissions/${permissionId}`);

export const removePermissionFromRole = (roleId: number, permissionId: number) =>
  request.delete(`/api/system/roles/${roleId}/permissions/${permissionId}`);

export const deleteRole = (id: number) => request.delete(`/api/system/roles/${id}`);