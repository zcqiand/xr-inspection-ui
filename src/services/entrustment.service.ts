import { request } from '@/utils/request'
import type {
  EntrustmentCreateRequest,
  EntrustmentUpdateRequest,
  EntrustmentDetail
} from '@/types/entrustment'

export const entrustmentService = {
  // 创建委托登记
  createEntrustment(data: EntrustmentCreateRequest) {
    return request.post('/api/reports/entrust', data)
  },

  // 更新委托登记
  updateEntrustment(id: number, data: EntrustmentUpdateRequest) {
    return request.put(`/api/reports/entrust/${id}`, data)
  },

  // 删除委托登记
  deleteEntrustment(id: number) {
    return request.delete(`/api/reports/entrust/${id}`)
  },

  // 获取委托详情
  getEntrustmentDetail(id: number): Promise<EntrustmentDetail> {
    return request.get(`/api/reports/entrust/${id}`)
  },

  // 获取委托列表
  listEntrustments(): Promise<EntrustmentDetail[]> {
    return request.get('/api/reports/entrust')
  },

  // 提交委托
  submitEntrustment(id: number) {
    return request.put(`/api/reports/entrust/${id}/submit`)
  }
}