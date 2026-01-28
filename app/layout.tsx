import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Next.js × microCMS Sample',
  description: 'Next.js（App Router）と microCMS を用いたWebサイトサンプル',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <header className="header">
          <div className="header-inner">
            <h1 className="header-logo">
              <a href="/">Next.js × microCMS Sample</a>
            </h1>
            <nav className="header-nav">
              <a href="/">トップ</a>
              <a href="/posts">記事一覧</a>
            </nav>
          </div>
        </header>
        <main className="main">
          {children}
        </main>
        <footer className="footer">
          <div className="footer-inner">
            <p>&copy; 2026 Next.js × microCMS Sample</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
