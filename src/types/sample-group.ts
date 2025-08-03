export interface SampleGroupDTO {
  name: string;
  description?: string;
  sampleType: string;
  quantity: number;
  storageCondition: string;
  testItems: string[];
}

export interface SampleGroupDetail {
  id: number;
  createTime: string;
  updateTime: string;
  name: string;
  description?: string;
  sampleType: string;
  quantity: number;
  storageCondition: string;
  testItems: string[];
  status: 'normal' | 'warning' | 'critical'; // Added status property
}