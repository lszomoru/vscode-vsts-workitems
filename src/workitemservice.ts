import * as vscode from "vscode";

export class WorkItemService {
	private _vstsClient:any;
	private _vstsAccount:string;
	private _vstsPersonalAccessToken:string;
	private _vstsCollection:string = "DefaultCollection";
	private _vstsTeamProject:string;
	private _vstsWorkItemTypes:Array<string> = [];

	constructor() {
		// Validate/load settings
		this._vstsAccount = this.validateSettings("vsts.account", "Please specify the name of the Visual Studio Team Services account in your settings.json. (vsts.account)");
		this._vstsPersonalAccessToken = this.validateSettings("vsts.pat", "Please specify the personal access token that has access to your the Visual Studio Team Services account in you settings.json. (vsts.pat).");
		this._vstsTeamProject = this.validateSettings("vsts.teamProject", "Please specify the team project name within the Visual Studio Team Services account in you settings.json. (vsts.teamProject).");

		// Create the instance of the VSTS client
		var vsts = require("vso-client");
		this._vstsClient = vsts.createClient("https://" + this._vstsAccount, this._vstsCollection, "", this._vstsPersonalAccessToken);

		// Add the details of the account and team project to the status bar
		if (this._vstsAccount != undefined && this._vstsAccount != ""
			&& this._vstsTeamProject != undefined && this._vstsTeamProject) {
			var statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
			statusBarItem.text  = "$(icon octicon-globe) " + this._vstsAccount.replace(".visualstudio.com", "") + " $(icon octicon-organization) " + this._vstsTeamProject;
			statusBarItem.command = "extension.openVSTSPortal";
			statusBarItem.show();
		}
	}

	public createWorkItem():void {
		var _self = this;

		// Get the list of work item types
		vscode.window.showQuickPick(this.queryWorkItemTypes())
			.then(function (workItemType: string) {
				if (workItemType != undefined && workItemType.length > 0) {
					// Get the title of the new work item
					vscode.window.showInputBox({
						placeHolder: "Title of the " + workItemType + "."
						}).then(function (title:string) {
							if (title != undefined && title.length > 0) {
								// Create the new work item
								var newWorkItem = [{ op: "add", path: "/fields/System.Title", value: title }];
								_self._vstsClient.createWorkItem(newWorkItem, _self._vstsTeamProject, workItemType, function(err, workItem) {
									if (err) {
										vscode.window.showErrorMessage("Unable to create Visual Studio Team Services work item. Please try again later.");
									} else {
										vscode.window.showInformationMessage("Visual Studio Team Services work item " +  workItem.id + " created successfully.");
									}
								});
							}
					});
				}
			});
	}

	public openPortal() {
		var open = require("open");
		open("https://" + this._vstsAccount + "/" + this._vstsCollection + "/" + this._vstsTeamProject + "/_workitems");
	}

	public queryWorkItems(): void {
		var _self = this;

		// Get the list of queries from the "My Queries" folder
		vscode.window.showQuickPick(this.queryWorkItemQueries())
			.then(function (query) {
				// Execute the selected query and display the results
				vscode.window.showQuickPick(_self.execWorkItemQuery(query.wiql))
					.then(function (workItem) {
						_self.openWorkItem(workItem.id);
					});
			});
	}

	private execWorkItemQuery(wiql: string): Promise<Array<WorkItemQuickPickItem>> {
		var _self = this;

		return new Promise((resolve, reject) => {
			// Execute the wiql and get the work item ids
			_self._vstsClient.getWorkItemIds(wiql, _self._vstsTeamProject, function(err, workItemIds) {
				if (err) {
					reject(err);
				} else {
					// Get the work item details
					_self._vstsClient.getWorkItemsById(workItemIds, ["System.Id", "System.WorkItemType", "System.Title"], function (err, workItems) {
						if (err) {
							reject(err);
						} else {
							var results: Array<WorkItemQuickPickItem> = [];
							for (var index = 0; index < workItems.length; index++) {
								results.push({
									id: workItems[index].fields["System.Id"],
									label: workItems[index].fields["System.Id"] + "  [" + workItems[index].fields["System.WorkItemType"] +"]",
									description: workItems[index].fields["System.Title"]
								});
							}
							resolve(results);
						}
					});
				}
			});
		});
	}

	private openWorkItem(id:string) {
		var open = require("open");
		open("https://" + this._vstsAccount + "/" + this._vstsCollection + "/" + this._vstsTeamProject + "/_workitems#id=" + id);
	}

	private queryWorkItemQueries(): Promise<Array<WorkItemQueryQuickPickItem>> {
		var _self = this;

		return new Promise((resolve, reject) => {
			_self._vstsClient.getQueries(this._vstsTeamProject, 1, "wiql", "My Queries", 0, function (err, queries) {
				if (err) {
					reject("Unable to get your Visual Studio Team Services work item queries. Please make sure your Visual Studio Team Services settings are corect.");
				} else {
					var results:Array<WorkItemQueryQuickPickItem> = [];
					for (var index = 0; index < queries.children.length; index++) {
						results.push({
							label: queries.children[index].name,
							description: "",
							wiql: queries.children[index].wiql
						});
					}
					resolve(results);
				}
			});
		});
	}

	private queryWorkItemTypes(): Promise<Array<string>> {
		var _self = this;

		return new Promise((resolve, reject) => {
			if (_self._vstsWorkItemTypes.length > 0) {
				resolve(_self._vstsWorkItemTypes);
			} else {
				_self._vstsClient.getWorkItemTypes(_self._vstsTeamProject, function(err, workItemTypes) {
					if (err) {
						reject(err);
					} else {
						for (var index = 0; index < workItemTypes.length; index++) {
							_self._vstsWorkItemTypes.push(workItemTypes[index].name);
						}
						resolve(_self._vstsWorkItemTypes);
					}
				});
			}
		});
	}

	private validateSettings(settingName: string, errorMessage:string): string {
		var configuration = vscode.workspace.getConfiguration();
		var settingValue = configuration.get<string>(settingName);

		if (settingValue == undefined || settingValue.length == 0) {
			vscode.window.showWarningMessage(errorMessage);
		}

		return settingValue;
	}
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