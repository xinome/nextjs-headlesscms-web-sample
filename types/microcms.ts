// microCMS API の型定義

// microCMSの共通フィールド
export type MicroCMSDate = {
  createdAt: string
  updatedAt: string
  publishedAt?: string
  revisedAt?: string
}

// 画像型
export type MicroCMSImage = {
  url: string
  width: number
  height: number
}

// リッチエディタ型
export type MicroCMSRichEditor = string

// Category型
export type Category = {
  id: string
  name: string
  slug: string
  description?: string
  order?: number
  isActive?: boolean
} & MicroCMSDate

// Post型
export type Post = {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: MicroCMSRichEditor
  eyecatch?: MicroCMSImage
  category: Category
  tags?: string[]
  status?: 'published' | 'draft'
  seoTitle?: string
  seoDescription?: string
  noindex?: boolean
} & MicroCMSDate

// microCMS API レスポンス型（リスト）
export type MicroCMSListResponse<T> = {
  contents: T[]
  totalCount: number
  offset: number
  limit: number
}

// microCMS API レスポンス型（単一）
export type MicroCMSContentResponse<T> = T

// API取得時のオプション
export type GetListOptions = {
  limit?: number
  offset?: number
  orders?: string
  q?: string
  fields?: string
  ids?: string
  filters?: string
  depth?: number
}

// slugで取得する際のオプション
export type GetContentOptions = {
  fields?: string
  depth?: number
}
