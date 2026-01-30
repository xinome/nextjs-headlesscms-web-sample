---
name: Step7 エラーハンドリングとUI整備
about: 404ページ・エラーフォールバック・ローディング・ヘッダーナビの整備
title: 'Step7: エラーハンドリングと最低限のUI整備'
labels: 'enhancement, step7'
assignees: ''
---

## 概要
エラーハンドリングと最低限のUXを整備します。404ページ・エラーフォールバック・ローディング表示・ヘッダーナビの整備を行います。

## タスク

### 404ページ（app/not-found.tsx）
- [ ] `app/not-found.tsx` を新規作成
- [ ] 「404 - ページが見つかりません」等のメッセージを表示
- [ ] トップページへ戻るリンク（`/`）を配置
- [ ] 既存の `container` クラスを利用し、読みやすさを確保

### エラーフォールバック（app/error.tsx）
- [ ] `app/error.tsx` を新規作成
- [ ] `'use client'` を指定（Client Component が必須）
- [ ] `error` と `reset` を props で受け取り、エラー時に表示
- [ ] 「再試行」ボタン（`reset()` 呼び出し）を配置
- [ ] トップページへ戻るリンクを配置
- [ ] `useEffect` で `console.error` にエラーを出力

### ローディング表示（任意）
- [ ] `app/loading.tsx` を追加（ルートのローディングUI）
- [ ] ページ配下の `loading.tsx`（例: `app/posts/loading.tsx`）は任意

### ヘッダーナビ（app/layout.tsx）
- [ ] ヘッダーに `/`（トップ）・`/posts`（記事一覧）のリンクを配置
- [ ] `<a>` を `Link` に変更し、クライアントサイドナビゲーションを有効化
- [ ] ロゴ部分も `Link` で `/` にリンク

### スタイル
- [ ] CSS は最小限（読みやすさ優先）
- [ ] 既存の `container` や `post-card-link` を再利用

### 動作確認
- [ ] 存在しないURLで 404 ページが表示されることを確認
- [ ] エラー発生時に error.tsx のフォールバックが表示されることを確認
- [ ] ヘッダーのリンクが `/` と `/posts` に正しく遷移することを確認
- [ ] `yarn build` が成功することを確認

## 完了条件
- [ ] `not-found.tsx` が作成され、404 時に表示される
- [ ] `error.tsx` が作成され、エラー時にフォールバック表示される
- [ ] `loading.tsx` が追加されている（任意）
- [ ] ヘッダーに `/` と `/posts` のリンクが配置されている
- [ ] 手動テストで要件を満たすことが確認されている

## 関連ファイル
- app/not-found.tsx（新規作成）
- app/error.tsx（新規作成）
- app/loading.tsx（新規作成・任意）
- app/layout.tsx（更新）

## 備考
- CSS は最小限に留め、読みやすさを優先する
- `error.tsx` は App Router の仕様により Client Component が必須
