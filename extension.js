// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

let disposable = vscode.commands.registerCommand('extension.autoVariable', function () {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        return;
    }

    const document = editor.document;
    const documentLineCounter = document.lineCount;

    const workspaceEdit = new vscode.WorkspaceEdit(); 

    for (let i = 0; i < documentLineCounter; i++) {

        let lineText = document.lineAt(i).text;
        if (lineText === '') { continue; }
        let colonPosition = lineText.indexOf(":");
        let semicolonPosition = lineText.indexOf(";");

        if (colonPosition !== -1 && semicolonPosition !== -1) {
            let variableType = lineText.substring(colonPosition + 1, semicolonPosition).trim();

            const alObjectTypes = ["Record", "Page", "Report", "Codeunit", "XMLport", "Query", "Enum", "DotNet"]; // AL Object Types

            for (let j = 0; j < alObjectTypes.length; j++) {
                if (variableType.startsWith(alObjectTypes[j])) {
                    let typeName = variableType.substring(alObjectTypes[j].length).trim();
                    let variableName = typeName.replace(/[\s".-/&]/g, "");

                    let startPosition = new vscode.Position(i, 0);
                    let endPosition = new vscode.Position(i, colonPosition);
                    let range = new vscode.Range(startPosition, endPosition);

                    workspaceEdit.replace(document.uri, range, `${variableName}`);
					//TODO: Rename References (F2)
				}
            }
        }
    }

    vscode.workspace.applyEdit(workspaceEdit).then(success => {
        if (success) {
            document.save();
        } else {
            vscode.window.showErrorMessage('Fehler');
        }
    });
	context.subscriptions.push(disposable);
});
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
