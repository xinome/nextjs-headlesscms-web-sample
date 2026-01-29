import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  getCategoryBySlug,
  getCategories,
  getPostsByCategoryId,
} from '@/lib/microcms/queries'
import type { Post } from '@/types/microcms'
import PostCard from '@/components/PostCard'

type PageProps = {
  params: Promise<{ slug: string }>
}

export const revalidate = 60

const CategoryPage = async ({ params }: PageProps) => {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const { contents: posts } = await getPostsByCategoryId(category.id, {
    limit: 100,
  })

  return (
    <div className="container">
      <h1>カテゴリ: {category.name}</h1>

      {posts.length === 0 ? (
        <p>このカテゴリにはまだ記事がありません。</p>
      ) : (
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            marginTop: '1.5rem',
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
    </div>
  )
}

export default CategoryPage

// ---------------------------------------------------------------------------
// generateMetadata: カテゴリの title / description（不足時は補完）
// ---------------------------------------------------------------------------

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    return {
      title: 'カテゴリが見つかりません',
      description: 'お探しのカテゴリは見つかりませんでした。',
      robots: { index: false, follow: false },
    }
  }

  const title = `カテゴリ: ${category.name}`
  const description =
    category.description?.trim() || `${category.name} の記事一覧です。`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://example.com/categories/${category.slug}`,
    },
  }
}

// ---------------------------------------------------------------------------
// generateStaticParams: 全カテゴリの slug を SSG 対象として列挙
// ---------------------------------------------------------------------------

export const generateStaticParams = async () => {
  const { contents } = await getCategories({
    fields: 'slug',
    limit: 100,
  })
  return contents.map((c) => ({ slug: c.slug }))
}
