export interface UserRequest {
  username: string;
  password: string;
  enabled?: boolean;
  roleIds?: number[];
}

export interface UserResponse {
  id: number;
  username: string;
  enabled: boolean;
}