export interface Report {
  id: number;
  entrustmentId: number;
  entrustment: {
    id: number;
    clientName: string;
    contactPerson: string;
    contactPhone: string;
    inspectionItems: string[];
  };
  reportNumber: string;
  type: string;
  status: '已分配' | '已录入' | '已提交' | '已审核' | '已批准' | '已发放' | '已归档';
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportEntry {
  id: number;
  reportNumber: string;
  clientName: string;
  contactPerson: string;
  status: '已分配' | '已录入' | '已提交' | '已审核' | '已批准' | '已归档';
  createdAt: string;
}