import type { SampleGroupDTO, SampleGroupDetail } from '@/types/sample-group'

export interface EntrustmentCreateRequest {
  entrustUnit: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  inspectionItems: string;
  sampleStatus?: string;
  remarks?: string;
  entrustDate: string;
  templateId?: number;
  sampleGroups: SampleGroupDTO[]; // 新增样品组
}

export interface EntrustmentUpdateRequest {
  entrustUnit: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  inspectionItems: string;
  sampleStatus?: string;
  remarks?: string;
  templateId?: number;
  sampleGroups: SampleGroupDTO[]; // 新增样品组
}

export interface EntrustmentDetail {
  id: number;
  createTime: string;
  entrustDate: string;
  entrustUnit: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  inspectionItems: string;
  sampleStatus?: string;
  remarks?: string;
  reportStatus: string;
  pdfPath?: string;
  content?: string;
  templateId?: number;
  sampleGroups: SampleGroupDetail[]; // 新增样品组详情
}