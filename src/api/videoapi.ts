import { get, del, put, post } from '@/utils/request';
import type {
  VideoLink,
  VideoStats,
  ApiResponse,
  Dictionary,
  VideoAnalysis
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
  return del<ApiResponse<any>>(`/video-links?id=${id}`);
};

/**
 * 修改视频配置
 * @param id 视频配置ID
 * @returns Promise<ApiResponse<void>>
 */
export const updateVideoLink = (videoLink : VideoLink): Promise<ApiResponse<any>> => {
  return put<ApiResponse<any>>(`/video-links?`, videoLink);
};

// ...existing code...

/**
 * 新增视频配置
 * @param videoLink 视频配置信息
 * @returns Promise<ApiResponse<any>>
 */
export const insertVideoLink = (videoLink: VideoLink): Promise<ApiResponse<any>> => {
  return post<ApiResponse<any>>('/video-links/add', videoLink);
};

/**
 * 获取所有字典选项
 */
export const getDictionary = (): Promise<ApiResponse<Dictionary[]>> => {
  return get<ApiResponse<Dictionary[]>>('/dictionary');
};

/**
 * 获取视频数据趋势分析
 */
export const getVideoStatistics = (videoLinkId: string, statisticalGranularity: string, product: string,
  publisher: string, kol: string, platform: string, language: string,
  region: string, startTime: string, endTime: string): Promise<ApiResponse<VideoAnalysis[]>> => {

  return get<ApiResponse<VideoAnalysis[]>>('/video-analysis?videoLinkId=' + videoLinkId +
    '&statisticalGranularity=' + statisticalGranularity +
    '&product=' + product +
    '&publisher=' + publisher +
    '&kol=' + kol +
    '&platform=' + platform +
    '&language=' + language +
    '&region=' + region +
    '&startTime=' + startTime +
    '&endTime=' + endTime);
};