import type { SampleGroupDTO } from '@/types/sample-group';

/**
 * 任务分配更新请求参数
 */
export interface TaskAssignmentUpdateRequest {
  assigneeId: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  dueDate: string;
  remarks?: string;
  sampleGroupIds: number[];
}

/**
 * 任务分配详细信息
 */
export interface TaskAssignmentDetail {
  id: number;
  entrustmentId: number;
  entrustmentName: string; // 新增委托名称字段
  assignerId: number; // 新增分配人ID
  assignerName: string; // 新增分配人姓名
  assigneeId: number;
  assigneeName: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  assignedDate: string;
  dueDate: string;
  completedDate?: string;
  remarks?: string;
  sampleGroups: SampleGroupDTO[];
}

/**
 * 任务分配列表项
 */
export interface TaskAssignmentItem {
  id: number;
  entrustmentId: number;
  assigneeName: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  assignedDate: string;
  dueDate: string;
}

/**
 * 待分配报告提交参数
 */
export interface UnassignedReportSubmitRequest {
  entrustmentId: number;
  assigneeIds: number[];
  dueDate: string;
  remarks?: string;
}