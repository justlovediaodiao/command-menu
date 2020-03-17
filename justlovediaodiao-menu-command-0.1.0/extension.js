// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var terminal = undefined;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // register command
    var disposable = vscode.commands.registerCommand('commandMenu.runCommand', async commandContext => {
        // get file path from event arg or current active text editor
        var path = undefined;
        if (commandContext) {
            path = commandContext.path || commandContext._resourceUri.path;
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
                terminal = vscode.window.createTerminal("command");
            }
            // get command to run
            var config = vscode.workspace.getConfiguration('commandMenu');
            var commands = config.commands;
            if (commands.length == 0) {
                var command = await vscode.window.showInputBox({placeHolder: 'input a command to run'});
                if (command) {
                    terminal.show();
                    terminal.sendText(command + " " + path)
                }
            }
            else {
                var command;
                if (commands.length == 1) {
                    command = commands[0]
                } else {
                    command = await vscode.window.showQuickPick(commands.map(c => {return {label: c.name, description: c.command, command: c.command}}), 
                                                                {placeHolder: 'select a command to run'});
                }
                if (command) {
                    terminal.show();
                    terminal.sendText(command.command + " " + path);
                }
            }
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
        terminal.dispose();
        terminal = undefined;
    }
}
exports.deactivate = deactivate;
