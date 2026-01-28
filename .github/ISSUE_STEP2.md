## 概要
microCMS接続を実装します。microcms-js-sdkを導入し、型安全なクエリ関数を実装します。

## タスク

### 依存関係の追加
- [x] microcms-js-sdk を package.json に追加

### 型定義の更新
- [x] types/microcms.ts を更新（MicroCMSContentId / MicroCMSDate を活用）
- [x] SDKの型を適切にインポートして使用

### クライアント実装
- [x] lib/microcms/client.ts を更新（createClient を使用）
- [x] 環境変数の検証を実装

### クエリ関数の実装
- [x] lib/microcms/queries.ts を新規作成
- [x] getCategories() を実装
- [x] getPosts({ limit, offset }など拡張可能な形) を実装
- [x] getPostBySlug(slug) を実装
- [x] getCategoryBySlug(slug) を実装
- [x] getPostsByCategoryId(categoryId) を実装
- [x] 各関数でmicroCMSのクエリ（orders, filters等）を適切に使用
- [x] 型安全に実装

### 環境変数の確認
- [x] .env.local に MICROCMS_SERVICE_DOMAIN と MICROCMS_API_KEY が設定されていることを確認

## 実装内容

### 1. package.json
- `microcms-js-sdk` を dependencies に追加

### 2. types/microcms.ts
- SDKの `MicroCMSContentId`, `MicroCMSDate` を活用
- Category, Post 型を更新

### 3. lib/microcms/client.ts
- `createClient` を使用したクライアント実装
- 環境変数の検証

### 4. lib/microcms/queries.ts（新規）
- getCategories()
- getPosts({ limit, offset }など拡張可能)
- getPostBySlug(slug)
- getCategoryBySlug(slug)
- getPostsByCategoryId(categoryId)
- microCMSのクエリパラメータ（orders, filters, limit, offset, depth 等）を型付きで受け取る

## 完了条件
- [x] microcms-js-sdk がインストール済み
- [x] 型定義がSDKの型を活用している
- [x] クライアントが createClient を使用している
- [x] すべてのクエリ関数が実装済み
- [x] 各関数が型安全に実装されている
- [x] 環境変数が正しく設定されている
- [ ] 動作確認が完了している

## 関連ファイル
- package.json ✅ microcms-js-sdk 追加済み
- types/microcms.ts ✅ SDKの型を利用したCategory/Postを定義
- lib/microcms/client.ts ✅ createClientベースのクライアント実装
- lib/microcms/queries.ts ✅ 型安全なクエリ関数群を実装
- .env.local ✅ MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY を設定済み（ローカル動作確認前提）

## 備考
- 実装は過剰な抽象化を避け、MVPを最短で動かす方針
- 型安全性を重視
- microCMSのクエリパラメータ（orders, filters等）を適切に活用
