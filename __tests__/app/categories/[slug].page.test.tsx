import { render, screen } from '@testing-library/react'
import type { Metadata } from 'next'
import type { Category, Post } from '@/types/microcms'

jest.mock('@/lib/microcms/queries', () => ({
  getCategoryBySlug: jest.fn(),
  getCategories: jest.fn(),
  getPostsByCategoryId: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}))

import {
  getCategoryBySlug,
  getCategories,
  getPostsByCategoryId,
} from '@/lib/microcms/queries'
import { notFound } from 'next/navigation'

const createCategory = (overrides: Partial<Category> = {}): Category => {
  return {
    id: 'cat1',
    name: 'テック',
    slug: 'tech',
    description: 'テックカテゴリの説明',
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
    title: 'カテゴリ内の記事',
    slug: 'category-post',
    excerpt: 'カテゴリ内の記事の抜粋',
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

describe('/categories/[slug] page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('カテゴリページで記事一覧が表示される', async () => {
    const category = createCategory()
    const post = createPost({ category })

    ;(getCategoryBySlug as jest.Mock).mockResolvedValue(category)
    ;(getPostsByCategoryId as jest.Mock).mockResolvedValue({
      contents: [post],
      totalCount: 1,
      offset: 0,
      limit: 100,
    })

    const { default: CategoryPage } = await import('@/app/categories/[slug]/page')
    const ui = await CategoryPage({
      params: Promise.resolve({ slug: 'tech' }),
    })

    render(ui)

    expect(
      screen.getByRole('heading', { name: 'カテゴリ: テック' })
    ).toBeInTheDocument()
    expect(screen.getByText('カテゴリ内の記事')).toBeInTheDocument()
  })

  test('カテゴリに記事がない場合にメッセージを表示する', async () => {
    const category = createCategory()

    ;(getCategoryBySlug as jest.Mock).mockResolvedValue(category)
    ;(getPostsByCategoryId as jest.Mock).mockResolvedValue({
      contents: [],
      totalCount: 0,
      offset: 0,
      limit: 100,
    })

    const { default: CategoryPage } = await import('@/app/categories/[slug]/page')
    const ui = await CategoryPage({
      params: Promise.resolve({ slug: 'tech' }),
    })

    render(ui)

    expect(
      screen.getByText('このカテゴリにはまだ記事がありません。')
    ).toBeInTheDocument()
  })

  test('カテゴリが存在しない場合に notFound が呼ばれる', async () => {
    ;(getCategoryBySlug as jest.Mock).mockResolvedValue(null)
    ;(notFound as jest.Mock).mockImplementation(() => {
      throw new Error('NOT_FOUND')
    })

    const { default: CategoryPage } = await import('@/app/categories/[slug]/page')

    await expect(
      CategoryPage({
        params: Promise.resolve({ slug: 'missing-category' }),
      })
    ).rejects.toThrow('NOT_FOUND')

    expect(notFound).toHaveBeenCalled()
  })

  test('generateMetadata: カテゴリが存在しない場合に 404 相当のメタデータを返す', async () => {
    ;(getCategoryBySlug as jest.Mock).mockResolvedValue(null)

    const { generateMetadata } = await import('@/app/categories/[slug]/page')

    const metadata: Metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'missing-category' }),
    })

    expect(metadata.title).toBe('カテゴリが見つかりません')
    expect(metadata.description).toBe('お探しのカテゴリは見つかりませんでした。')
    expect(metadata.robots).toEqual({ index: false, follow: false })
  })

  test('generateMetadata: カテゴリの title / description / OGP を組み立てる', async () => {
    const category = createCategory()
    ;(getCategoryBySlug as jest.Mock).mockResolvedValue(category)

    const { generateMetadata } = await import('@/app/categories/[slug]/page')

    const metadata: Metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'tech' }),
    })

    expect(metadata.title).toBe('カテゴリ: テック')
    expect(metadata.description).toBe('テックカテゴリの説明')
    expect(metadata.openGraph?.title).toBe('カテゴリ: テック')
    expect(metadata.openGraph?.description).toBe('テックカテゴリの説明')
    expect(metadata.openGraph?.url).toBe('https://example.com/categories/tech')
  })

  test('generateStaticParams: 全カテゴリの slug を返す', async () => {
    ;(getCategories as jest.Mock).mockResolvedValue({
      contents: [{ slug: 'tech' }, { slug: 'news' }],
      totalCount: 2,
      offset: 0,
      limit: 100,
    })

    const { generateStaticParams } = await import('@/app/categories/[slug]/page')

    const params = await generateStaticParams()

    expect(params).toEqual([{ slug: 'tech' }, { slug: 'news' }])
    expect(getCategories).toHaveBeenCalledWith({
      fields: 'slug',
      limit: 100,
    })
  })
})

