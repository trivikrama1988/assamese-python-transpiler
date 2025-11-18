const vscode = require('vscode');
function activate(context) {
    let disposable = vscode.commands.registerCommand('test.hello', function () {
        vscode.window.showInformationMessage('Hello World!');
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() {}
exports.deactivate = deactivate;