export interface VideoStats {
  _id: string                   // 视频统计ID
  title: string               // 视频标题
  product: string             // 产品名称
  viewCount: number           // 观看数量
  commentCount: number        // 评论数量
  likeCount: number          // 点赞数量
  engagementRate: string      // 互动率
  publisher: string           // 发布者
  channelTitle: string        // 频道标题
  nameOfKOL: string          // KOL名称
  platform: string            // 平台名称
  language: string            // 语言
  region: string             // 地区
  publishedAt: string        // 发布时间
  captureDate: string        // 数据抓取时间
  videoUrl: string           // 视频链接
}

export interface VideoLink {
  videoLinkId: string;                  // ObjectId转为string类型
  videoUrl: string;            // 视频链接
  platformVideoId: string;     // 视频平台ID
  nameOfKOL: string;          // kol名称
  platform: string;            // 视频平台
  product: string;            // 产品
  language: string;           // 语言
  region: string;             // 地区
  createdAt: string;          // 记录创建时间，后端Date类型转为string
  isActive: boolean;          // 是否抓取
}

export interface Dictionary{
  value: string; // 字典值
  label: string; // 字典标签
  dictionaryType: string; // 字典类型
}

export interface ApiResponse<T> {
  code: number;   // 响应码, 0-正常
  msg: string;    // 响应信息
  data: T;        // 响应数据
}
