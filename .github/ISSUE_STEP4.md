## 概要
`/posts/[slug]` の記事詳細ページを実装します。microCMSから記事を取得し、本文表示とSEO（Metadata / OGP / noindex）を行います。

## タスク

### ページ実装（app/posts/[slug]/page.tsx）
- [ ] `app/posts/[slug]/page.tsx` を新規作成
- [ ] `params.slug` から記事を取得（`getPostBySlug(slug)` を利用）
- [ ] 記事が存在しなければ `notFound()` を呼び出す
- [ ] 本文 `content`（リッチエディタHTML）を表示
- [ ] アイキャッチ画像（`eyecatch`）がある場合のみ `next/image` で表示
- [ ] 公開日・カテゴリ名などのメタ情報を表示
- [ ] `export const revalidate = 60` を設定し、ISRを有効化

### SEO実装（generateMetadata）
- [ ] `generateMetadata` を実装
- [ ] `seoTitle` があればタイトルに使用、なければ `title` を使用
- [ ] `seoDescription` があれば説明に使用、なければ `excerpt` から生成（なければ固定文）
- [ ] OGPの `title` / `description` / `image` を最低限設定
- [ ] `noindex === true` の場合、`robots` を noindex に設定

### SSG実装（generateStaticParams）
- [ ] `generateStaticParams` を実装し、全 `posts` の `slug` をSSG対象として列挙
- [ ] `getPosts({ fields: 'slug', limit: ... })` を利用してslug一覧を取得

### 型・クエリの利用
- [ ] `Post` 型（`types/microcms.ts`）を利用して型安全に実装
- [ ] `lib/microcms/queries.ts` の `getPostBySlug` / `getPosts` を利用

### 動作確認
- [ ] 実在する `slug` にアクセスして、詳細ページが表示されることを確認
- [ ] 存在しない `slug` で `notFound()` が機能していることを確認
- [ ] `<head>` 内の `title` / `meta description` / OGPタグが期待どおり設定されていることを確認
- [ ] `noindex` 設定の記事で `robots` が noindex になっていることを確認
- [ ] 本番モード（`npm run build && npm start`）でSSG/ISRが期待どおりに動作することを確認

## 実装内容（想定）

### 1. app/posts/[slug]/page.tsx
- `PageProps` 型で `params.slug` を受け取る
- `getPostBySlug(slug)` で記事を取得
- 記事がなければ `notFound()` を呼び出し404に委譲
- タイトル / 公開日 / カテゴリ名 / アイキャッチ画像 / 本文HTMLを表示
- `export const revalidate = 60` を設定し、ISR有効化

### 2. generateMetadata
- `getPostBySlug(slug)` を内部で呼び出してSEO情報を組み立て
- タイトル:
  - `seoTitle` があれば使用
  - なければ `title` を使用
- 説明文:
  - `seoDescription` があれば使用
  - なければ `excerpt` を使用
  - どちらもない場合は固定文（例: 「記事の詳細ページです。」）を使用
- OGP:
  - `openGraph.title` / `openGraph.description` / `openGraph.images` を設定
- noindex:
  - `post.noindex === true` の場合、`robots: { index: false, follow: false }` を設定

### 3. generateStaticParams
- `getPosts({ fields: 'slug', limit: 100 })` で `slug` 一覧を取得
- `return contents.map(post => ({ slug: post.slug }))` でSSGパラメータを返却

## 完了条件
- [ ] `/posts/[slug]` ページが実装されている
- [ ] `getPostBySlug` による記事取得と `notFound()` が正しく動作している
- [ ] 本文 `content` がリッチテキストとして表示されている
- [ ] アイキャッチ画像が `next/image` で表示されている（ある場合）
- [ ] `generateMetadata` によりタイトル / 説明 / OGP / robots(noindex) が期待どおり設定されている
- [ ] `generateStaticParams` により全 `slug` がSSG対象になっている
- [ ] 手動テストで要件を満たすことが確認されている

## 関連ファイル
- app/posts/[slug]/page.tsx（新規作成）
- lib/microcms/queries.ts（`getPostBySlug`, `getPosts` 利用）
- types/microcms.ts（`Post` 型）

## 備考
- 過剰な抽象化は避け、まずはMVPとして記事詳細ページを最短で動かすことを目的とする
- 後続ステップでレイアウトやスタイル、関連記事表示などを拡張可能とする

