export interface VideoStats {
  id: string
  title: string
  product: string
  viewCount: number
  commentCount: number
  likeCount: number
  engagementRate: string
  publisher: string
  channelTitle: string
  nameOfKOL: string
  platform: string
  language: string
  region: string
  publishedAt: string
  captureDate: string
  videoUrl: string
}

export interface ApiResponse<T> {
  code: number;   // 响应码, 0-正常
  msg: string;    // 响应信息
  data: T;        // 响应数据
}