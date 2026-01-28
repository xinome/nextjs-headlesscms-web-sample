import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getPostBySlug, getPosts } from '@/lib/microcms/queries'
import type { Post } from '@/types/microcms'

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

// ISR: 詳細ページも60秒で再検証
export const revalidate = 60

// 記事詳細ページ本体
const PostDetailPage = async ({ params }: PageProps) => {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const publishedAt = post.publishedAt ?? post.createdAt
  const publishedDateLabel = new Date(publishedAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  return (
    <div className="container">
      <article
        style={{
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        {/* タイトル */}
        <h1
          style={{
            fontSize: '1.8rem',
            marginBottom: '0.5rem',
          }}
        >
          {post.title}
        </h1>

        {/* メタ情報（カテゴリ・日付） */}
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center',
            fontSize: '0.9rem',
            color: '#777',
            marginBottom: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <span>{publishedDateLabel}</span>
          {post.category && (
            <span
              style={{
                padding: '0.15rem 0.6rem',
                borderRadius: '999px',
                backgroundColor: '#f0f4ff',
                color: '#3859c9',
                fontWeight: 500,
              }}
            >
              {post.category.name}
            </span>
          )}
        </div>

        {/* アイキャッチ */}
        {post.eyecatch && (
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '800px',
              height: '450px',
              marginBottom: '1.5rem',
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: '#f5f5f5',
            }}
          >
            <Image
              src={post.eyecatch.url}
              alt={post.title}
              fill
              sizes="(min-width: 768px) 800px, 100vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}

        {/* 本文（リッチエディタHTML） */}
        <div
          style={{ lineHeight: 1.8, fontSize: '1rem', color: '#333' }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  )
}

export default PostDetailPage

// ------------------------------------------------------
// generateMetadata: SEO / OGP / robots(noindex) の設定
// ------------------------------------------------------

export const generateMetadata = async (
  { params }: PageProps
): Promise<Metadata> => {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  // 記事が存在しない場合はデフォルトのメタデータ（Next.js側で404になる）
  if (!post) {
    return {
      title: '記事が見つかりません',
      description: 'お探しの記事は見つかりませんでした。',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const baseTitle = post.title
  const seoTitle = post.seoTitle || baseTitle

  // 説明文の優先度: seoDescription > excerpt > 固定文
  const fallbackDescription = post.excerpt || '記事の詳細ページです。'
  const seoDescription = post.seoDescription || fallbackDescription

  const ogImageUrl = post.eyecatch?.url

  const robots =
    post.noindex === true
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        }

  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: 'article',
      url: `https://example.com/posts/${post.slug}`, // 後で実際の本番URLに差し替え
      images: ogImageUrl
        ? [
            {
              url: ogImageUrl,
              // microCMSの画像は width/height を含むが、最低限でOK
            },
          ]
        : undefined,
    },
    robots,
  }
}

// ------------------------------------------------------
// generateStaticParams: 全記事の slug をSSG対象として列挙
// ------------------------------------------------------

export const generateStaticParams = async () => {
  // fields で slug のみ取得するとレスポンスが軽くなります
  const { contents } = await getPosts({
    fields: 'slug',
    limit: 100, // MVPとして100件まで。必要ならページング実装も検討
  })

  return contents.map((post) => ({
    slug: post.slug,
  }))
}
