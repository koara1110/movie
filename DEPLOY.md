# 本番環境への反映手順（ターミナル）

このドキュメントは、**このフォルダ `movie-boxoffice-ui` が Git リポジトリのルート**である前提で、PowerShell から GitHub に push し、連携している本番ホスティング（例: Vercel）へ反映するまでの手順です。

> **重要:** 親フォルダ（例: `movie-project`）や、それより上の階層で `git` コマンドを実行しないでください。別の Git 作業ツリーとして認識され、意図しない場所にコミットされることがあります。必ず **`movie-boxoffice-ui` に移動してから** 操作してください。

---

## 1. 前提チェックリスト

作業前に次を確認してください。

- **Node.js** がインストールされている（任意確認: `node -v`）。
- ターミナルのカレントディレクトリが **`movie-boxoffice-ui`** である（後述の `Set-Location`）。
- **GitHub** の該当リポジトリへ push する権限がある（HTTPS の場合はサインイン済み、または Personal Access Token など）。
- 本番が **GitHub の `main` ブランチ**と連携している（例: Vercel の Project → Git で `koara1110/movie` の `main` を参照していること）。リモート URL の確認: `git remote -v`（通常 `https://github.com/koara1110/movie.git`）。

---

## 2. 作業ディレクトリへ移動（PowerShell）

エクスプローラーでこのプロジェクトを開いている場合、パスは環境によって異なります。次は **例** です。ご自身の OneDrive / デスクトップ上のパスに読み替えてください。

```powershell
Set-Location "C:\Users\junya\OneDrive\デスクトップ\movie-project\movie-boxoffice-ui"
```

移動できたか確認します。

```powershell
Get-Location
git status
```

`git status` が「リポジトリ外」などのエラーにならず、ブランチ名（例: `main`）が表示されれば問題ありません。

---

## 3. （推奨）ローカルでビルド確認

push 前にビルドが通るか確認すると、本番ビルド失敗を減らせます。

依存パッケージを初回導入したとき、または `package.json` を変更したあと:

```powershell
npm install
```

ビルドの実行:

```powershell
npm run build
```

エラーが出た場合は、修正してから次の「コミットと push」に進んでください。

---

## 4. 変更のコミットと push（本番反映の本体）

### 4.1 差分の確認

```powershell
git status
```

### 4.2 ステージング

特定のファイルだけ追加する例:

```powershell
git add app/page.tsx
```

すべての変更をまとめて追加する例:

```powershell
git add .
```

### 4.3 コミット

コミットメッセージは英語でも日本語でも構いません。

```powershell
git commit -m "変更内容の短い説明"
```

変更がない場合は `git commit` は不要です。

### 4.4 リモートへ push（本番トリガー）

```powershell
git push origin main
```

初めてこのリポジトリで作業する場合、ローカル `main` が `origin/main` を追跡しているか確認できます。

```powershell
git branch -vv
```

`main` の右側に `[origin/main]` のように表示されていれば、通常は `git push` だけで問題ありません。

---

## 5. 本番の確認

1. **Vercel**（または利用中のホスティング）のダッシュボードを開き、**Deployments** で最新のデプロイが **Ready**（成功）になるまで待ちます。
2. 本番 URL（例: Vercel が割り当てたドメイン）をブラウザで開き、表示と動作を確認します。

---

## 6. 環境変数（API が動くために必須）

`/api/movie` は The Movie Database（TMDB）を呼び出すため、本番環境に次の変数が必要です。

| 名前 | 説明 |
|------|------|
| `TMDB_API_KEY` | TMDB の API Read Access Token（Bearer として使用） |

Vercel の場合: **Project → Settings → Environment Variables** で `TMDB_API_KEY` を **Production** に設定してください。追加・変更したあと、**Redeploy** が必要なことがあります（画面の案内に従ってください）。

---

## 7. よくあるつまずき

| 現象 | 対処のヒント |
|------|----------------|
| `git push` で認証エラー | GitHub の HTTPS 認証（ブラウザログイン、Credential Manager、PAT）を確認してください。 |
| `git status` が別の巨大なツリーになる | カレントディレクトリが `movie-boxoffice-ui` か再確認してください。 |
| `npm run build` が失敗する | エラーメッセージを修正してから push してください。本番でも同じ失敗をします。 |
| 本番でランキングが読み込めない | `TMDB_API_KEY` が Production に設定されているか、Vercel のデプロイログで API エラーが出ていないか確認してください。 |

---

## 参考: 今回の運用の流れ

```text
ローカルで編集 → npm run build（任意） → git add / commit → git push origin main
    → GitHub 更新 → Vercel が自動ビルド → 本番 URL 更新
```

質問や運用の変更（別ブランチ、PR 経由のみ本番など）がある場合は、チームのルールに合わせてこの手順を調整してください。
