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
	context.subscriptions.push(vscode.commands.registerCommand("extension.createVSTSWorkItem", () => workItemService.createWorkItem()));
	context.subscriptions.push(vscode.commands.registerCommand("extension.queryVSTSWorkItems", () => workItemService.queryWorkItems()));
	context.subscriptions.push(vscode.commands.registerCommand("extension.openVSTSWorkItemsPortal", () => workItemService.openPortal()));
}