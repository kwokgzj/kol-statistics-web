// demoapi.ts - 包含API请求方法的实现
import { get } from '@/utils/request';
import type {
  QueryRecordsParams,
  QueryRecordsResult,
  ApiResponse
} from './demoapi.types';

/**
 * 获取用户查询日志
 * @param params 查询参数
 * @returns 物流查询记录的分页列表
 */
export const getQueryRecords = (params: QueryRecordsParams): Promise<ApiResponse<QueryRecordsResult>> => {
  return get<ApiResponse<QueryRecordsResult>>('/track-admin/records', params);
};
