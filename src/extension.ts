/*
 * The module 'vscode' contains the VS Code extensibility API
 * Import the module and reference it with the alias vscode in your code below
 */
import * as vscode from 'vscode';

const builtinFileTypes: Array<[string, string | vscode.FileType]> = Object.entries(vscode.FileType)
    .filter(i => !Number.isNaN(Number.parseInt(i[0], 10))).sort((x, y) => Number.parseInt(y[0], 10) - Number.parseInt(x[0], 10));

function getFileTypeIcon(fileType: string): string {
    const fileTypes: Array<string> = builtinFileTypes.map(i => i[1] as string);
    if (fileTypes.includes(fileType)) {
        switch (fileType) {
            case 'Unknown':
                return '$(question)';
            case 'File':
                return '$(files)';
            case 'Directory':
                return '$(file-submodule)';
            case 'SymbolicLink':
                return '$(file-symlink-file)';
            default:
                return '$(files)';
        }
    } else {
        return '$(question)';
    }
}

function countFiles(dirList: Array<[string, vscode.FileType]>): string {
    return builtinFileTypes
        .map(i => ({ type: i[1], count: dirList.filter(dir => dir[1].toString() === i[0]).length }))
        .filter(i => i.count > 0)
        .map(i => `${getFileTypeIcon(i.type as string)} ${i.count}`)
        .join(' ');
}

/*
 * this method is called when your extension is activated
 * your extension is activated the very first time the command is executed
 */
export function activate(context: vscode.ExtensionContext): void {
    /*
     * Use the console to output diagnostic information (console.log) and errors (console.error)
     * This line of code will only be executed once when your extension is activated
     * console.log('Congratulations, your extension "file-counter" is now active!');
     */
    const editorChangeDisposable: vscode.Disposable = vscode.window.onDidChangeActiveTextEditor(async event => {
        if (event) {
            const dirList: Array<[string, vscode.FileType]> = await vscode.workspace.fs.readDirectory(vscode.Uri.joinPath(event.document.uri, '..'));
            vscode.window.setStatusBarMessage(countFiles(dirList));
        }
    });

    context.subscriptions.push(editorChangeDisposable);
}
