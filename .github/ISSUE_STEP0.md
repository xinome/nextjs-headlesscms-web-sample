## 概要
Next.js（App Router）+ TypeScriptでプロジェクトの初期セットアップを実施します。

## タスク

### 設定ファイル
- [x] package.json を作成（Next.js 16.1.5 + React 19 + TypeScript）
- [x] tsconfig.json を作成（App Router対応）
- [x] next.config.js を作成
- [x] .gitignore を作成

### アプリケーション構成
- [x] app/layout.tsx を作成（ヘッダー/フッター含むルートレイアウト）
- [x] app/page.tsx を作成（トップページ最小構成）
- [x] app/globals.css を作成（グローバルスタイル）

### ディレクトリ構成
- [x] lib/microcms/ ディレクトリを作成
- [x] types/ ディレクトリを作成
- [x] components/ ディレクトリを作成

## 完了条件
- [x] npm install が正常に実行できる
- [x] npm run dev で開発サーバーが起動する
- [x] http://localhost:3000 でページが表示される
- [x] ヘッダー/フッターが正しく表示される

## 技術スタック
- Next.js: 16.1.5
- React: 19.0.0
- TypeScript: 5.6.0

## 関連ファイル
- package.json
- tsconfig.json
- next.config.js
- .gitignore
- app/layout.tsx
- app/page.tsx
- app/globals.css
- lib/microcms/
- types/
- components/

## 備考
- 過剰な抽象化を避け、MVPを最短で動かす方針
- 以降の実装で使用するディレクトリを事前に作成済み
