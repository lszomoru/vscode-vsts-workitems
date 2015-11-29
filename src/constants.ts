export class Constants {
	static queryFolderName:string = "My Queries";
	static defaultCollectionName: string = "DefaultCollection";
}

export class ErrorMessages {
	static accountNameMissing: string = "Please specify the name of the Visual Studio Team Services account (vsts.account) in your settings.json.";
	static personalAccessTokenMissing: string = "Please specify the personal access token (vsts.pat) that has access to your the Visual Studio Team Services account in you settings.json.";
	static teamProjectNameMissing: string = "Please specify the team project name (vsts.teamProject) within the Visual Studio Team Services account in you settings.json.";

	static createWorkItem: string = "Unable to create Visual Studio Team Services work item.";
	static getWorkItemQueries: string = "Unable to retrieve your work item queries.";
	static getWorkItemTypes:string = "Unable to retrieve the work item types.";
	static getWorkItemDetails:string = "Unable to query Visual Studio Team Services work item details.";
	static executeWorkItemQuery:string = "Unable to execute Visual Studio Team Services work item query.";

	static generalHint: string = "Please ensure that the Visual Studio Team Services settings in settings.json are corect.";
}

export class Icons {
	static account:string = "$(icon octicon-globe)";
	static teamProject:string = "$(icon octicon-organization)";
}

export class SettingNames {
	static accountName: string = "vsts.account";
	static personalAccessToken:string = "vsts.pat";
	static teamProjectName:string = "vsts.teamProject";
}

export class WorkItemFields {
	static id: string = "System.Id";
	static title: string = "System.Title";
	static workItemType: string = "System.WorkItemType";
}