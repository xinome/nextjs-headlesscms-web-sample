---
name: Step5 カテゴリ別一覧ページ
about: /categories/[slug] のカテゴリ別記事一覧ページを実装
title: 'Step5: /categories/[slug]（カテゴリ別一覧）ページ実装'
labels: 'enhancement, step5'
assignees: ''
---

## 概要
`/categories/[slug]` のカテゴリ別記事一覧ページを実装します。slug からカテゴリを取得し、カテゴリIDで記事一覧を表示します。

## タスク

### ページ実装（app/categories/[slug]/page.tsx）
- [ ] `app/categories/[slug]/page.tsx` を新規作成
- [ ] `params.slug` からカテゴリを取得（`getCategoryBySlug(slug)` を利用、Next.js 15+ の Promise params に対応）
- [ ] カテゴリが存在しなければ `notFound()` を呼び出す
- [ ] カテゴリIDで `getPostsByCategoryId(categoryId)` により記事一覧を取得
- [ ] 記事一覧を `PostCard` で表示（`Link` で `/posts/[slug]` に遷移）
- [ ] ページのタイトル（h1）にカテゴリ名を表示
- [ ] 記事0件時は「このカテゴリにはまだ記事がありません。」等のメッセージを表示
- [ ] `export const revalidate = 60` を設定し、ISRを有効化

### SEO実装（generateMetadata）
- [ ] `generateMetadata` を実装
- [ ] タイトルにカテゴリ名を設定（例: `カテゴリ: ${category.name}`）
- [ ] `description` が存在すれば使用、なければ補完（例: `${category.name} の記事一覧です。`）
- [ ] OGPの `title` / `description` / `url` を最低限設定
- [ ] カテゴリが存在しない場合は `notFound` 相当のメタデータ（タイトル・description・robots）

### SSG実装（generateStaticParams）
- [ ] `generateStaticParams` を実装し、全カテゴリの `slug` をSSG対象として列挙
- [ ] `getCategories({ fields: 'slug', limit: 100 })` を利用してslug一覧を取得

### 型・クエリの利用
- [ ] `Category` / `Post` 型（`types/microcms.ts`）を利用して型安全に実装
- [ ] `lib/microcms/queries.ts` の `getCategoryBySlug` / `getPostsByCategoryId` / `getCategories` を利用

### 動作確認
- [ ] 実在するカテゴリの `slug` にアクセスして、一覧ページが表示されることを確認
- [ ] 存在しない `slug` で `notFound()` が機能していることを確認
- [ ] カテゴリに属する記事が `PostCard` で一覧表示され、クリックで `/posts/[slug]` に遷移することを確認
- [ ] `<head>` 内の `title` / `meta description` が期待どおり設定されていることを確認
- [ ] `yarn build` が成功し、`generateStaticParams` によりカテゴリページがSSG対象になっていることを確認

## 完了条件
- [ ] `/categories/[slug]` ページが実装されている
- [ ] `getCategoryBySlug` によるカテゴリ取得と `notFound()` が正しく動作している
- [ ] カテゴリIDで取得した記事が `PostCard` で一覧表示されている
- [ ] ページタイトルにカテゴリ名が表示されている
- [ ] `generateMetadata` によりカテゴリの title / description（不足時は補完）が設定されている
- [ ] `generateStaticParams` により全カテゴリの `slug` がSSG対象になっている
- [ ] 手動テストで要件を満たすことが確認されている

## 関連ファイル
- app/categories/[slug]/page.tsx（新規作成）
- lib/microcms/queries.ts（`getCategoryBySlug` / `getPostsByCategoryId` / `getCategories` 利用）
- types/microcms.ts（`Category` / `Post` 型）
- components/PostCard.tsx（再利用）

## 備考
- 過剰な抽象化は避け、まずはMVPとしてカテゴリ別一覧ページを最短で動かすことを目的とする
- カテゴリ一覧ページ（`/categories`）やナビへのリンク追加は別タスクとする
