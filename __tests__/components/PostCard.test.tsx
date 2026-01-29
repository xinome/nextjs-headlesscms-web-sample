import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PostCard from '@/components/PostCard'
import type { Post } from '@/types/microcms'

function createPost(overrides: Partial<Post> = {}): Post {
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
    },
    eyecatch: null,
    publishedAt: '2024-01-15T00:00:00.000Z',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-20T00:00:00.000Z',
    ...overrides,
  }
}

describe('PostCard', () => {
  test('PC-001: publishedAt が表示される', () => {
    const post = createPost({ publishedAt: '2024-01-15T00:00:00.000Z' })

    render(<PostCard post={post} />)

    // フォーマットは toLocaleDateString('ja-JP', ...) に依存するため、
    // 完全一致ではなく一部一致でチェックしてもよい
    expect(screen.getByText(/2024\/01\/15/)).toBeInTheDocument()
  })

  test('PC-002: publishedAt がない場合 createdAt が使われる', () => {
    const post = createPost({
      publishedAt: undefined,
      createdAt: '2024-02-01T00:00:00.000Z',
    })

    render(<PostCard post={post} />)

    expect(screen.getByText(/2024\/02\/01/)).toBeInTheDocument()
  })

  test('PC-010: カテゴリが表示されリンクになっている', () => {
    const post = createPost({
      category: { id: 'cat1', name: 'テック', slug: 'tech' },
    })

    render(<PostCard post={post} />)

    const categoryLink = screen.getByRole('link', { name: 'テック' })
    expect(categoryLink).toBeInTheDocument()
    expect(categoryLink).toHaveAttribute('href', '/categories/tech')
  })

  test('PC-020: タイトルが /posts/[slug] へのリンクになっている', async () => {
    const user = userEvent.setup()
    const post = createPost({ slug: 'test-slug', title: 'テスト記事' })

    render(<PostCard post={post} />)

    const titleLink = screen.getByRole('link', { name: 'テスト記事' })
    expect(titleLink).toHaveAttribute('href', '/posts/test-slug')

    // 実際のルーティングまでは検証しない（Next.js の責務）
    await user.click(titleLink)
  })

  test('PC-031: excerpt がない場合に抜粋が表示されない', () => {
    const post = createPost({ excerpt: undefined })

    render(<PostCard post={post} />)

    expect(screen.queryByText('抜粋テキストです')).not.toBeInTheDocument()
  })
})

