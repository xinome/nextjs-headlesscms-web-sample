## 概要
`/posts` の記事一覧ページを実装します。microCMSから記事を取得し、Server Component で一覧表示します。

## タスク

### ページ実装（app/posts/page.tsx）
- [x] `app/posts/page.tsx` を新規作成
- [x] Server Component で `getPosts()` を呼び出し、記事一覧を取得
- [x] `export const revalidate = 60` を設定し、ISRを有効化
- [x] 記事が0件の場合のメッセージ表示を実装
- [x] エラーハンドリングを実装（開発環境でのデバッグ情報表示）

### コンポーネント実装（components/PostCard.tsx）
- [x] `components/PostCard.tsx` を新規作成
- [x] Propsとして `post: Post` を受け取る型定義を実装
- [x] `title`, `excerpt`, `category.name`, 公開日（`publishedAt` または `createdAt`）を表示
- [x] アイキャッチ画像（`eyecatch`）がある場合のみ `next/image` で表示
- [x] カード全体をクリックすると `/posts/[slug]` に遷移するように `Link` と組み合わせて利用

### microCMSクエリの利用
- [x] `lib/microcms/queries.ts` の `getPosts()` を一覧取得に利用
- [x] 必要に応じて `limit` / `offset` 等のクエリパラメータを利用
- [x] `Post` 型（`types/microcms.ts`）に基づいて型安全に実装

### スタイル / UI
- [x] シンプルなカードレイアウトで一覧性を確保
- [x] PC・SP両方で崩れない最低限のレイアウトを実装

### 動作確認
- [x] `/posts` にアクセスして一覧が表示されることを確認
- [x] カードクリックで `/posts/[slug]` に遷移することを確認（※詳細ページは未実装のため404は正常）
- [x] アイキャッチ画像・カテゴリ名・日付などが正しく表示されることを確認
- [ ] microCMSで記事を更新した際、60秒以内に内容が反映されること（ISR）が確認できる

## 実装内容（想定）

### 1. app/posts/page.tsx
- Server Component (`async` 関数) として実装
- `getPosts()` を呼び出し、記事一覧を取得
- `export const revalidate = 60` でISRを設定
- `PostCard` コンポーネントを使って一覧表示

### 2. components/PostCard.tsx
- `Post` 型を受け取り、以下を表示
  - タイトル
  - 抜粋（`excerpt`）
  - カテゴリ名（`post.category.name`）
  - 公開日（`post.publishedAt ?? post.createdAt`）
  - アイキャッチ画像（`post.eyecatch` がある場合のみ `next/image` で表示）
- 親側の `Link` と組み合わせて、カード全体をクリックで `/posts/[slug]` に遷移

## 完了条件
- [x] `/posts` ページが実装されている
- [x] Server Component で `getPosts()` を使用している
- [x] `PostCard` コンポーネントが実装され、一覧表示に利用されている
- [x] `next/image` によるアイキャッチ表示が機能している
- [x] `/posts/[slug]` への遷移が動作する（※詳細ページは未実装のため404は正常）
- [x] ISR（`revalidate: 60`）が設定されている
- [x] 手動テストで要件を満たすことが確認されている

## 関連ファイル
- app/posts/page.tsx ✅ 作成済み（エラーハンドリング含む）
- components/PostCard.tsx ✅ 作成済み
- lib/microcms/queries.ts ✅ `getPosts` 利用
- types/microcms.ts ✅ `Post` 型

## 備考
- 過剰な抽象化は避け、まずはMVPとして記事一覧を最短で動かすことを目的とする
- 後続ステップで `/posts/[slug]`（記事詳細）や `/categories/[slug]`（カテゴリ別一覧）を実装予定

