# PR File Search

[English](#english) | [日本語](#日本語)

---

<a name="english"></a>
# PR File Search

PR File Search is a Visual Studio Code extension that allows you to quickly search and open files that are part of your current branch changes compared to the main branch.

## Features

- Quickly access files changed in the current branch compared to the main branch
- Custom keybinding to activate the search functionality
- Works with local Git repositories
- Includes staged, unstaged, and new files in the search
- Excludes deleted files from the search results
- Fast performance by using local Git operations

## Requirements

- Visual Studio Code v1.60.0 or higher
- Git must be installed and accessible from the command line
- The workspace must be a Git repository

## Installation

https://marketplace.visualstudio.com/items?itemName=KeisukeTerada.pr-file-search

## Usage

1. Open a folder containing a Git repository in VS Code.
2. Checkout the branch with your changes.
3. Use the keyboard shortcut `Cmd+Ctrl+P` on macOS or `Ctrl+Alt+P` on Windows/Linux to activate the file search.
4. Select a file from the list to open it.

## Extension Settings

This extension doesn't add any VS Code settings.

## Known Issues

- The extension assumes that your main branch is named either 'main' or 'master'. If your repository uses a different name for the main branch, the extension may not work as expected.
- The extension compares your current branch with the local main branch. If your local main branch is not up to date with the remote, the results may differ from what you see on GitHub or other remote repositories.

## Release Notes

### 0.1.2

- Excluded deleted files from search results
- Improved handling of newly added files, including untracked files

### 0.1.0

- Updated to use local Git operations for faster performance
- Now includes staged, unstaged, and new files in the search
- Removed caching mechanism as it's no longer necessary due to improved performance

### 0.0.9

- Initial release of PR File Search

## Feedback and Contributions

If you encounter any issues or have suggestions for improvements, please report them on the [GitHub issues page](https://github.com/keisuke2236/pr-file-search/issues).
Pull requests are welcome!

## License

This project is licensed under the [MIT License](LICENSE).

---

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

---

<a name="日本語"></a>
# PR File Search

PR ファイル検索は、現在のブランチの変更をメインブランチと比較して、変更されたファイルを素早く検索し開くことができる Visual Studio Code 拡張機能です。

## 機能

- メインブランチと比較して、現在のブランチで変更されたファイルに素早くアクセス
- 検索機能を起動するためのカスタムキーバインディング
- ローカルの Git リポジトリで動作
- ステージされたファイル、ステージされていないファイル、新規ファイルを検索対象に含む
- 削除されたファイルを検索結果から除外
- ローカルの Git 操作を使用した高速なパフォーマンス

## 要件

- Visual Studio Code v1.60.0 以上
- Git がインストールされ、コマンドラインからアクセス可能であること
- ワークスペースが Git リポジトリであること

## インストール

公開されております、こちらからインストールを行ってください  
https://marketplace.visualstudio.com/items?itemName=KeisukeTerada.pr-file-search


## 使用方法

1. VS Code で Git リポジトリを含むフォルダを開きます。
2. 変更を含むブランチにチェックアウトします。
3. macOS では `Cmd+Ctrl+P`、Windows/Linux では `Ctrl+Alt+P` のキーボードショートカットを使用してファイル検索を起動します。
4. リストからファイルを選択して開きます。

## 拡張機能の設定

この拡張機能は VS Code に設定を追加しません。

## 既知の問題

- この拡張機能は、メインブランチの名前が 'main' または 'master' であることを前提としています。リポジトリがメインブランチに異なる名前を使用している場合、拡張機能が期待通りに動作しない可能性があります。
- この拡張機能は、現在のブランチをローカルのメインブランチと比較します。ローカルのメインブランチがリモートの最新状態と同期していない場合、結果が GitHub や他のリモートリポジトリで見られるものと異なる可能性があります。

## リリースノート

### 0.1.2

- 削除されたファイルを検索結果から除外
- 新規追加ファイルの扱いを改善（未追跡のファイルも含む）

### 0.1.0

- ローカルの Git 操作を使用してパフォーマンスを向上
- ステージされたファイル、ステージされていないファイル、新規ファイルを検索対象に含むように更新
- パフォーマンス向上により、キャッシュメカニズムを削除

### 0.0.9

- PR ファイル検索の初回リリース

## フィードバックと貢献

問題が発生した場合や改善の提案がある場合は、[GitHub の issues ページ](https://github.com/keisuke2236/pr-file-search/issues)で報告してください。
プルリクエストも歓迎します！

## ライセンス

このプロジェクトは [MIT ライセンス](LICENSE)の下でライセンスされています。

---

## 詳細情報

* [Visual Studio Code のマークダウンサポート](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown 構文リファレンス](https://help.github.com/articles/markdown-basics/)

**お楽しみください！**
