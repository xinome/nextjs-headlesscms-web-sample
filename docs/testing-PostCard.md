## PostCard コンポーネント テスト設計書

本ドキュメントは、`components/PostCard.tsx` に対する **Jest + Testing Library** 用のテスト計画です。  
実装前に「何をどこまで自動テストするか」を明確にすることを目的とします。

---

## 1. 対象コンポーネント概要

- **ファイル**: `components/PostCard.tsx`
- **役割**:
  - microCMS の `Post` 型を受け取り、一覧表示用のカードとして描画する
  - 公開日・カテゴリ・タイトル・抜粋・アイキャッチ画像を表示
  - 記事詳細 (`/posts/[slug]`) やカテゴリ別一覧 (`/categories/[slug]`) への導線を提供

---

## 2. テスト観点一覧

- **表示ロジック**
  - 公開日のフォーマット
  - カテゴリの有無による表示切り替え
  - 抜粋の有無による表示切り替え
  - アイキャッチ画像の有無による表示切り替え
- **リンク**
  - 記事タイトルリンクが `/posts/[slug]` になっている
  - カテゴリリンクが `/categories/[slug]` になっている
- **アクセシビリティ / UX**
  - リンクテキストが意味のある文言になっている
  - 画像の `alt` 属性が適切に設定されている
- **エッジケース**
  - `publishedAt` がない場合に `createdAt` が使われる
  - オプショナルなフィールド（`excerpt`, `eyecatch`, `category`）が `null` / `undefined` の場合でもレンダリングエラーにならない

---

## 3. 前提・テスト環境

- **テストフレームワーク**: Jest
- **UI テストライブラリ**: React Testing Library
- **補助ライブラリ**: `@testing-library/jest-dom`, `@testing-library/user-event`
- **レンダリング対象**: `PostCard` 単体（Next.js のページやレイアウトは含めない）
- **外部依存**:
  - `next/link`, `next/image` は基本的にモックしない前提（Jest 設定側で必要に応じてモック）

---

## 4. テストケース詳細

### 4-1. 日付表示ロジック

**ID**: PC-001  
**目的**: `post.publishedAt` が存在する場合、その値が日付文字列として表示されることを確認する。  
**前提**:
- `post.publishedAt` に `"2024-01-15T00:00:00.000Z"` を指定
- `post.createdAt` に別の日付を指定
**期待結果**:
- カード内に `2024/01/15` のような形式（`toLocaleDateString('ja-JP', ...)` の結果）が表示される。

---

**ID**: PC-002  
**目的**: `post.publishedAt` が `null` / `undefined` の場合、`post.createdAt` が代わりに使用されることを確認する。  
**前提**:
- `post.publishedAt` を `undefined` または `null`
- `post.createdAt` に `"2024-02-01T00:00:00.000Z"` を指定
**期待結果**:
- カード内に `2024/02/01` が表示される。

---

### 4-2. カテゴリ表示

**ID**: PC-010  
**目的**: `post.category` が存在する場合、カテゴリ名とカテゴリリンクが表示されることを確認する。  
**前提**:
- `post.category = { slug: 'tech', name: 'テック', id: 'cat1' }` を設定
**期待結果**:
- テキスト `テック` が表示される。
- 同じ行にカテゴリ名を含むリンクが存在する。
- リンクの `href` 属性が `/categories/tech` である。

---

**ID**: PC-011  
**目的**: `post.category` が `null` / `undefined` の場合、カテゴリリンク部分が表示されないことを確認する。  
**前提**:
- `post.category` を `undefined` または `null`
**期待結果**:
- カテゴリ名相当のテキストが存在しない。
- `/categories/` へのリンクが存在しない。

---

### 4-3. タイトル・記事リンク

**ID**: PC-020  
**目的**: タイトルテキストが表示され、`/posts/[slug]` へのリンクになっていることを確認する。  
**前提**:
- `post.title = 'テスト記事'`
- `post.slug = 'test-slug'`
**期待結果**:
- `テスト記事` というテキストが `h2` 内に表示される。
- `テスト記事` をラベルに持つリンクが存在する。
- そのリンクの `href` 属性が `/posts/test-slug` になっている。

---

### 4-4. 抜粋（excerpt）の表示

**ID**: PC-030  
**目的**: `post.excerpt` が存在する場合、抜粋テキストが表示されることを確認する。  
**前提**:
- `post.excerpt = '抜粋テキストです'`
**期待結果**:
- カード内に `抜粋テキストです` が表示される。
- 抜粋テキストが段落要素（`<p>`）としてレンダリングされている。

---

**ID**: PC-031  
**目的**: `post.excerpt` が `null` / `undefined` の場合、抜粋の段落が表示されないことを確認する。  
**前提**:
- `post.excerpt` を `undefined` または `null`
**期待結果**:
- 抜粋と思われるテキストが表示されない。
- 抜粋用の `<p>` が DOM に存在しない。

---

### 4-5. アイキャッチ画像の表示

**ID**: PC-040  
**目的**: `post.eyecatch` が存在する場合、`Image` コンポーネントがレンダリングされることを確認する。  
**前提**:
- `post.eyecatch = { url: 'https://example.com/image.jpg', height: 100, width: 160 }` 相当
**期待結果**:
- DOM 上に `role="img"` 相当の要素（`<img>` など Next Image の出力）が存在する。
- 画像の `alt` 属性が `post.title` と一致している。

---

**ID**: PC-041  
**目的**: `post.eyecatch` が `null` / `undefined` の場合、画像用コンテナが表示されないことを確認する。  
**前提**:
- `post.eyecatch` を `null` または `undefined`
**期待結果**:
- アイキャッチ用のラッパ要素（幅 160 x 高さ 100 のボックス）が存在しない。
- 画像が DOM に存在しない。

---

### 4-6. アクセシビリティ / UX

**ID**: PC-050  
**目的**: タイトルリンク・カテゴリリンクのテキストが意味のある文言になっていることを確認する。  
**前提**:
- 一般的な `Post` データを使用
**期待結果**:
- タイトルリンクのラベルが記事タイトルと一致する。
- カテゴリリンクのラベルがカテゴリ名と一致する。

---

## 5. サンプルテストコード（抜粋）

以下は、上記テストケースの一部をカバーする **サンプル実装** です。  
実際のテスト作成時はファイルパスや型定義に合わせて調整してください。

```typescript
// __tests__/components/PostCard.test.tsx（想定）
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
```

---

## 6. 今後の拡張候補

- `PostCard` に hover スタイルやキーボードフォーカスなどのインタラクションを追加した場合のテスト
- 複数カードを並べたリストコンポーネント（例: `/posts` ページ）のスナップショットテスト・レンダリングテスト
- microCMS 側のデータ不整合（カテゴリなし・slug 重複など）を想定した堅牢性テスト

まずは本ドキュメントのケースをカバーする Jest テストを実装し、その後必要に応じて拡張していく想定とする。

