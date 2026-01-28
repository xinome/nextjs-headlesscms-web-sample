// microCMS API クライアント

import type {
  Category,
  Post,
  MicroCMSListResponse,
  MicroCMSContentResponse,
  GetListOptions,
  GetContentOptions,
} from '@/types/microcms'

const MICROCMS_API_KEY = process.env.MICROCMS_API_KEY
const MICROCMS_SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN

if (!MICROCMS_API_KEY) {
  throw new Error('MICROCMS_API_KEY is not set')
}

if (!MICROCMS_SERVICE_DOMAIN) {
  throw new Error('MICROCMS_SERVICE_DOMAIN is not set')
}

const API_BASE_URL = `https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1`

// 共通のfetch関数
const fetchFromMicroCMS = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`
  const response = await fetch(url, {
    ...options,
    headers: {
      'X-MICROCMS-API-KEY': MICROCMS_API_KEY,
      ...options.headers,
    },
    next: {
      revalidate: 60, // ISR: 60秒
    },
  })

  if (!response.ok) {
    throw new Error(`microCMS API Error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// クエリパラメータを構築
const buildQueryString = (params: Record<string, string | number | undefined>): string => {
  const queryParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value))
    }
  })

  const queryString = queryParams.toString()
  return queryString ? `?${queryString}` : ''
}

// Categories API

/**
 * カテゴリ一覧を取得
 */
export const getCategories = async (
  options: GetListOptions = {}
): Promise<MicroCMSListResponse<Category>> => {
  const queryString = buildQueryString({
    limit: options.limit,
    offset: options.offset,
    orders: options.orders,
    q: options.q,
    fields: options.fields,
    ids: options.ids,
    filters: options.filters,
    depth: options.depth,
  })

  return fetchFromMicroCMS<MicroCMSListResponse<Category>>(
    `/categories${queryString}`
  )
}

/**
 * カテゴリをslugで取得
 */
export const getCategoryBySlug = async (
  slug: string,
  options: GetContentOptions = {}
): Promise<Category | null> => {
  const queryString = buildQueryString({
    fields: options.fields,
    depth: options.depth,
    filters: `slug[equals]${slug}`,
  })

  const response = await fetchFromMicroCMS<MicroCMSListResponse<Category>>(
    `/categories${queryString}`
  )

  return response.contents[0] || null
}

// Posts API

/**
 * 記事一覧を取得
 */
export const getPosts = async (
  options: GetListOptions = {}
): Promise<MicroCMSListResponse<Post>> => {
  const queryString = buildQueryString({
    limit: options.limit,
    offset: options.offset,
    orders: options.orders || '-publishedAt', // デフォルト: 公開日の降順
    q: options.q,
    fields: options.fields,
    ids: options.ids,
    filters: options.filters,
    depth: options.depth || 2, // カテゴリ参照を含める
  })

  return fetchFromMicroCMS<MicroCMSListResponse<Post>>(
    `/posts${queryString}`
  )
}

/**
 * 記事をslugで取得
 */
export const getPostBySlug = async (
  slug: string,
  options: GetContentOptions = {}
): Promise<Post | null> => {
  const queryString = buildQueryString({
    fields: options.fields,
    depth: options.depth || 2, // カテゴリ参照を含める
    filters: `slug[equals]${slug}`,
  })

  const response = await fetchFromMicroCMS<MicroCMSListResponse<Post>>(
    `/posts${queryString}`
  )

  return response.contents[0] || null
}

/**
 * カテゴリ別記事一覧を取得
 */
export const getPostsByCategory = async (
  categorySlug: string,
  options: Omit<GetListOptions, 'filters'> = {}
): Promise<MicroCMSListResponse<Post>> => {
  const queryString = buildQueryString({
    limit: options.limit,
    offset: options.offset,
    orders: options.orders || '-publishedAt',
    q: options.q,
    fields: options.fields,
    ids: options.ids,
    filters: `category.slug[equals]${categorySlug}`,
    depth: options.depth || 2,
  })

  return fetchFromMicroCMS<MicroCMSListResponse<Post>>(
    `/posts${queryString}`
  )
}

/**
 * 公開済み記事のみ取得（statusがpublishedまたは未設定）
 */
export const getPublishedPosts = async (
  options: GetListOptions = {}
): Promise<MicroCMSListResponse<Post>> => {
  const filters = options.filters
    ? `${options.filters}[and]status[equals]published`
    : 'status[equals]published'

  return getPosts({
    ...options,
    filters,
  })
}
