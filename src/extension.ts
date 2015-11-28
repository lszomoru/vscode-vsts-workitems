// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { WorkItemService, WorkItemQuickPickItem, WorkItemQueryQuickPickItem } from "./workitemservice";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let workItemService:WorkItemService = new WorkItemService();

	// Register the commands from the extention
	vscode.commands.registerCommand("extension.createVSTSWorkItem", () => workItemService.createWorkItem());
	vscode.commands.registerCommand("extension.queryVSTSWorkItems", () => workItemService.queryWorkItems());
	vscode.commands.registerCommand("extension.openVSTSPortal", () => workItemService.openPortal());
}