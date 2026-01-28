## 概要
microCMS側に作成するスキーマを確定し、API設計とフィールド定義を整理します。

## タスク

### API設計
- [ ] categories API のフィールド定義を確定
- [ ] posts API のフィールド定義を確定
- [ ] フィールドタイプと必須/任意の設定を決定
- [ ] 参照関係（posts → categories）の設定を決定

### ドキュメント作成
- [ ] microCMSスキーマ設計書を作成
- [ ] microCMS管理画面での作業手順書を作成
- [ ] slugのユニーク運用に関する注意点をまとめる

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
- [ ] categories API のスキーマ設計が確定
- [ ] posts API のスキーマ設計が確定
- [ ] microCMS管理画面での作業手順書が完成
- [ ] slugのユニーク運用に関する注意点が文書化されている

## 関連ファイル
- docs/microcms-schema.md (新規作成)
- docs/microcms-setup-guide.md (新規作成)

## 備考
- 実装は過剰な抽象化を避け、MVPを最短で動かす方針
- 運用しやすいコンテンツモデルを意識
