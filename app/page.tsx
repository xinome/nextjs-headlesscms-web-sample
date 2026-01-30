import Link from 'next/link'
import { getPosts, getCategories } from '@/lib/microcms/queries'
import type { Post, Category } from '@/types/microcms'
import PostCard from '@/components/PostCard'

export const revalidate = 60

const Home = async () => {
  const [postsResponse, categoriesResponse] = await Promise.all([
    getPosts({ limit: 5 }),
    getCategories({ limit: 100 }),
  ])

  const posts = postsResponse.contents
  const categories = categoriesResponse.contents

  return (
    <div className="container">
      <h1>トップページ</h1>
      <p style={{ marginBottom: '2rem' }}>
        Next.js（App Router）と microCMS のサンプルサイトです。
      </p>

      {/* 最新記事 */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
          最新記事
        </h2>
        {posts.length === 0 ? (
          <p>記事がありません。</p>
        ) : (
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'grid',
              gap: '1.5rem',
            }}
          >
            {posts.map((post: Post) => (
              <li key={post.id}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* カテゴリ一覧 */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
          カテゴリ
        </h2>
        {categories.length === 0 ? (
          <p>カテゴリがありません。</p>
        ) : (
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            {categories.map((category: Category) => (
              <li key={category.id}>
                <Link
                  href={`/categories/${category.slug}`}
                  style={{
                    display: 'inline-block',
                    padding: '0.5rem 1rem',
                    borderRadius: '999px',
                    backgroundColor: '#f0f4ff',
                    color: '#3859c9',
                    textDecoration: 'none',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                  }}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* すべての記事リンク */}
      <p>
        <Link
          href="/posts"
          className="post-card-link"
          style={{
            color: '#3859c9',
            fontWeight: 600,
          }}
        >
          すべての記事を見る →
        </Link>
      </p>
    </div>
  )
}

export default Home
