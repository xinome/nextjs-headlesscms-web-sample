import Link from 'next/link'
import { getPosts } from '@/lib/microcms/queries'
import type { Post } from '@/types/microcms'
import PostCard from '@/components/PostCard'

export const revalidate = 60

const PostsPage = async () => {
  try {
    const { contents: posts } = await getPosts({
      limit: 20,
    })

    return (
      <div className="container">
        <h1>記事一覧</h1>

        {posts.length === 0 ? (
          <p>記事がありません。</p>
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
                <Link href={`/posts/${post.slug}`}>
                  <PostCard post={post} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  } catch (error) {
    console.error('Error fetching posts:', error)
    
    // エラー詳細を表示（開発環境用）
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN
    const hasApiKey = !!process.env.MICROCMS_API_KEY

    return (
      <div className="container">
        <h1>記事一覧</h1>
        <div style={{ padding: '1rem', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '4px' }}>
          <h2 style={{ color: '#c00', marginTop: 0 }}>エラーが発生しました</h2>
          <p><strong>エラーメッセージ:</strong> {errorMessage}</p>
          <details style={{ marginTop: '1rem' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>デバッグ情報</summary>
            <ul style={{ marginTop: '0.5rem' }}>
              <li>サービスID: {serviceDomain || '未設定'}</li>
              <li>APIキー: {hasApiKey ? '設定済み' : '未設定'}</li>
              <li>エンドポイント: /api/v1/posts</li>
            </ul>
          </details>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
            <strong>確認事項:</strong>
          </p>
          <ul style={{ fontSize: '0.9rem' }}>
            <li>microCMS管理画面で「posts」APIが作成されているか確認してください</li>
            <li>.env.local の MICROCMS_SERVICE_DOMAIN と MICROCMS_API_KEY が正しいか確認してください</li>
            <li>APIキーに「読み取り」権限があるか確認してください</li>
          </ul>
        </div>
      </div>
    )
  }
}

export default PostsPage

