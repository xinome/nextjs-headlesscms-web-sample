## 概要

本リポジトリでは microCMS + Next.js (App Router) を用いたブログ実装を進めているが、現状は手動テストが中心であり、自動テストや CI が整備されていない。

入社予定企業で歓迎されている以下のスキルセットに近づけるため、テスト自動化と CI をこのプロジェクトに導入する。

- テスト自動化（Jest、TestingLibrary等）の経験
- CI/CD環境（GitHubActions等）の設計・運用経験

## ゴール

- Jest + Testing Library を用いたユニット / コンポーネントテストの基盤を整備する
- 既存実装（特に `PostCard` などの UI コンポーネント）に対してテストを追加する
- GitHub Actions による CI ワークフローを構築し、`lint` / `test` / `build` を自動実行できる状態にする

## 対象

- テストフレームワーク: Jest
- UI テストライブラリ: React Testing Library
- CI: GitHub Actions
- 対象コード: 以下を含むプロジェクト全体
  - `components/PostCard.tsx`
  - `lib/microcms/` 配下のクエリ関数
  - `app/posts` / `app/posts/[slug]` / `app/categories/[slug]` などのページ

## タスク

### 1. テスト基盤の整備（Jest + Testing Library）

- [x] `jest` / `@testing-library/react` / `@testing-library/jest-dom` / `@testing-library/user-event` など必要パッケージを devDependencies に追加
- [x] `jest.config.*` を作成し、`testEnvironment: 'jsdom'` や TypeScript トランスフォーム設定を行う
- [x] `jest.setup.*` を作成し、`@testing-library/jest-dom` のセットアップを行う
- [x] `package.json` に `test` / `test:watch` スクリプトを追加

### 2. PostCard コンポーネントのテスト実装

- [x] `docs/testing-PostCard.md` に基づき、`__tests__/components/PostCard.test.tsx` を作成
- [x] 公開日ロジック（`publishedAt` / `createdAt`）のテストを追加
- [x] カテゴリ表示・カテゴリリンク（`/categories/[slug]`）のテストを追加
- [x] タイトルリンク（`/posts/[slug]`）のテストを追加
- [x] 抜粋（`excerpt`）の有無による表示切り替えのテストを追加
- [x] アイキャッチ画像（`eyecatch`）有無の表示切り替えと `alt` テキストのテストを追加

### 3. microCMS クエリ関数のユニットテスト

- [x] `lib/microcms/client.ts` のクライアントを Jest でモックする仕組みを用意
- [x] `lib/microcms/queries.ts` に対して、以下の観点のテストを追加
  - [x] `getPosts` が正しいエンドポイント・クエリパラメータで呼ばれる
  - [x] `getPostBySlug` が slug フィルタ + limit=1 で呼ばれる
  - [x] `getCategoryBySlug` / `getPostsByCategoryId` のクエリが期待どおりである

### 4. 主要ページの軽量テスト

- [x] `/posts` 一覧ページが `getPosts` 結果を用いて `PostCard` をレンダリングできることを確認するテストを追加
- [x] `/posts/[slug]` 詳細ページで `notFound()` パスを含めた基本的な分岐がテストできるようにする（必要に応じてモック）
- [x] `/categories/[slug]` ページに対しても同様に、`getCategoryBySlug` / `getPostsByCategoryId` の呼び出しと分岐をテスト

### 5. GitHub Actions による CI 構築

- [x] `.github/workflows/ci.yml`（名称仮）を作成
- [x] Node.js のバージョンをプロジェクトに合わせて指定
- [x] `yarn install --frozen-lockfile` による依存関係インストール
- [x] `yarn lint` / `yarn test` / `yarn build` を CI 上で実行
- [x] microCMS 用の環境変数（`MICROCMS_SERVICE_DOMAIN` / `MICROCMS_API_KEY`）を GitHub Secrets に設定し、`yarn build` 時に参照

### 6. ドキュメント整備

- [x] `README.md` にテスト実行方法（`yarn test`）と CI ワークフローの概要を追記
- [x] 必要に応じて `docs/` 配下にテストポリシーや今後の拡張方針を追記

## 補足

- 当面は Jest + Testing Library によるユニット / コンポーネントテストを中心とし、E2E テスト（Playwright 等）は別 Issue で検討する。
- まずは `PostCard` など「最下層コンポーネント」からテストを追加し、徐々に上位レイヤー（ページ・クエリ関数）へと範囲を広げていく方針とする。
