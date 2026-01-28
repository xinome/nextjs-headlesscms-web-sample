## 概要
microCMS側に作成するスキーマを確定し、API設計とフィールド定義を整理します。

## タスク

### API設計
- [x] categories API のフィールド定義を確定
- [x] posts API のフィールド定義を確定
- [x] フィールドタイプと必須/任意の設定を決定
- [x] 参照関係（posts → categories）の設定を決定

### ドキュメント作成
- [x] microCMSスキーマ設計書を作成
- [x] microCMS管理画面での作業手順書を作成
- [x] slugのユニーク運用に関する注意点をまとめる

### Next.js側の実装
- [x] 型定義ファイルを作成（types/microcms.ts）
- [x] API呼び出し関数を作成（lib/microcms/client.ts）
- [x] 環境変数設定例ファイルを作成（.env.local.example）
- [x] .gitignoreで機密情報ファイルを除外設定

## API定義

### categories API
- name (必須)
- slug (必須、ユニーク)
- description (任意)
- order (任意)
- isActive (任意)

### posts API
- title (必須)
- slug (必須、ユニーク)
- excerpt (任意)
- content (必須、リッチエディタ)
- eyecatch (任意、画像)
- category (必須、categories参照)
- tags (任意)
- status (任意)
- seoTitle (任意)
- seoDescription (任意)
- noindex (任意)

## 完了条件
- [x] categories API のスキーマ設計が確定
- [x] posts API のスキーマ設計が確定
- [x] microCMS管理画面での作業手順書が完成
- [x] slugのユニーク運用に関する注意点が文書化されている
- [x] Next.js側の型定義とAPI呼び出し関数が実装済み
- [x] ローカルでのページプレビューが動作確認済み

## 関連ファイル
- docs/microcms-schema.md ✅ 作成済み
- docs/microcms-setup-guide.md ✅ 作成済み
- types/microcms.ts ✅ 作成済み
- lib/microcms/client.ts ✅ 作成済み
- .env.local.example ✅ 作成済み
- .gitignore ✅ 機密情報除外設定済み

## 備考
- 実装は過剰な抽象化を避け、MVPを最短で動かす方針
- 運用しやすいコンテンツモデルを意識
