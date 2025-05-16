import { get, del } from '@/utils/request';
import type {
  VideoLink,
  VideoStats,
  ApiResponse
} from './video.type';

/**
 * 获取视频统计数据
 */
export const getVideoStats = (): Promise<ApiResponse<VideoStats[]>> => {
  return get<ApiResponse<VideoStats[]>>('/video-stats');
};

/**
 * 获取所有视频配置
 */
export const getVideoLinks = (): Promise<ApiResponse<VideoLink[]>> => {
  return get<ApiResponse<VideoLink[]>>('/video-links/links');
};

/**
 * 删除视频配置
 * @param id 视频配置ID
 * @returns Promise<ApiResponse<void>>
 */
export const removeVideoLink = (id: string): Promise<ApiResponse<any>> => {
  return del<ApiResponse<any>>(`/video-links/${id}`);
};