## 概要
`/categories/[slug]` のカテゴリ別記事一覧ページを実装します。slug からカテゴリを取得し、カテゴリIDで記事一覧を表示します。

## タスク

### ページ実装（app/categories/[slug]/page.tsx）
- [x] `app/categories/[slug]/page.tsx` を新規作成
- [x] `params.slug` からカテゴリを取得（`getCategoryBySlug(slug)` を利用、Next.js 15+ の Promise params に対応）
- [x] カテゴリが存在しなければ `notFound()` を呼び出す
- [x] カテゴリIDで `getPostsByCategoryId(categoryId)` により記事一覧を取得
- [x] 記事一覧を `PostCard` で表示（タイトルのみ記事リンク、カテゴリ名のみカテゴリリンク）
- [x] ページのタイトル（h1）にカテゴリ名を表示
- [x] 記事0件時は「このカテゴリにはまだ記事がありません。」等のメッセージを表示
- [x] `export const revalidate = 60` を設定し、ISRを有効化

### SEO実装（generateMetadata）
- [x] `generateMetadata` を実装
- [x] タイトルにカテゴリ名を設定（例: `カテゴリ: ${category.name}`）
- [x] `description` が存在すれば使用、なければ補完（例: `${category.name} の記事一覧です。`）
- [x] OGPの `title` / `description` / `url` を最低限設定
- [x] カテゴリが存在しない場合は `notFound` 相当のメタデータ（タイトル・description・robots）

### SSG実装（generateStaticParams）
- [x] `generateStaticParams` を実装し、全カテゴリの `slug` をSSG対象として列挙
- [x] `getCategories({ fields: 'slug', limit: 100 })` を利用してslug一覧を取得

### 型・クエリの利用
- [x] `Category` / `Post` 型（`types/microcms.ts`）を利用して型安全に実装
- [x] `lib/microcms/queries.ts` の `getCategoryBySlug` / `getPostsByCategoryId` / `getCategories` を利用

### PostCardリンク仕様（カテゴリページ直リンク動線）
- [x] カード全体のリンクを廃止し、記事タイトル部分のみ `/posts/[slug]` へのリンクとする
- [x] カテゴリ名ラベル部分のみ `/categories/[slug]` へのリンクとし、カテゴリページへの直リンク動線を確保
- [x] `PostCard` のリンク仕様を `app/posts`・`app/categories/[slug]` の両一覧で共通利用
- [x] リンクに `.post-card-link` を付与し、ホバー時にアンダーライン表示（`app/globals.css`）

### 動作確認
- [x] 実在するカテゴリの `slug` にアクセスして、一覧ページが表示されることを確認
- [x] 存在しない `slug` で `notFound()` が機能していることを確認
- [x] カテゴリに属する記事が `PostCard` で一覧表示され、タイトルクリックで `/posts/[slug]`・カテゴリ名クリックで `/categories/[slug]` に遷移することを確認
- [x] `<head>` 内の `title` / `meta description` が期待どおり設定されていることを確認
- [x] `yarn build` が成功し、`generateStaticParams` によりカテゴリページがSSG対象になっていることを確認

## 実装内容

### 1. app/categories/[slug]/page.tsx
- `PageProps` 型で `params: Promise<{ slug: string }>` を受け取る（Next.js 15+ 対応）
- `const { slug } = await params` で slug を展開
- `getCategoryBySlug(slug)` でカテゴリを取得
- カテゴリがなければ `notFound()` を呼び出し404に委譲
- `getPostsByCategoryId(category.id, { limit: 100 })` で記事一覧を取得
- `<h1>カテゴリ: {category.name}</h1>` でページタイトルにカテゴリ名を表示
- `PostCard` を再利用して一覧表示（カード全体の `Link` は用いず、タイトルのみ記事リンク・カテゴリ名のみカテゴリリンク）
- `export const revalidate = 60` を設定し、ISR有効化

### 2. generateMetadata
- `const { slug } = await params` で slug を展開（Next.js 15+ 対応）
- `getCategoryBySlug(slug)` を内部で呼び出してSEO情報を組み立て
- タイトル: `カテゴリ: ${category.name}` などカテゴリ名を含める
- 説明文: `category.description` があれば使用、なければ `${category.name} の記事一覧です。` 等で補完
- OGP: `openGraph.title` / `openGraph.description` / `openGraph.url` を設定
- カテゴリ不在時: `title` / `description` / `robots: { index: false, follow: false }` を返却

### 3. generateStaticParams
- `getCategories({ fields: 'slug', limit: 100 })` でカテゴリの `slug` 一覧を取得
- `return contents.map(c => ({ slug: c.slug }))` でSSGパラメータを返却

### 4. PostCardリンク仕様・一覧ページの調整
- **PostCard**: 記事タイトルを `Link` で `/posts/[slug]`、カテゴリ名を `Link` で `/categories/[category.slug]` にそれぞれリンク。カード全体のリンクは廃止。
- **app/posts/page.tsx**: 一覧の各 `PostCard` を囲んでいた `Link` を削除。
- **app/categories/[slug]/page.tsx**: 同様に各 `PostCard` を囲んでいた `Link` を削除。
- **app/globals.css**: `.post-card-link` を追加（通常 `text-decoration: none`、ホバー時 `underline`）。

## 完了条件
- [x] `/categories/[slug]` ページが実装されている
- [x] `getCategoryBySlug` によるカテゴリ取得と `notFound()` が正しく動作している
- [x] カテゴリIDで取得した記事が `PostCard` で一覧表示されている
- [x] ページタイトルにカテゴリ名が表示されている
- [x] `generateMetadata` によりカテゴリの title / description（不足時は補完）が設定されている
- [x] `generateStaticParams` により全カテゴリの `slug` がSSG対象になっている
- [x] 手動テストで要件を満たすことが確認されている

## 関連ファイル
- app/categories/[slug]/page.tsx ✅ 作成済み（PostCard のみ表示、カード全体 Link なし）
- app/posts/page.tsx ✅ PostCard 利用（カード全体 Link なし）
- lib/microcms/queries.ts ✅ `getCategoryBySlug` / `getPostsByCategoryId` / `getCategories` 利用
- types/microcms.ts ✅ `Category` / `Post` 型
- components/PostCard.tsx ✅ 再利用（タイトル→記事リンク・カテゴリ→カテゴリリンク）
- app/globals.css ✅ `.post-card-link` 追加

## 備考
- 過剰な抽象化は避け、まずはMVPとしてカテゴリ別一覧ページを最短で動かすことを目的とする
- カテゴリ一覧ページ（`/categories`）やナビへのリンク追加は別タスクとする
- **動作確認済み**（2026-01-29）: 実在slugでの一覧表示・存在しないslugでの`notFound`・PostCardのタイトル→`/posts/[slug]`・カテゴリ名→`/categories/[slug]`の遷移・`title`/`meta description`・`yarn build`によるSSG確認を実施済み
