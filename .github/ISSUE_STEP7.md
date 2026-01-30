## 概要
エラーハンドリングと最低限のUXを整備します。404ページ・エラーフォールバック・ローディング表示・ヘッダーナビの整備を行います。

## タスク

### 404ページ（app/not-found.tsx）
- [x] `app/not-found.tsx` を新規作成
- [x] 「404 - ページが見つかりません」等のメッセージを表示
- [x] トップページへ戻るリンク（`/`）を配置
- [x] 既存の `container` クラスを利用し、読みやすさを確保

### エラーフォールバック（app/error.tsx）
- [x] `app/error.tsx` を新規作成
- [x] `'use client'` を指定（Client Component が必須）
- [x] `error` と `reset` を props で受け取り、エラー時に表示
- [x] 「再試行」ボタン（`reset()` 呼び出し）を配置
- [x] トップページへ戻るリンクを配置
- [x] `useEffect` で `console.error` にエラーを出力

### ローディング表示（任意）
- [x] `app/loading.tsx` を追加（ルートのローディングUI）
- [x] ページ配下の `loading.tsx`（例: `app/posts/loading.tsx`）は任意

### ヘッダーナビ（app/layout.tsx）
- [x] ヘッダーに `/`（トップ）・`/posts`（記事一覧）のリンクを配置
- [x] `<a>` を `Link` に変更し、クライアントサイドナビゲーションを有効化
- [x] ロゴ部分も `Link` で `/` にリンク

### スタイル
- [x] CSS は最小限（読みやすさ優先）
- [x] 既存の `container` や `post-card-link` を再利用
- [x] dx-consultant.co.jp を参考に Noto Sans JP を導入、`.error-reset-btn` を追加

### 動作確認
- [x] 存在しないURLで 404 ページが表示されることを確認
- [x] エラー発生時に error.tsx のフォールバックが表示されることを確認
- [x] ヘッダーのリンクが `/` と `/posts` に正しく遷移することを確認
- [x] `yarn build` が成功することを確認

## 実装内容

### 1. app/not-found.tsx
- シンプルなメッセージと「トップページへ戻る」リンク
- `container` クラスでレイアウト

### 2. app/error.tsx
- `'use client'` 必須
- `error`, `reset` を props で受け取り
- 再試行ボタンとトップページリンク
- `useEffect` でエラーログ出力

### 3. app/loading.tsx
- 「読み込み中...」等の簡易表示

### 4. app/layout.tsx
- `Link` をインポート
- ロゴ・トップ・記事一覧を `Link` に変更
- `next/font/google` で Noto Sans JP を導入（dx-consultant 風 UI）

## 完了条件
- [x] `not-found.tsx` が作成され、404 時に表示される
- [x] `error.tsx` が作成され、エラー時にフォールバック表示される
- [x] `loading.tsx` が追加されている（任意）
- [x] ヘッダーに `/` と `/posts` のリンクが配置されている
- [x] 手動テストで要件を満たすことが確認されている

## 関連ファイル
- app/not-found.tsx ✅ 作成済み
- app/error.tsx ✅ 作成済み
- app/loading.tsx ✅ 作成済み
- app/layout.tsx ✅ 更新済み（Link、Noto Sans JP）
- app/globals.css ✅ `.error-reset-btn` 追加

## 備考
- CSS は最小限に留め、読みやすさを優先する
- `error.tsx` は App Router の仕様により Client Component が必須
- **動作確認済み**: 404・エラーフォールバック・ヘッダーナビ・yarn build を確認済み
- **UI調整**: dx-consultant.co.jp を参考に Noto Sans JP を導入
