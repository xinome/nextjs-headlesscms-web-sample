import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container">
      <h1>404 - ページが見つかりません</h1>
      <p>お探しのページは存在しないか、移動した可能性があります。</p>
      <p style={{ marginTop: '1rem' }}>
        <Link href="/" className="post-card-link" style={{ color: '#3859c9' }}>
          トップページへ戻る
        </Link>
      </p>
    </div>
  )
}
