# Next.js × Headless CMS Web Sample

本リポジトリは、  
**Next.js（App Router）と Headless CMS（microCMS）を用いたWebサイト構成の検証・設計整理を目的としたサンプルプロジェクト**です。

実務を想定し、単なる表示確認にとどまらず、  
**設計判断・パフォーマンス・運用フロー**まで含めた構成を意識しています。

---

## 🎯 目的

- Next.js（App Router）の実務的な設計・実装パターンを整理する
- Headless CMS（microCMS）との連携方法を検証する
- SSG / ISR / キャッシュ戦略など、運用を見据えた構成を理解する
- 少人数体制で運用されるWebサイトのベストプラクティスをまとめる

---

## 🧩 想定ユースケース

- コーポレートサイト / サービスサイト
- お知らせ・ブログなどCMS管理コンテンツ
- SEOや表示速度が重要なWebサイト
- Headless CMS + CDN を前提とした構成

---

## 🛠 技術スタック

- **Framework**: Next.js 16.1.5（App Router）
- **Language**: TypeScript 5.6
- **Runtime**: React 19
- **CMS**: microCMS（Headless CMS、microcms-js-sdk 3.0）
- **Styling**: CSS（Noto Sans JP フォント）
- **Image Optimization**: next/image
- **SEO**: Metadata API（generateMetadata）
- **Source Control**: GitHub
- **CI/CD**: GitHub Actions
- **Testing**: Jest 30 + React Testing Library 16
- **CDN / Security**: Cloudflare（設計想定）

---

## 📄 主な機能

- **トップページ** (`/`) - 最新記事5件、カテゴリ一覧、「すべての記事」リンク
- **記事一覧ページ** (`/posts`) - 全記事の一覧表示（最大20件）
- **記事詳細ページ** (`/posts/[slug]`) - 記事本文、アイキャッチ画像、SEO/OGP対応
- **カテゴリ別一覧** (`/categories/[slug]`) - カテゴリごとの記事一覧
- **404ページ** - 存在しないページへのアクセス時の表示
- **エラーページ** - エラー発生時のフォールバック表示
- **ローディング表示** - ページ遷移時の読み込み中UI
- **CMSからの記事管理・更新** - microCMS で記事・カテゴリを管理
- **ISRを用いた更新反映** - 60秒ごとに再検証（`revalidate: 60`）
- **SSG** - `generateStaticParams` による静的生成
- **SEO対応** - `generateMetadata` による title / description / OGP 設定

---

## 🗂 ページ構成

| パス | 説明 | レンダリング |
|------|------|------------|
| `/` | トップページ（最新記事・カテゴリ一覧） | Static (ISR) |
| `/posts` | 記事一覧 | Static (ISR) |
| `/posts/[slug]` | 記事詳細 | SSG (ISR) |
| `/categories/[slug]` | カテゴリ別記事一覧 | SSG (ISR) |
| `/not-found` | 404ページ | Static |
| `/error` | エラーページ | Client Component |

---

## 🧠 設計方針

### レンダリング戦略

- **SSG（Static Site Generation）**: `generateStaticParams` で記事・カテゴリページを事前生成
- **ISR（Incremental Static Regeneration）**: `revalidate: 60` で60秒ごとに再検証
- **Server Components**: データ取得は Server Component で実行（`getPosts`, `getCategories` など）

### CMS設計

- **記事（posts）とカテゴリ（categories）を分離**: 運用しやすいコンテンツモデル
- **スキーマ定義**: `docs/microcms-schema.md` に詳細を記載
- **型安全**: `types/microcms.ts` で microCMS の型を定義

### UI/UX

- **PostCard コンポーネント**: 記事カードを再利用可能に設計
- **リンク仕様**: 記事タイトル → 記事詳細、カテゴリ名 → カテゴリ一覧
- **エラーハンドリング**: 404ページ、エラーフォールバック、ローディング表示
- **フォント**: Noto Sans JP で日本語の可読性を向上

### パフォーマンス

- **画像最適化**: `next/image` による自動最適化
- **キャッシュ戦略**: ISR + CDN を前提とした設計
- **並列取得**: `Promise.all` でデータを並列取得（トップページなど）

### 運用

- **CMS更新 → 60秒以内に反映**: ISR による自動再生成
- **将来的な拡張**: Webhook によるオンデマンド再生成も想定

---

## 🚀 開発環境セットアップ

### 1. 環境変数の設定

`.env.local.example` をコピーして `.env.local` を作成し、microCMS の情報を設定します。

```bash
cp .env.local.example .env.local
```

`.env.local` の内容:

```bash
MICROCMS_SERVICE_DOMAIN=your-service-id
MICROCMS_API_KEY=your-api-key
```

### 2. パッケージのインストールと起動

```bash
yarn install
yarn dev
```

ブラウザで `http://localhost:3000` を開いてください。

### 3. microCMS のセットアップ

`docs/microcms-setup-guide.md` と `docs/microcms-schema.md` を参照して、microCMS 側で以下を作成してください。

- **categories** API（カテゴリ管理）
- **posts** API（記事管理）

### 4. ビルド

```bash
yarn build
yarn start
```

---

## 🧪 テスト

- **実行**: `yarn test`（watch モード: `yarn test:watch`）
- **対象**: コンポーネント（PostCard）、ページ（/posts, /posts/[slug], /categories/[slug]）、microCMS クエリ関数
- **設計**: `docs/testing-PostCard.md` に PostCard のテストケース一覧を記載

---

## 🔄 CI（GitHub Actions）

- **ワークフロー**: `.github/workflows/ci.yml`
- **トリガー**: `main` / `develop` への push および pull_request
- **ジョブ**: `yarn install --frozen-lockfile` → `yarn lint` → `yarn test` → `yarn build`
- **環境変数**: `yarn build` 実行時に `MICROCMS_SERVICE_DOMAIN` / `MICROCMS_API_KEY` を GitHub Secrets から参照（リポジトリの Settings → Secrets and variables → Actions で設定）

---

## 📁 プロジェクト構成

```
.
├── app/                      # Next.js App Router
│   ├── categories/[slug]/    # カテゴリ別一覧ページ
│   ├── posts/                # 記事一覧・詳細ページ
│   ├── error.tsx             # エラーフォールバック
│   ├── loading.tsx           # ローディング表示
│   ├── not-found.tsx         # 404ページ
│   ├── page.tsx              # トップページ
│   ├── layout.tsx            # ルートレイアウト
│   └── globals.css           # グローバルスタイル
├── components/               # 共通コンポーネント
│   └── PostCard.tsx          # 記事カード
├── lib/microcms/             # microCMS 連携
│   ├── client.ts             # microCMS クライアント
│   └── queries.ts            # クエリ関数
├── types/                    # 型定義
│   └── microcms.ts           # microCMS の型
├── docs/                     # ドキュメント
│   ├── microcms-schema.md    # microCMS スキーマ定義
│   ├── microcms-setup-guide.md # microCMS セットアップ手順
│   └── testing-PostCard.md   # PostCard テストケース
├── __tests__/                # テストファイル
└── .github/                  # GitHub 関連
    ├── workflows/ci.yml      # CI ワークフロー
    └── ISSUE_STEP*.md        # 実装ステップ管理
```

---

## 📝 実装ステップ

プロジェクトは以下のステップで実装されています。詳細は各 `.github/ISSUE_STEP*.md` を参照してください。

- **Step 0**: プロジェクトセットアップ（Next.js + TypeScript）
- **Step 1**: microCMS 型定義・クライアント実装
- **Step 2**: microCMS クエリ関数実装
- **Step 3**: `/posts` 記事一覧ページ実装
- **Step 4**: `/posts/[slug]` 記事詳細ページ実装（SEO対応）
- **Step 5**: `/categories/[slug]` カテゴリ別一覧ページ実装
- **Step 6**: `/` トップページ実装（最新記事・カテゴリ導線）
- **Step 7**: エラーハンドリングと UI 整備（404・エラー・ローディング）

---

## 🎨 UI デザイン

[dx-consultant.co.jp](https://dx-consultant.co.jp/) を参考に、プロフェッショナルで読みやすいデザインを採用しています。

- **フォント**: Noto Sans JP（日本語の可読性重視）
- **ヘッダー**: ダーク背景（`#1a1a1a`）、ロゴ＋ナビゲーション
- **カラー**: ブルー系アクセント（`#3859c9`）
- **レイアウト**: 最大幅 1200px、中央揃え
