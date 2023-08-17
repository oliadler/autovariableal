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
		let isHandled = false;
		

		if (!editor) {
			return;
		}
		
		
			const document = editor.document;
		
			let selection = editor.selection;

			let lineText = document.lineAt(selection.start.line).text;


			let colonPosition = lineText.indexOf(":");
			let semicolonPosition = lineText.indexOf(";");

			if (colonPosition !== -1 && semicolonPosition !== -1) {    
				let variableType = lineText.substring(colonPosition + 1, semicolonPosition).trim();
				
				const alObjectTypes = ["Record", "Page", "Report", "Codeunit", "XMLport", "Query", "Enum", "DotNet"]; // AL Object Types
			
				for (let i = 0; i < alObjectTypes.length; i++) {
					if (isHandled) {break;}
					if (variableType.startsWith(alObjectTypes[i])) {
						let typeName = variableType.substring(alObjectTypes.length).trim();
						let variableName = typeName.replace(/[\s".-/&]/g, ""); // g = global   
						
						let startPosition = new vscode.Position(selection.start.line, 0);
						let endPosition = new vscode.Position(selection.start.line, colonPosition);
						let range = new vscode.Range(startPosition, endPosition);
						
						editor.edit(function (editBuilder) {
							editBuilder.replace(range, `${variableName}`);
							isHandled = true;
						});
					}

				}
			}
				
		});
	
	context.subscriptions.push(disposable);
}



// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
