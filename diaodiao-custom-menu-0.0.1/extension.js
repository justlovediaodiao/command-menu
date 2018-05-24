// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var terminal = undefined;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // register command
    var disposable = vscode.commands.registerCommand('custom.customCommand', function (commandContext) {
        // get file path from event arg or current active text editor
        var path = undefined;
        if (commandContext) {
            path = commandContext.path || commandContext._resourceUri.path
        }
        else {
            var editor = vscode.window.activeTextEditor;
            if (editor && !editor.document.isUntitled) {
                path = editor.document.fileName;
            }
        }
        if (path) {
            // get terminal
            if (!terminal) {
                terminal = vscode.window.createTerminal("custom");
            }
            terminal.show();
            // get command to run
            config = vscode.workspace.getConfiguration('custommenu')
            command = config && config.command
            if (!command) {
                command = "echo 'no command to run'"
            }
            else {
                command = command + " " + path
            }
            terminal.sendText(command);
        }
    });
    // set to undefined when terminal closed
    vscode.window.onDidCloseTerminal(function (terminal_1) {
        if (terminal_1 == terminal) {
            terminal = undefined;
        }
    })

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
    if (terminal) {
        terminal.dispose()
        terminal = undefined;
    }
}
exports.deactivate = deactivate;
