import { render, screen } from '@testing-library/react'
import type { Post } from '@/types/microcms'

jest.mock('@/lib/microcms/queries', () => ({
  getPosts: jest.fn(),
}))

import { getPosts } from '@/lib/microcms/queries'

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

describe('/posts page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('記事が1件以上ある場合に一覧が表示される', async () => {
    const post = createPost()

    ;(getPosts as jest.Mock).mockResolvedValue({
      contents: [post],
      totalCount: 1,
      offset: 0,
      limit: 20,
    })

    const { default: PostsPage } = await import('@/app/posts/page')
    const ui = await PostsPage()

    render(ui)

    expect(screen.getByRole('heading', { name: '記事一覧' })).toBeInTheDocument()
    expect(screen.getByText('テスト記事')).toBeInTheDocument()
  })

  test('記事が0件の場合にメッセージを表示する', async () => {
    ;(getPosts as jest.Mock).mockResolvedValue({
      contents: [],
      totalCount: 0,
      offset: 0,
      limit: 20,
    })

    const { default: PostsPage } = await import('@/app/posts/page')
    const ui = await PostsPage()

    render(ui)

    expect(screen.getByText('記事がありません。')).toBeInTheDocument()
  })

  test('エラー発生時にデバッグ情報付きのエラーメッセージを表示する', async () => {
    ;(getPosts as jest.Mock).mockRejectedValue(new Error('microCMS error'))

    const originalEnv = { ...process.env }
    process.env.MICROCMS_SERVICE_DOMAIN = 'service-id'
    process.env.MICROCMS_API_KEY = 'dummy-key'

    try {
      const { default: PostsPage } = await import('@/app/posts/page')
      const ui = await PostsPage()

      render(ui)

      expect(screen.getByText('エラーが発生しました')).toBeInTheDocument()
      expect(screen.getByText(/microCMS管理画面で「posts」APIが作成されているか/)).toBeInTheDocument()
      expect(screen.getByText('サービスID: service-id')).toBeInTheDocument()
      expect(screen.getByText('APIキー: 設定済み')).toBeInTheDocument()
    } finally {
      process.env = originalEnv
    }
  })
})

