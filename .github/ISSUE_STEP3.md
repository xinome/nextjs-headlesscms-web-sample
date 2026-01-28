## 概要
`/posts` の記事一覧ページを実装します。microCMSから記事を取得し、Server Component で一覧表示します。

## タスク

### ページ実装（app/posts/page.tsx）
- [ ] `app/posts/page.tsx` を新規作成
- [ ] Server Component で `getPosts()` を呼び出し、記事一覧を取得
- [ ] `export const revalidate = 60` を設定し、ISRを有効化
- [ ] 記事が0件の場合のメッセージ表示を実装

### コンポーネント実装（components/PostCard.tsx）
- [ ] `components/PostCard.tsx` を新規作成
- [ ] Propsとして `post: Post` を受け取る型定義を実装
- [ ] `title`, `excerpt`, `category.name`, 公開日（`publishedAt` または `createdAt`）を表示
- [ ] アイキャッチ画像（`eyecatch`）がある場合のみ `next/image` で表示
- [ ] カード全体をクリックすると `/posts/[slug]` に遷移するように `Link` と組み合わせて利用

### microCMSクエリの利用
- [ ] `lib/microcms/queries.ts` の `getPosts()` を一覧取得に利用
- [ ] 必要に応じて `limit` / `offset` 等のクエリパラメータを利用
- [ ] `Post` 型（`types/microcms.ts`）に基づいて型安全に実装

### スタイル / UI
- [ ] シンプルなカードレイアウトで一覧性を確保
- [ ] PC・SP両方で崩れない最低限のレイアウトを実装

### 動作確認
- [ ] `/posts` にアクセスして一覧が表示されることを確認
- [ ] カードクリックで `/posts/[slug]` に遷移することを確認
- [ ] アイキャッチ画像・カテゴリ名・日付などが正しく表示されることを確認
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
- [ ] `/posts` ページが実装されている
- [ ] Server Component で `getPosts()` を使用している
- [ ] `PostCard` コンポーネントが実装され、一覧表示に利用されている
- [ ] `next/image` によるアイキャッチ表示が機能している
- [ ] `/posts/[slug]` への遷移が動作する
- [ ] ISR（`revalidate: 60`）が設定されている
- [ ] 手動テストで要件を満たすことが確認されている

## 関連ファイル
- app/posts/page.tsx（新規作成）
- components/PostCard.tsx（新規作成）
- lib/microcms/queries.ts（`getPosts` 利用）
- types/microcms.ts（`Post` 型）

## 備考
- 過剰な抽象化は避け、まずはMVPとして記事一覧を最短で動かすことを目的とする
- 後続ステップで `/posts/[slug]`（記事詳細）や `/categories/[slug]`（カテゴリ別一覧）を実装予定

