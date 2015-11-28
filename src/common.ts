import * as vscode from "vscode";

export class WorkItemQuickPickItem implements vscode.QuickPickItem {
	label:string;
	description:string;
	id: string;
}

export class WorkItemQueryQuickPickItem implements vscode.QuickPickItem {
	label:string;
	description:string;
	wiql: string;
}