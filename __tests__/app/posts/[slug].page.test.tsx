import { render, screen } from '@testing-library/react'
import type { Metadata } from 'next'
import type { Post } from '@/types/microcms'

jest.mock('@/lib/microcms/queries', () => ({
  getPostBySlug: jest.fn(),
  getPosts: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}))

import { getPostBySlug, getPosts } from '@/lib/microcms/queries'
import { notFound } from 'next/navigation'

const createPost = (overrides: Partial<Post> = {}): Post => {
  return {
    id: 'post1',
    title: 'テスト記事',
    slug: 'test-slug',
    excerpt: '抜粋テキストです',
    content: '<p>本文</p>',
    category: {
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
    },
    eyecatch: {
      url: 'https://example.com/image.jpg',
      height: 600,
      width: 800,
    },
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

describe('/posts/[slug] page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('記事詳細ページが表示される', async () => {
    const post = createPost()
    ;(getPostBySlug as jest.Mock).mockResolvedValue(post)

    const { default: PostDetailPage } = await import('@/app/posts/[slug]/page')
    const ui = await PostDetailPage({
      params: Promise.resolve({ slug: 'test-slug' }),
    })

    render(ui)

    expect(screen.getByRole('heading', { name: 'テスト記事' })).toBeInTheDocument()
    expect(screen.getByText(/テック/)).toBeInTheDocument()
    expect(screen.queryByText(/抜粋テキストです/)).not.toBeInTheDocument()
    expect(screen.getByText(/本文/)).toBeInTheDocument()
  })

  test('記事が存在しない場合に notFound が呼ばれる', async () => {
    ;(getPostBySlug as jest.Mock).mockResolvedValue(null)
    ;(notFound as jest.Mock).mockImplementation(() => {
      throw new Error('NOT_FOUND')
    })

    const { default: PostDetailPage } = await import('@/app/posts/[slug]/page')

    await expect(
      PostDetailPage({
        params: Promise.resolve({ slug: 'missing-slug' }),
      })
    ).rejects.toThrow('NOT_FOUND')

    expect(notFound).toHaveBeenCalled()
  })

  test('generateMetadata: 記事が存在しない場合に 404 相当のメタデータを返す', async () => {
    ;(getPostBySlug as jest.Mock).mockResolvedValue(null)

    const { generateMetadata } = await import('@/app/posts/[slug]/page')

    const metadata: Metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'missing-slug' }),
    })

    expect(metadata.title).toBe('記事が見つかりません')
    expect(metadata.robots).toEqual({ index: false, follow: false })
  })

  test('generateMetadata: seoTitle / seoDescription / OGP / robots を組み立てる', async () => {
    const post = createPost({
      seoTitle: 'SEO タイトル',
      seoDescription: 'SEO 説明',
      noindex: true,
    })
    ;(getPostBySlug as jest.Mock).mockResolvedValue(post)

    const { generateMetadata } = await import('@/app/posts/[slug]/page')

    const metadata: Metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'test-slug' }),
    })

    expect(metadata.title).toBe('SEO タイトル')
    expect(metadata.description).toBe('SEO 説明')
    expect(metadata.openGraph?.title).toBe('SEO タイトル')
    expect(metadata.openGraph?.description).toBe('SEO 説明')
    expect(metadata.openGraph?.url).toBe('https://example.com/posts/test-slug')
    expect(metadata.robots).toEqual({ index: false, follow: false })
  })

  test('generateStaticParams: 全記事の slug を返す', async () => {
    ;(getPosts as jest.Mock).mockResolvedValue({
      contents: [
        { slug: 'post-1' },
        { slug: 'post-2' },
      ],
      totalCount: 2,
      offset: 0,
      limit: 100,
    })

    const { generateStaticParams } = await import('@/app/posts/[slug]/page')

    const params = await generateStaticParams()

    expect(params).toEqual([{ slug: 'post-1' }, { slug: 'post-2' }])
    expect(getPosts).toHaveBeenCalledWith({
      fields: 'slug',
      limit: 100,
    })
  })
})

