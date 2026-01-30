---
name: Step6 トップページ
about: トップページ / の実装（最新posts＋カテゴリ導線）
title: 'Step6: トップページ / の実装（最新posts＋カテゴリ導線）'
labels: 'enhancement, step6'
assignees: ''
---

## 概要
トップページ `/` を実装します。最新記事・カテゴリ一覧・「すべての記事」リンクを表示し、サイト内の主要導線を確保します。

## タスク

### ページ実装（app/page.tsx）
- [ ] `app/page.tsx` を更新（Server Component に変更）
- [ ] 最新記事を数件（例: 5件）取得して表示（`PostCard` を再利用）
- [ ] `categories` を取得して一覧表示（カテゴリリンクは `/categories/[slug]`）
- [ ] 「すべての記事」リンク（`/posts`）を配置
- [ ] `export const revalidate = 60` を設定し、ISRを有効化

### データ取得
- [ ] `getPosts({ limit: 5 })` で最新5件の記事を取得
- [ ] `getCategories()` でカテゴリ一覧を取得
- [ ] `Promise.all` で posts と categories を並列取得し、パフォーマンスを最適化

### 型・クエリの利用
- [ ] `Post` / `Category` 型（`types/microcms.ts`）を利用して型安全に実装
- [ ] `lib/microcms/queries.ts` の `getPosts` / `getCategories` を利用

### 動作確認
- [ ] トップページ `/` にアクセスして、最新記事・カテゴリ・「すべての記事」リンクが表示されることを確認
- [ ] カテゴリリンクをクリックして `/categories/[slug]` に遷移することを確認
- [ ] 「すべての記事」リンクをクリックして `/posts` に遷移することを確認
- [ ] 記事が0件・カテゴリが0件の場合の表示を確認
- [ ] `yarn build` が成功することを確認

## 完了条件
- [ ] トップページに最新記事が表示されている
- [ ] トップページにカテゴリ一覧が表示され、各カテゴリが `/categories/[slug]` にリンクしている
- [ ] 「すべての記事」リンクが `/posts` に遷移する
- [ ] ISR（`revalidate: 60`）が設定されている
- [ ] 手動テストで要件を満たすことが確認されている

## 関連ファイル
- app/page.tsx（更新）
- lib/microcms/queries.ts（`getPosts` / `getCategories` 利用）
- types/microcms.ts（`Post` / `Category` 型）
- components/PostCard.tsx（再利用）

## 備考
- 過剰な抽象化は避け、MVPとしてトップページの導線を最短で実装することを目的とする
- `PostCard` をそのまま再利用し、一覧ページとの一貫性を保つ
