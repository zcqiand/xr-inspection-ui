import { request } from '@/utils/request'
import type {
  SampleGroupDTO,
  SampleGroupDetail
} from '@/types/sample-group'

export const sampleGroupService = {
  // 创建样品组
  createSampleGroup(data: SampleGroupDTO) {
    return request.post('/api/sample-groups', data)
  },

  // 更新样品组
  updateSampleGroup(id: number, data: SampleGroupDTO) {
    return request.put(`/api/sample-groups/${id}`, data)
  },

  // 删除样品组
  deleteSampleGroup(id: number) {
    return request.delete(`/api/sample-groups/${id}`)
  },

  // 根据ID获取样品组
  getSampleGroupById(id: number): Promise<SampleGroupDetail> {
    return request.get(`/api/sample-groups/${id}`)
  },

  // 获取所有样品组
  getAllSampleGroups(): Promise<SampleGroupDetail[]> {
    return request.get('/api/sample-groups')
  }
}