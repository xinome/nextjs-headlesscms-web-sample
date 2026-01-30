import type { Metadata } from 'next'
import Link from 'next/link'
import { Noto_Sans_JP } from 'next/font/google'
import './globals.css'

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Next.js × microCMS Sample',
  description: 'Next.js（App Router）と microCMS を用いたWebサイトサンプル',
}

const RootLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <html lang="ja">
      <body className={notoSansJP.className}>
        <header className="header">
          <div className="header-inner">
            <h1 className="header-logo">
              <Link href="/">Next.js × microCMS Sample</Link>
            </h1>
            <nav className="header-nav">
              <Link href="/">トップ</Link>
              <Link href="/posts">記事一覧</Link>
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

export default RootLayout
