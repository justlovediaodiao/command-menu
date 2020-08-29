// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var terminal = null;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    var last_input = null;
    var last_pick = null;
    // register command
    var disposable = vscode.commands.registerCommand('commandMenu.runCommand', async commandContext => {
        // get file path from event arg or current active text editor
        var path = null;
        if (commandContext) {
            path = commandContext.path || commandContext._resourceUri.path;
        } else {
            var editor = vscode.window.activeTextEditor;
            if (editor && !editor.document.isUntitled) {
                path = editor.document.fileName;
            }
        }
        if (!path) {
            return
        }
        // get terminal
        var t = terminal || vscode.window.activeTerminal;
        if (!t) {
            terminal = vscode.window.createTerminal('command');
            t = terminal;
        }
        // get command to run
        var config = vscode.workspace.getConfiguration('commandMenu');
        var commands = config.commands;
        var command = null;
        if (commands.length == 0) {
            var option = {placeHolder: 'input a command to run', value: last_input ? last_input : ''};
            command = await vscode.window.showInputBox(option);
            if (command) {
                last_input = command
            }
        } else {
            if (commands.length == 1) {
                command = commands[0].command;
            } else {
                var items = commands.map(c => { return {label: c.name || '', description: c.command} });
                if (last_pick) {
                    // put last pick to first
                    var index = items.findIndex(i => i.label == last_pick);
                    if (index > 0) {
                        var first = items[index];
                        for (i = index; i > 0; i--) {
                            items[i] = items[i-1];
                        }
                        items[0] = first;
                    }
                }
                var item = await vscode.window.showQuickPick(items, {placeHolder: 'select a command to run'});
                if (item) {
                    last_pick = item.label;
                    command = item.description;
                }
            }
        }
        if (command) {
            command = command.replace('{}', `"${path}"`)
            t.show();
            t.sendText(command);
        }
    });
    // set to undefined when terminal closed
    vscode.window.onDidCloseTerminal(t => {
        if (t == terminal) {
            terminal = null;
        }
    })

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
    if (terminal) {
        terminal.dispose();
        terminal = null;
    }
}
exports.deactivate = deactivate;
