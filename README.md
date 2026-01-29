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

- **Framework**: Next.js（App Router）
- **Language**: TypeScript
- **CMS**: microCMS（Headless CMS）
- **Styling**: CSS /（必要に応じて Tailwind CSS）
- **Image Optimization**: next/image
- **SEO**: Metadata API
- **Source Control**: GitHub
- **CI/CD**: GitHub Actions
- **Testing**: Jest + React Testing Library
- **CDN / Security**: Cloudflare（設計想定）

---

## 📄 主な機能（MVP）

- 記事一覧ページ
- 記事詳細ページ
- カテゴリ別一覧
- CMSからの記事管理・更新
- ISRを用いた更新反映
- 基本的なSEO対応

---

## 🗂 ページ構成（予定）

- `/` : トップページ
- `/posts` : 記事一覧
- `/posts/[slug]` : 記事詳細
- `/categories/[slug]` : カテゴリ別記事一覧

---

## 🧠 設計方針（概要）

- **レンダリング戦略**
  - 基本は SSG
  - 更新頻度を考慮し ISR を採用
- **CMS設計**
  - 記事・カテゴリを分離
  - 運用しやすいコンテンツモデルを意識
- **パフォーマンス**
  - 画像最適化
  - キャッシュ前提の設計
- **運用**
  - CMS更新 → 一定時間後に反映
  - 将来的にWebhookによるオンデマンド再生成も想定

---

## 🚀 開発環境セットアップ

```bash
yarn install
yarn dev
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
