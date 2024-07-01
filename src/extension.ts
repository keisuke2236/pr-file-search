import * as vscode from 'vscode';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('pr-file-search.search', async () => {
    try {
      const repoRoot = await getGitRepositoryRoot();
      if (!repoRoot) {
        vscode.window.showErrorMessage('Git リポジトリが見つかりません。VSCodeで Git リポジトリを含むフォルダを開いているか確認してください。');
        return;
      }

      const files = await getPRChangedFiles(repoRoot);
      if (files.length === 0) {
        vscode.window.showInformationMessage('変更されたファイルが見つかりません。');
        return;
      }

      const quickPick = vscode.window.createQuickPick();
      quickPick.items = files.map(file => ({ label: file }));
      quickPick.placeholder = 'ファイルを選択、または検索キーワードを入力してください';

      quickPick.onDidChangeValue(value => {
        const keywords = value.toLowerCase().split(/\s+/).filter(k => k !== '');
        if (keywords.length > 0) {
          const sortedFiles = searchAndSortFiles(files, keywords);
          quickPick.items = sortedFiles.map(file => ({ label: file }));
        } else {
          quickPick.items = files.map(file => ({ label: file }));
        }
      });

      quickPick.onDidAccept(async () => {
        const selectedItem = quickPick.selectedItems[0];
        if (selectedItem) {
          await openFile(repoRoot, selectedItem.label);
        }
        quickPick.hide();
      });

      quickPick.show();
    } catch (error) {
      if (error instanceof Error) {
        vscode.window.showErrorMessage(`エラーが発生しました: ${error.message}`);
      } else {
        vscode.window.showErrorMessage('不明なエラーが発生しました。');
      }
    }
  });

  context.subscriptions.push(disposable);
}

function searchAndSortFiles(files: string[], keywords: string[]): string[] {
  return files.map(file => {
    const lowerFile = file.toLowerCase();
    const score = keywords.reduce((acc, keyword) => {
      // キーワードの部分一致をチェック
      if (lowerFile.includes(keyword)) {
        // ファイル名にキーワードが含まれる場合、より高いスコアを与える
        return acc + (path.basename(lowerFile).includes(keyword) ? 3 : 1);
      }
      // キーワードの各文字が順番に含まれているかチェック
      let lastIndex = -1;
      const allCharsIncluded = keyword.split('').every(char => {
        const index = lowerFile.indexOf(char, lastIndex + 1);
        if (index > lastIndex) {
          lastIndex = index;
          return true;
        }
        return false;
      });
      return acc + (allCharsIncluded ? 0.5 : 0);
    }, 0);
    return { file, score };
  })
    .filter(item => item.score > 0) // スコアが0より大きいファイルのみを残す
    .sort((a, b) => b.score - a.score || a.file.localeCompare(b.file))
    .map(item => item.file);
}

async function getGitRepositoryRoot(): Promise<string | null> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('ワークスペースが開かれていません。');
    return null;
  }

  try {
    const { stdout } = await execAsync('git rev-parse --show-toplevel', {
      cwd: workspaceFolder.uri.fsPath,
        });
    return stdout.trim();
  } catch (error) {
    console.error('Git リポジトリのルートの取得に失敗しました:', error);
    return null;
  }
}

async function getPRChangedFiles(repoRoot: string): Promise<string[]> {
  try {
    // 現在のブランチ名を取得
    const { stdout: currentBranch } = await execAsync('git rev-parse --abbrev-ref HEAD', { cwd: repoRoot });

    // ローカルの main または master ブランチを確認
    let defaultBranch: string;
    try {
      await execAsync('git rev-parse --verify main', { cwd: repoRoot });
      defaultBranch = 'main';
    } catch {
      try {
        await execAsync('git rev-parse --verify master', { cwd: repoRoot });
        defaultBranch = 'master';
      } catch {
        throw new Error('ローカルに main または master ブランチが見つかりません。');
      }
    }

    // Git操作を実行
    const { stdout: diffOutput } = await execAsync(`
      MERGE_BASE=$(git merge-base ${defaultBranch} ${currentBranch.trim()}) &&
      git diff --name-status $MERGE_BASE ${currentBranch.trim()}
    `, { cwd: repoRoot });

    const { stdout: untrackedFiles } = await execAsync('git ls-files --others --exclude-standard', { cwd: repoRoot });

    // 変更されたファイルと新規ファイルを処理
    const changedFiles = diffOutput.split('\n')
      .filter(line => line.trim() !== '')
      .map(line => {
        const [status, file] = line.split('\t');
        return { status: status.trim(), file: file.trim() };
      })
      .filter(({ status }) => status !== 'D') // 削除されたファイルを除外
      .map(({ file }) => file);

    // 未追跡のファイルを追加
    const newFiles = untrackedFiles.split('\n').filter(file => file.trim() !== '');

    // 重複を除去して結果を返す
    return [...new Set([...changedFiles, ...newFiles])];
  } catch (error) {
    console.error('PR内の変更ファイルの取得に失敗しました:', error);
    if (error instanceof Error) {
      vscode.window.showErrorMessage(`PR内の変更ファイルの取得に失敗しました: ${error.message}`);
    }
    throw new Error('PR内の変更ファイルの取得に失敗しました。Git設定を確認してください。');
  }
}

async function openFile(repoRoot: string, filePath: string): Promise<void> {
  const fullPath = path.join(repoRoot, filePath);
  try {
    const document = await vscode.workspace.openTextDocument(vscode.Uri.file(fullPath));
    await vscode.window.showTextDocument(document);
  } catch (error) {
    vscode.window.showErrorMessage(`ファイルを開けませんでした: ${filePath}`);
  }
}

export function deactivate() { }
