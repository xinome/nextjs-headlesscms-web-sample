## 実装完了

全タスクの実装が完了しました。

### 完了したタスク

1. **テスト基盤（Jest + Testing Library）**
   - jest.config.cjs / jest.setup.ts を追加
   - package.json に test / test:watch スクリプト、devDependencies を追加

2. **PostCard コンポーネントのテスト**
   - `__tests__/components/PostCard.test.tsx` を追加（公開日・カテゴリ・タイトルリンク・抜粋の有無など）

3. **microCMS クエリ関数のユニットテスト**
   - `__tests__/lib/microcms/queries.test.ts` を追加（getCategories / getPosts / getPostBySlug / getCategoryBySlug / getPostsByCategoryId）

4. **主要ページのテスト**
   - `__tests__/app/posts/page.test.tsx`（一覧・0件・エラー時）
   - `__tests__/app/posts/[slug].page.test.tsx`（詳細表示・notFound・generateMetadata・generateStaticParams）
   - `__tests__/app/categories/[slug].page.test.tsx`（カテゴリ一覧・0件・notFound・generateMetadata・generateStaticParams）

5. **GitHub Actions CI**
   - `.github/workflows/ci.yml` を追加（lint / test / build、main・develop の push/PR で実行）
   - Repository Secrets に MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY を設定済みで、develop・main への PUSH が問題なく通ることを確認済み

6. **ドキュメント整備**
   - README.md にテスト実行方法（yarn test）と CI ワークフローの概要を追記

E2E テストは別 Issue で検討する方針のため、本 Issue はクローズします。
