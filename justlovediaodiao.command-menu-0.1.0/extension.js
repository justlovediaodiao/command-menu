// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
let vscode = require('vscode');
let terminal = null;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    let last_input = null;
    let last_pick = null;
    // register command
    let disposable = vscode.commands.registerCommand('commandMenu.runCommand', async commandContext => {
        // get file path from event arg or current active text editor
        let path = null;
        if (commandContext) {
            path = commandContext.path || commandContext._resourceUri.path;
        } else {
            let editor = vscode.window.activeTextEditor;
            if (editor && !editor.document.isUntitled) {
                path = editor.document.fileName;
            }
        }
        if (!path) {
            return;
        }
        // get terminal
        let t = terminal || vscode.window.activeTerminal;
        if (!t) {
            terminal = vscode.window.createTerminal('command');
            t = terminal;
        }
        // get command to run
        let config = vscode.workspace.getConfiguration('commandMenu');
        let commands = config.commands;
        let command = null;
        if (commands.length == 0) {
            let option = {placeHolder: 'input a command to run', value: last_input ? last_input : ''};
            command = await vscode.window.showInputBox(option);
            if (command) {
                last_input = command;
            }
        } else {
            if (commands.length == 1) {
                command = commands[0].command;
            } else {
                let items = commands.map(c => { return {label: c.name || '', description: c.command} });
                if (last_pick) {
                    // put last pick to first
                    let index = items.findIndex(i => i.label == last_pick);
                    if (index > 0) {
                        let first = items[index];
                        for (i = index; i > 0; i--) {
                            items[i] = items[i-1];
                        }
                        items[0] = first;
                    }
                }
                let item = await vscode.window.showQuickPick(items, {placeHolder: 'select a command to run'});
                if (item) {
                    last_pick = item.label;
                    command = item.description;
                }
            }
        }
        if (command) {
            command = command.replace(/\{\}/g, `"${path}"`);
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
