import { request } from '@/utils/request';

interface PermissionRequest {
  code: string;
  description?: string;
}

interface PermissionResponse {
  id: number;
  code: string;
  description: string;
}

// 新增委托登记权限标识
export const ENTRUSTMENT_REGISTRATION = 'entrustment:registration';

export const getPermissions = () => request.get<PermissionResponse[]>('/api/sys/permission');
export const getPermission = (id: number) => request.get<PermissionResponse>(`/api/sys/permission/${id}`);
export const createPermission = (data: PermissionRequest) => request.post<PermissionResponse>('/api/sys/permission', data);
export const updatePermission = (id: number, data: PermissionRequest) => request.put<PermissionResponse>(`/api/sys/permission/${id}`, data);
export const deletePermission = (id: number) => request.delete(`/api/sys/permission/${id}`);