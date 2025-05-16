import { get } from '@/utils/request';
import type {
  VideoStats,
  ApiResponse
} from './video.type';

/**
 * 获取视频统计数据
 */
export const getVideoStats = (): Promise<ApiResponse<VideoStats[]>> => {
  return get<ApiResponse<VideoStats[]>>('/video-stats');
};