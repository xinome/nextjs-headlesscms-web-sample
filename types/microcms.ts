// microCMS API の型定義

import type {
  MicroCMSContentId,
  MicroCMSDate,
  MicroCMSImage as SDKImage,
  MicroCMSListResponse,
  MicroCMSQueries,
} from 'microcms-js-sdk'

// 画像型（SDKの型をそのまま使用）
export type MicroCMSImage = SDKImage

// Category型
export type Category = {
  name: string
  slug: string
  description?: string
  order?: number
  isActive?: boolean
} & MicroCMSContentId &
  MicroCMSDate

// Post型
export type Post = {
  title: string
  slug: string
  excerpt?: string
  content: string // リッチエディタのHTML文字列
  eyecatch?: MicroCMSImage
  category: Category
  tags?: string[]
  status?: 'published' | 'draft'
  seoTitle?: string
  seoDescription?: string
  noindex?: boolean
} & MicroCMSContentId &
  MicroCMSDate

// 共通レスポンス・クエリ型（SDKの型をエクスポート）
export type ListResponse<T> = MicroCMSListResponse<T>
export type Queries = MicroCMSQueries
