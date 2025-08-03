import { request } from '@/utils/request';
import type { Report } from '@/types/report';

/**
 * 获取报告详情
 * @param id 报告ID
 * @returns 报告详情
 */
export function getReportEntry(id: number): Promise<Report> {
  return request.get(`/api/reports/entry/${id}`);
}

/**
 * 提交报告
 * @param id 报告ID
 */
export function submitReportEntry(id: number): Promise<void> {
  return request.put(`/api/reports/entry/${id}/submit`);
}

/**
 * 撤回报告
 * @param id 报告ID
 */
export function withdrawReportEntry(id: number): Promise<void> {
  return request.put(`/api/reports/entry/${id}/withdraw`);
}

/**
 * 获取报告编制列表
 * @returns 报告编制列表
 */
export function getCompileReports(): Promise<Report[]> {
  return request.get('/api/reports/compile');
}

/**
 * 获取报告编制详情
 * @param id 报告ID
 * @returns 报告编制详情
 */
export function getCompileReport(id: number): Promise<Report> {
  return request.get(`/api/reports/compile/${id}`);
}

/**
 * 提交报告编制
 * @param id 报告ID
 */
export function submitCompileReport(id: number): Promise<void> {
  return request.put(`/api/reports/compile/${id}/submit`);
}

/**
 * 撤回报告编制
 * @param id 报告ID
 */
export function withdrawCompileReport(id: number): Promise<void> {
  return request.put(`/api/reports/compile/${id}/withdraw`);
}

/**
 * 获取待审核报告列表
 * @returns 待审核报告列表
 */
export function getReviewReports(): Promise<Report[]> {
  return request.get('/api/reports/review');
}

/**
 * 获取待批准报告列表
 * @returns 待批准报告列表
 */
export function getApproveList(): Promise<Report[]> {
  return request.get('/api/reports/approve');
}

/**
 * 提交报告批准
 * @param reportId 报告ID
 */
export function submitApprove(reportId: number): Promise<void> {
  return request.put(`/api/reports/approve/${reportId}/submit`);
}

/**
 * 撤回报告批准
 * @param reportId 报告ID
 */
export function withdrawApprove(reportId: number): Promise<void> {
  return request.put(`/api/reports/approve/${reportId}/withdraw`);
}
/**
 * 提交报告发放
 * @param reportId 报告ID
 */
export function submitIssue(reportId: number): Promise<void> {
  return request.put(`/api/reports/issue/${reportId}/submit`);
}

/**
 * 撤回报告发放
 * @param reportId 报告ID
 */
export function withdrawIssue(reportId: number): Promise<void> {
  return request.put(`/api/reports/issue/${reportId}/withdraw`);
}
/**
 * 获取待发放报告列表
 * @returns 待发放报告列表
 */
export function getIssueReports(): Promise<Report[]> {
  return request.get('/api/reports/issue');
}
/**
 * 提交报告归档
 * @param reportId 报告ID
 */
export function submitArchive(reportId: number): Promise<void> {
  return request.put(`/api/reports/archive/${reportId}/submit`);
}

/**
 * 撤回报档归档
 * @param reportId 报告ID
 */
export function withdrawArchive(reportId: number): Promise<void> {
  return request.put(`/api/reports/archive/${reportId}/withdraw`);
}