import type { Category, Post } from '@/types/microcms'

jest.mock('@/lib/microcms/client', () => ({
  microcmsClient: {
    getList: jest.fn(),
  },
}))

import { microcmsClient } from '@/lib/microcms/client'
import {
  getCategories,
  getPosts,
  getPostBySlug,
  getCategoryBySlug,
  getPostsByCategoryId,
} from '@/lib/microcms/queries'

const createCategory = (overrides: Partial<Category> = {}): Category => {
  return {
    id: 'cat1',
    name: 'テック',
    slug: 'tech',
    description: 'テックカテゴリ',
    order: 1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    publishedAt: '2024-01-01T00:00:00.000Z',
    revisedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  }
}

const createPost = (overrides: Partial<Post> = {}): Post => {
  const category = createCategory()

  return {
    id: 'post1',
    title: 'テスト記事',
    slug: 'test-slug',
    excerpt: '抜粋テキストです',
    content: '<p>本文</p>',
    category,
    eyecatch: null,
    tags: [],
    status: 'published',
    seoTitle: 'SEO タイトル',
    seoDescription: 'SEO 説明',
    noindex: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
    publishedAt: '2024-01-03T00:00:00.000Z',
    revisedAt: '2024-01-04T00:00:00.000Z',
    ...overrides,
  }
}

describe('lib/microcms/queries', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('getCategories: デフォルトで order 昇順でカテゴリ一覧を取得する', async () => {
    const categories = [createCategory(), createCategory({ id: 'cat2', slug: 'news', name: 'ニュース' })]

    ;(microcmsClient.getList as jest.Mock).mockResolvedValue({
      contents: categories,
      totalCount: 2,
      offset: 0,
      limit: 10,
    })

    const result = await getCategories()

    expect(microcmsClient.getList).toHaveBeenCalledWith({
      endpoint: 'categories',
      queries: expect.objectContaining({
        orders: 'order',
      }),
    })
    expect(result.contents).toEqual(categories)
  })

  test('getPosts: デフォルトで公開日降順・depth=2 で記事一覧を取得する', async () => {
    const posts = [createPost(), createPost({ id: 'post2', slug: 'another' })]

    ;(microcmsClient.getList as jest.Mock).mockResolvedValue({
      contents: posts,
      totalCount: 2,
      offset: 0,
      limit: 20,
    })

    const result = await getPosts()

    expect(microcmsClient.getList).toHaveBeenCalledWith({
      endpoint: 'posts',
      queries: expect.objectContaining({
        orders: '-publishedAt',
        depth: 2,
      }),
    })
    expect(result.contents).toEqual(posts)
  })

  test('getPosts: クエリ引数をそのまま microCMS に渡す', async () => {
    ;(microcmsClient.getList as jest.Mock).mockResolvedValue({
      contents: [],
      totalCount: 0,
      offset: 0,
      limit: 5,
    })

    await getPosts({ limit: 5, offset: 10, q: '検索', fields: 'title,slug' })

    expect(microcmsClient.getList).toHaveBeenCalledWith({
      endpoint: 'posts',
      queries: expect.objectContaining({
        limit: 5,
        offset: 10,
        q: '検索',
        fields: 'title,slug',
      }),
    })
  })

  test('getPostBySlug: slug で1件取得するための filters / limit / depth を設定する', async () => {
    const post = createPost()

    ;(microcmsClient.getList as jest.Mock).mockResolvedValue({
      contents: [post],
      totalCount: 1,
      offset: 0,
      limit: 1,
    })

    const result = await getPostBySlug('test-slug')

    expect(microcmsClient.getList).toHaveBeenCalledWith({
      endpoint: 'posts',
      queries: {
        limit: 1,
        filters: 'slug[equals]test-slug',
        depth: 2,
      },
    })
    expect(result).toEqual(post)
  })

  test('getPostBySlug: 記事が存在しない場合は null を返す', async () => {
    ;(microcmsClient.getList as jest.Mock).mockResolvedValue({
      contents: [],
      totalCount: 0,
      offset: 0,
      limit: 1,
    })

    const result = await getPostBySlug('missing-slug')

    expect(result).toBeNull()
  })

  test('getCategoryBySlug: slug で1件取得するための filters / limit を設定する', async () => {
    const category = createCategory()

    ;(microcmsClient.getList as jest.Mock).mockResolvedValue({
      contents: [category],
      totalCount: 1,
      offset: 0,
      limit: 1,
    })

    const result = await getCategoryBySlug('tech')

    expect(microcmsClient.getList).toHaveBeenCalledWith({
      endpoint: 'categories',
      queries: {
        limit: 1,
        filters: 'slug[equals]tech',
      },
    })
    expect(result).toEqual(category)
  })

  test('getCategoryBySlug: カテゴリが存在しない場合は null を返す', async () => {
    ;(microcmsClient.getList as jest.Mock).mockResolvedValue({
      contents: [],
      totalCount: 0,
      offset: 0,
      limit: 1,
    })

    const result = await getCategoryBySlug('missing-category')

    expect(result).toBeNull()
  })

  test('getPostsByCategoryId: category[equals]ID でフィルタして記事一覧を取得する', async () => {
    const post = createPost()

    ;(microcmsClient.getList as jest.Mock).mockResolvedValue({
      contents: [post],
      totalCount: 1,
      offset: 0,
      limit: 10,
    })

    const result = await getPostsByCategoryId('cat1', { limit: 10 })

    expect(microcmsClient.getList).toHaveBeenCalledWith({
      endpoint: 'posts',
      queries: expect.objectContaining({
        filters: 'category[equals]cat1',
        limit: 10,
        orders: '-publishedAt',
        depth: 2,
      }),
    })
    expect(result.contents).toEqual([post])
  })
})

