// microCMS クエリ関数

import type { Category, Post, ListResponse, Queries } from '@/types/microcms'
import { microcmsClient } from './client'

// SDK の Queries はプロパティが必須なので、部分的に受け取れるように Partial をかける
type ListQueries = Partial<
  Pick<
    Queries,
    'limit' | 'offset' | 'orders' | 'filters' | 'q' | 'ids' | 'fields' | 'depth'
  >
>

/**
 * カテゴリ一覧を取得
 */
export const getCategories = async (
  queries: ListQueries = {}
): Promise<ListResponse<Category>> => {
  const { orders, ...rest } = queries

  return microcmsClient.getList<Category>({
    endpoint: 'categories',
    queries: {
      orders: orders ?? 'order', // 表示順の昇順をデフォルトとする
      ...rest,
    },
  })
}

/**
 * 記事一覧を取得（limit, offset 等で拡張可能）
 */
export const getPosts = async (
  queries: ListQueries = {}
): Promise<ListResponse<Post>> => {
  const { orders, depth, ...rest } = queries

  return microcmsClient.getList<Post>({
    endpoint: 'posts',
    queries: {
      orders: orders ?? '-publishedAt', // 公開日の降順をデフォルト
      depth: depth ?? 2, // category を含めて取得
      ...rest,
    },
  })
}

/**
 * slug で記事を1件取得
 */
export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  const list = await microcmsClient.getList<Post>({
    endpoint: 'posts',
    queries: {
      limit: 1,
      filters: `slug[equals]${slug}`,
      depth: 2,
    },
  })

  return list.contents[0] ?? null
}

/**
 * slug でカテゴリを1件取得
 */
export const getCategoryBySlug = async (
  slug: string
): Promise<Category | null> => {
  const list = await microcmsClient.getList<Category>({
    endpoint: 'categories',
    queries: {
      limit: 1,
      filters: `slug[equals]${slug}`,
    },
  })

  return list.contents[0] ?? null
}

/**
 * カテゴリID別の記事一覧を取得
 * - microCMS の参照フィールドは ID でフィルタする
 */
export const getPostsByCategoryId = async (
  categoryId: string,
  queries: Omit<ListQueries, 'filters'> = {}
): Promise<ListResponse<Post>> => {
  const { orders, depth, ...rest } = queries

  return microcmsClient.getList<Post>({
    endpoint: 'posts',
    queries: {
      orders: orders ?? '-publishedAt',
      depth: depth ?? 2,
      filters: `category[equals]${categoryId}`,
      ...rest,
    },
  })
}
