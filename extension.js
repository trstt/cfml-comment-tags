// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
let vscode = require('vscode');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "cfml-comment-tags" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.cfml-comment-tags', function () {
        // The code you place here will be executed every time your command is executed
        var editor = vscode.window.activeTextEditor;
        if (editor != undefined) {
            var selection = editor.selection;
            var selectedText = editor.document.getText(selection);
            if (selectedText.search('<!--- ') == 0 && selectedText.search(' --->') != -1) {
                editor.edit(function (editBuilder) {
                    editBuilder.replace(selection, selectedText.substring(6, selectedText.length - 5));
                }, function (err) {
                    console.error(err);
                });
            }
            else if (selectedText.search('<!---') == 0 && selectedText.search('--->') != -1) {
                editor.edit(function (editBuilder) {
                    editBuilder.replace(selection, selectedText.substring(5, selectedText.length - 4));
                }, function (err) {
                    console.error(err);
                });
            } else if (selectedText.length == 0) {
                editor.edit(function (editBuilder) {
                    editBuilder.replace(selection, '<!---  --->');
                }).then(function () {
                    editor.selection = new vscode.Selection(selection.start.line, selection.start.character + 6, selection.start.line, selection.start.character + 6);
                }, function (err) {
                    console.error(err);
                });
            }
            else {
                editor.edit(function (editBuilder) {
                    editBuilder.insert(new vscode.Position(selection.end.line, selection.end.character), ' --->');
                    editBuilder.insert(new vscode.Position(selection.start.line, selection.start.character), '<!--- ');
                }).then(function () {
                    if (selection.end.line > selection.start.line) {
                        editor.selection = new vscode.Selection(selection.start.line, selection.start.character, selection.end.line, selection.end.character + 5);
                    }
                    else {
                        editor.selection = new vscode.Selection(selection.start.line, selection.start.character, selection.end.line, selection.end.character + 11);
                    }
                });
            }
        };
    });
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;