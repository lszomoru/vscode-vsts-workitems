// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { WorkItemService } from "./workitemservice";

var workItemService: WorkItemService;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	workItemService = new WorkItemService();

	// Register the commands from the extention
	registerCommand(context, "extension.createVSTSWorkItem", () => workItemService.createWorkItem());
	registerCommand(context, "extension.queryVSTSWorkItems", () => workItemService.queryWorkItems());
	registerCommand(context, "extension.openVSTSWorkItemsPortal", () => workItemService.openPortal());
}

function registerCommand(context: vscode.ExtensionContext, command: string, callback: (...args: any[]) => any) {
     let disposable =  vscode.commands.registerCommand(command, callback);
     context.subscriptions.push(disposable);
}