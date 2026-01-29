import Image from 'next/image'
import Link from 'next/link'
import type { Post } from '@/types/microcms'

type Props = {
  post: Post
}

const PostCard = ({ post }: Props) => {
  const publishedAt = post.publishedAt ?? post.createdAt
  const publishedDateLabel = new Date(publishedAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  return (
    <article
      style={{
        display: 'flex',
        gap: '1rem',
        padding: '1rem',
        border: '1px solid #e5e5e5',
        borderRadius: '8px',
        backgroundColor: '#fff',
        alignItems: 'flex-start',
      }}
    >
      {post.eyecatch && (
        <div
          style={{
            position: 'relative',
            flexShrink: 0,
            width: 160,
            height: 100,
            overflow: 'hidden',
            borderRadius: '6px',
            backgroundColor: '#f5f5f5',
          }}
        >
          <Image
            src={post.eyecatch.url}
            alt={post.title}
            fill
            sizes="160px"
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '0.8rem',
            color: '#777',
            marginBottom: '0.25rem',
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <span>{publishedDateLabel}</span>
          {post.category && (
            <Link
              href={`/categories/${post.category.slug}`}
              className="post-card-link"
              style={{
                padding: '0.1rem 0.5rem',
                borderRadius: '999px',
                backgroundColor: '#f0f4ff',
                color: '#3859c9',
                fontWeight: 500,
              }}
            >
              {post.category.name}
            </Link>
          )}
        </div>

        <h2
          style={{
            fontSize: '1.05rem',
            margin: 0,
            marginBottom: '0.4rem',
            fontWeight: 600,
          }}
        >
          <Link
            href={`/posts/${post.slug}`}
            className="post-card-link"
            style={{ color: 'inherit' }}
          >
            {post.title}
          </Link>
        </h2>

        {post.excerpt && (
          <p
            style={{
              margin: 0,
              fontSize: '0.9rem',
              color: '#555',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {post.excerpt}
          </p>
        )}
      </div>
    </article>
  )
}

export default PostCard

