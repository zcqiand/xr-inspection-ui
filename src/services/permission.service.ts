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

export const getPermissions = () => request.get<PermissionResponse[]>('/api/system/permissions');
export const getPermission = (id: number) => request.get<PermissionResponse>(`/api/system/permissions/${id}`);
export const createPermission = (data: PermissionRequest) => request.post<PermissionResponse>('/api/system/permissions', data);
export const updatePermission = (id: number, data: PermissionRequest) => request.put<PermissionResponse>(`/api/system/permissions/${id}`, data);
export const deletePermission = (id: number) => request.delete(`/api/system/permissions/${id}`);