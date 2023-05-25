// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const builtinFileTypes: Array<[string, string | vscode.FileType]> = Object.entries(vscode.FileType)
    .filter(i => !Number.isNaN(Number.parseInt(i[0]))).sort((x, y) => Number.parseInt(y[0]) - Number.parseInt(x[0]));

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    // console.log('Congratulations, your extension "file-counter" is now active!');

    const disposable = vscode.window.onDidChangeActiveTextEditor(async event => {
        if (event) {
            const res = await vscode.workspace.fs.readDirectory(vscode.Uri.joinPath(event.document.uri, '..'));
            vscode.window.setStatusBarMessage(countFiles(res));
        }
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }

function countFiles(list: Array<[string, vscode.FileType]>): string {
    return builtinFileTypes
        .map(i => ({ type: i[1], count: list.filter(r => r[1].toString() === i[0]).length }))
        .filter(i => i.count > 0)
        .map(i => `${getFileTypeIcon(i.type as string)} ${i.count}`)
        .join(' ');
}

function getFileTypeIcon(fileType: string): string {
    const fileTypes: Array<string> = builtinFileTypes.map(i => i[1] as string);

    if (!fileTypes.includes(fileType)) {
        return '$(question)';
    } else {
        switch (fileType) {
            case 'Unknown':
                return '$(question)';
            case 'File':
                return '$(file)';
            case 'Directory':
                return '$(folder)';
            case 'SymbolicLink':
                return '$(file-symlink-file)';
            default:
                return '$(files)';
        }
    }
}
