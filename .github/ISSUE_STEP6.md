## 概要
トップページ `/` を実装します。最新記事・カテゴリ一覧・「すべての記事」リンクを表示し、サイト内の主要導線を確保します。

## タスク

### ページ実装（app/page.tsx）
- [x] `app/page.tsx` を更新（Server Component に変更）
- [x] 最新記事を数件（例: 5件）取得して表示（`PostCard` を再利用）
- [x] `categories` を取得して一覧表示（カテゴリリンクは `/categories/[slug]`）
- [x] 「すべての記事」リンク（`/posts`）を配置
- [x] `export const revalidate = 60` を設定し、ISRを有効化

### データ取得
- [x] `getPosts({ limit: 5 })` で最新5件の記事を取得
- [x] `getCategories()` でカテゴリ一覧を取得
- [x] `Promise.all` で posts と categories を並列取得し、パフォーマンスを最適化

### 型・クエリの利用
- [x] `Post` / `Category` 型（`types/microcms.ts`）を利用して型安全に実装
- [x] `lib/microcms/queries.ts` の `getPosts` / `getCategories` を利用

### 動作確認
- [x] トップページ `/` にアクセスして、最新記事・カテゴリ・「すべての記事」リンクが表示されることを確認
- [x] カテゴリリンクをクリックして `/categories/[slug]` に遷移することを確認
- [x] 「すべての記事」リンクをクリックして `/posts` に遷移することを確認
- [x] 記事が0件・カテゴリが0件の場合の表示を確認
- [x] `yarn build` が成功することを確認

## 実装内容

### 1. app/page.tsx
- `Home` コンポーネントを `async` 関数に変更し、Server Component として実装
- `Promise.all([getPosts({ limit: 5 }), getCategories({ limit: 100 })])` で並列取得
- セクション構成:
  - **最新記事**: `PostCard` で最大5件表示。0件時は「記事がありません。」
  - **カテゴリ**: カテゴリ名を `Link` で `/categories/[slug]` にリンク。0件時は「カテゴリがありません。」
  - **すべての記事**: `Link` で `/posts` にリンク（例: 「すべての記事を見る →」）
- `export const revalidate = 60` を設定

## 完了条件
- [x] トップページに最新記事が表示されている
- [x] トップページにカテゴリ一覧が表示され、各カテゴリが `/categories/[slug]` にリンクしている
- [x] 「すべての記事」リンクが `/posts` に遷移する
- [x] ISR（`revalidate: 60`）が設定されている
- [x] 手動テストで要件を満たすことが確認されている

## 関連ファイル
- app/page.tsx ✅ 更新済み
- lib/microcms/queries.ts ✅ `getPosts` / `getCategories` 利用
- types/microcms.ts ✅ `Post` / `Category` 型
- components/PostCard.tsx ✅ 再利用

## 備考
- 過剰な抽象化は避け、MVPとしてトップページの導線を最短で実装することを目的とする
- `PostCard` をそのまま再利用し、一覧ページとの一貫性を保つ
- **動作確認済み**: 最新記事・カテゴリ一覧・「すべての記事」リンクの表示および遷移を確認済み
