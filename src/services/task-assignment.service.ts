import { request } from '@/utils/request'
import type {
  TaskAssignmentUpdateRequest,
  TaskAssignmentDetail,
  TaskAssignmentItem,
  UnassignedReportSubmitRequest
} from '@/types/task-assignment'

export const taskAssignmentService = {
  /**
   * 更新任务分配
   * @param id 任务分配ID
   * @param data 更新数据
   */
  updateTaskAssignment(id: number, data: TaskAssignmentUpdateRequest) {
    return request.put(`/api/reports/assign/${id}`, data)
  },

  /**
   * 获取委托详细信息
   * @param id 委托ID
   */
  getTaskAssignmentDetail(id: number): Promise<TaskAssignmentDetail> {
    return request.get(`/api/reports/assign/${id}`)
  },

  /**
   * 获取任务分配列表
   */
  listTaskAssignments(): Promise<TaskAssignmentItem[]> {
    return request.get('/api/reports/assign')
  },

  /**
   * 提交待分配报告
   * @param data 提交数据
   */
  submitUnassignedReport(data: UnassignedReportSubmitRequest) {
    return request.post('/api/reports/assign', data)
  }
}