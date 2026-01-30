'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container">
      <h1>エラーが発生しました</h1>
      <p>申し訳ございません。問題が発生しました。</p>
      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
        <button
          type="button"
          onClick={() => reset()}
          className="error-reset-btn"
        >
          再試行
        </button>
        <Link
          href="/"
          className="post-card-link"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            color: '#3859c9',
            fontWeight: 500,
          }}
        >
          トップページへ戻る
        </Link>
      </div>
    </div>
  )
}
