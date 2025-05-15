// demoapi.types.ts - 包含所有类型定义

/**
 * 查询参数类型定义 - 物流查询记录
 */
export interface QueryRecordsParams {
  searchStartTime?: string; // 起始时间yyyyMMddHHmm格式
  searchEndTime?: string;   // 结束时间yyyyMMddHHmm格式
  queryParam?: string;      // 关键字（用户输入的原始数据）
  buyerName?: string;       // 买家姓名
  buyerMail?: string;       // 买家邮箱
  buyerPhone?: string;      // 买家电话
  orderCode?: string;       // 销售平台订单号
  orderStartTime?: string;  // 订单下单起始时间yyyyMMddHHmm格式
  orderEndTime?: string;    // 订单下单结束时间yyyyMMddHHmm格式
  shippingMethodNo?: string; // 物流追踪号
  sort?: string;            // 排序条件，如 "queryTime:desc,orderCode:asc"
  page?: number;            // 页码，从1开始
  pageSize?: number;        // 每页记录数
}

/**
 * 物流事件详情
 */
export interface TrackEvent {
  time: number;       // 事件时间 - 秒级时间戳
  status: string;     // 事件状态 - 枚举值
  description: string; // 事件描述
}

/**
 * 物流详细信息
 */
export interface TrackInfo {
  status: string;             // 物流当前状态 - 枚举值
  carrier?: string;           // 物流承运商, 如：DHL Paket
  carrierTel?: string;        // 承运商电话, 如：1-800-282-2468
  carrierPic: string;         // 承运商的logo
  carrierCountryCode?: string; // 承运商国家码, 如：CN、CA
  transitTime?: number;       // 运单时效(天)
  originCountry?: string;     // 始发国家/地区
  destinationCountry?: string; // 目的国家/地区
  events?: TrackEvent[];      // 物流事件详情
}

/**
 * 查询记录单项
 */
export interface QueryRecordItem {
  queryTime: string;         // 查询时间
  queryParam: string;        // 原始查询 - 用户输入的原始数据
  paramType: string;         // 查询类型 - all-全部、buyer_name-全名，buyer_mail-邮箱，order_code-订单号，shipping_method_no-跟踪号，phone-电话
  buyerName: string;         // 买家姓名
  buyerMail: string;         // 买家邮箱
  buyerPhone: string;        // 买家电话
  orderCode: string;         // 销售单号
  productPic: string;        // 商品图
  productTitle: string;      // 商品名称
  dateCreate: string;        // 下单时间
  shippingMethodNo: string;  // 物流追踪号
  status: string;            // 订单状态 - 0-待发货，1-已发货
  hasTracking: string;       // 是否有物流查询
  trackInfo: TrackInfo | null; // 物流详细 - 只有用户查询了才有这个字段
}

/**
 * 分页查询结果
 */
export interface QueryRecordsResult {
  total: number;              // 总记录数
  list: QueryRecordItem[];    // 具体数据列表
}

/**
 * API返回的标准响应格式
 */
export interface ApiResponse<T> {
  code: number;   // 响应码, 0-正常
  msg: string;    // 响应信息
  data: T;        // 响应数据
}

/**
 * 参数类型枚举
 */
export enum ParamType {
  ALL = 'all',                  // 全部
  BUYER_NAME = 'buyer_name',    // 全名
  BUYER_MAIL = 'buyer_mail',    // 邮箱
  ORDER_CODE = 'order_code',    // 订单号
  SHIPPING_METHOD_NO = 'shipping_method_no', // 跟踪号
  PHONE = 'phone'               // 电话
}

/**
 * 订单状态枚举
 */
export enum OrderStatus {
  WAITING_SHIPMENT = '0',       // 待发货
  SHIPPED = '1'                 // 已发货
}
