import * as vscode from "vscode";

export class Constants {
	static iconAccount:string = "$(icon octicon-globe)";
	static iconTeamProject:string = "$(icon octicon-organization)";

	static defaultCollectionName: string = "DefaultCollection";

	static settingAccountName: string = "vsts.account";
	static settingPersonalAccessToken:string = "vsts.pat";
	static settingTeamProjectName:string = "vsts.teamProject";

	static errorAccountName: string = "Please specify the name of the Visual Studio Team Services account (vsts.account) in your settings.json.";
	static errorPersonalAccessToken: string = "Please specify the personal access token (vsts.pat) that has access to your the Visual Studio Team Services account in you settings.json.";
	static errorTeamProjectName: string = "Please specify the team project name (vsts.teamProject) within the Visual Studio Team Services account in you settings.json.";

	static errorHint: string = "Please ensure that the Visual Studio Team Services settings in settings.json are corect.";
	static errorCreateWorkItem: string = "Unable to create Visual Studio Team Services work item.";
	static errorWorlItemQueries: string = "Unable to retrieve your work item queries.";
	static errorWorkItemTypes:string = "Unable to retrieve the work item types.";
	static errorExecuteWorkItemQuery:string = "Unable to execute Visual Studio Team Services work item query.";
	static errorGetWorkItemDetails:string = "Unable to query Visual Studio Team Services work item details.";

	static fieldId: string = "System.Id";
	static fieldTitle: string = "System.Title";
	static fieldWorkItemType: string = "System.WorkItemType";

	static queryFolderName:string = "My Queries";
}

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