import * as vscode from "vscode";
import { Constants, WorkItemQuickPickItem, WorkItemQueryQuickPickItem } from "./common";

export class WorkItemService {
	private _vstsClient:any;
	private _vstsAccount:string;
	private _vstsPersonalAccessToken:string;
	private _vstsTeamProject:string;
	private _vstsWorkItemTypes:Array<string> = [];

	constructor() {
		// Validate/load settings
		this._vstsAccount = this.validateSettings(Constants.settingAccountName, Constants.errorAccountName);
		this._vstsPersonalAccessToken = this.validateSettings(Constants.settingPersonalAccessToken, Constants.errorPersonalAccessToken);
		this._vstsTeamProject = this.validateSettings(Constants.settingTeamProjectName, Constants.errorTeamProjectName);

		// Create the instance of the VSTS client
		var vsts = require("vso-client");
		this._vstsClient = vsts.createClient("https://" + this._vstsAccount, Constants.defaultCollectionName, "", this._vstsPersonalAccessToken);

		// Add the details of the account and team project to the status bar
		if (this._vstsAccount != undefined && this._vstsAccount != ""
			&& this._vstsTeamProject != undefined && this._vstsTeamProject) {
			var statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
			statusBarItem.text = Constants.iconAccount + " " + this._vstsAccount.replace(".visualstudio.com", "") + " " + Constants.iconTeamProject + " " + this._vstsTeamProject;
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
								var newWorkItem = [{ op: "add", path: "/fields/" + Constants.fieldTitle, value: title }];
								_self._vstsClient.createWorkItem(newWorkItem, _self._vstsTeamProject, workItemType, function(err, workItem) {
									if (err) {
										console.log("ERROR: " + err.message);
										vscode.window.showErrorMessage(Constants.errorCreateWorkItem + " " + Constants.errorHint);
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
		open("https://" + this._vstsAccount + "/" + Constants.defaultCollectionName + "/" + this._vstsTeamProject + "/_workitems");
	}

	public queryWorkItems(): void {
		var _self = this;

		// Get the list of queries from the "My Queries" folder
		vscode.window.showQuickPick(this.queryWorkItemQueries())
			.then(function (query) {
				if (query != undefined) {
					// Execute the selected query and display the results
					vscode.window.showQuickPick(_self.execWorkItemQuery(query.wiql))
						.then(function (workItem) {
							_self.openWorkItem(workItem.id);
						});
				}
			});
	}

	private execWorkItemQuery(wiql: string): Promise<Array<WorkItemQuickPickItem>> {
		var _self = this;

		return new Promise((resolve, reject) => {
			// Execute the wiql and get the work item ids
			_self._vstsClient.getWorkItemIds(wiql, _self._vstsTeamProject, function(err, workItemIds) {
				if (err) {
					console.log("ERROR: " + err.message);
					vscode.window.showErrorMessage(Constants.errorExecuteWorkItemQuery + " " + Constants.errorHint);
					resolve([]);
				} else {
					// Get the work item details
					_self._vstsClient.getWorkItemsById(workItemIds, [Constants.fieldId, Constants.fieldTitle, Constants.fieldWorkItemType], function (err, workItems) {
						if (err) {
							console.log("ERROR: " + err.message);
							vscode.window.showErrorMessage(Constants.errorGetWorkItemDetails + " " + Constants.errorHint);
							resolve([]);
						} else {
							var results: Array<WorkItemQuickPickItem> = [];
							for (var index = 0; index < workItems.length; index++) {
								results.push({
									id: workItems[index].fields[Constants.fieldId],
									label: workItems[index].fields[Constants.fieldId] + "  [" + workItems[index].fields[Constants.fieldWorkItemType] +"]",
									description: workItems[index].fields[Constants.fieldTitle]
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
		open("https://" + this._vstsAccount + "/" + Constants.defaultCollectionName + "/" + this._vstsTeamProject + "/_workitems/edit/" + id);
	}

	private queryWorkItemQueries(): Promise<Array<WorkItemQueryQuickPickItem>> {
		var _self = this;

		return new Promise((resolve, reject) => {
			_self._vstsClient.getQueries(this._vstsTeamProject, 1, "wiql", Constants.queryFolderName, 0, function (err, queries) {
				if (err) {
					console.log("ERROR: " + err.message);
					vscode.window.showErrorMessage(Constants.errorWorlItemQueries + " " + Constants.errorHint);
					resolve(undefined);
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
						console.log("ERROR: " + err.message);
						vscode.window.showErrorMessage(Constants.errorWorkItemTypes + " " + Constants.errorHint);
						resolve(undefined);
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