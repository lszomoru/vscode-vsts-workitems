import * as vscode from "vscode";
import { Constants, Icons, ErrorMessages, SettingNames, WorkItemFields } from "./constants";
import { WorkItemQuickPickItem, WorkItemQueryQuickPickItem } from "./common";

export class WorkItemService {
	private _vstsClient:any;
	private _vstsAccount:string;
	private _vstsPersonalAccessToken:string;
	private _vstsTeamProject:string;
	private _vstsWorkItemTypes:Array<string> = [];

	constructor() {
		// Validate/load settings
		this._vstsAccount = this.validateSettings(SettingNames.accountName, ErrorMessages.accountNameMissing);
		this._vstsPersonalAccessToken = this.validateSettings(SettingNames.personalAccessToken, ErrorMessages.personalAccessTokenMissing);
		this._vstsTeamProject = this.validateSettings(SettingNames.teamProjectName, ErrorMessages.teamProjectNameMissing);

		// Create the instance of the VSTS client
		var vsts = require("vso-client");
		this._vstsClient = vsts.createClient("https://" + this._vstsAccount, Constants.defaultCollectionName, "", this._vstsPersonalAccessToken);

		// Add the details of the account and team project to the status bar
		if (this._vstsAccount != undefined && this._vstsAccount != ""
			&& this._vstsTeamProject != undefined && this._vstsTeamProject) {
			var statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
			statusBarItem.text = Icons.account + " " + this._vstsAccount.replace(".visualstudio.com", "") + " " + Icons.teamProject + " " + this._vstsTeamProject;
			statusBarItem.command = "extension.openVSTSPortal";
			statusBarItem.show();
		}
	}

	public createWorkItem():void {
		var _self = this;

		// Get the list of work item types
		vscode.window.showQuickPick(this.queryWorkItemTypes())
			.then(
				function (workItemType: string) {
					if (workItemType != undefined && workItemType.length > 0) {
						// Get the title of the new work item
						vscode.window.showInputBox({
							placeHolder: "Title of the " + workItemType + "."
							}).then(function (title:string) {
								if (title != undefined && title.length > 0) {
									// Create the new work item
									var newWorkItem = [{ op: "add", path: "/fields/" + WorkItemFields.title, value: title }];
									_self._vstsClient.createWorkItem(newWorkItem, _self._vstsTeamProject, workItemType, function(err, workItem) {
										if (err) {
											console.log("ERROR: " + err.message);
											_self.displayError(err, ErrorMessages.createWorkItem);
										} else {
											vscode.window.showInformationMessage("Visual Studio Team Services work item " +  workItem.id + " created successfully.");
										}
									});
								}
						});
					}
				},
				function (err) {
					console.log("ERROR: " + err.message);
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
			.then(
				function (query) {
					if (query != undefined) {
						// Execute the selected query and display the results
						vscode.window.showQuickPick(_self.execWorkItemQuery(query.wiql))
							.then(
								function (workItem) {
									_self.openWorkItem(workItem.id);
								},
								function (err) {
									console.log("ERROR: " + err.message);
								});
					}
				},
				function (err) {
					console.log("ERROR: " + err.message);
				});
	}

	private displayError(err, errorMessage: string): void {
		if (err != undefined) {
			var message = err.hasOwnProperty("message") ? err.message : err;

			if (message.indexOf("The resource cannot be found") > -1) {
				// Wrong account name
				vscode.window.showErrorMessage(errorMessage + " " + ErrorMessages.accountNotFoundHint);
			} else if (message.indexOf("TF200016") > -1) {
				// Wrong team project name
				vscode.window.showErrorMessage(errorMessage + " " + ErrorMessages.teamProjectNotFoundHint);
			} else if (message.indexOf("Error unauthorized") > -1) {
				// Insufficient permissions
				vscode.window.showErrorMessage(errorMessage + " " + ErrorMessages.insufficientPermissionsHint);
			} else {
				// Generic hint
				vscode.window.showErrorMessage(errorMessage + " " + ErrorMessages.generalHint);
			}
		} else {
			// Generic hint
			vscode.window.showErrorMessage(errorMessage + " " + ErrorMessages.generalHint);
		}
	}

	private execWorkItemQuery(wiql: string): Promise<Array<WorkItemQuickPickItem>> {
		var _self = this;

		return new Promise((resolve, reject) => {
			// Execute the wiql and get the work item ids
			_self._vstsClient.getWorkItemIds(wiql, _self._vstsTeamProject, function(err, workItemIds) {
				if (err) {
					_self.displayError(err, ErrorMessages.executeWorkItemQuery);
					reject(err);
				} else {
					// Get the work item details
					_self._vstsClient.getWorkItemsById(workItemIds, [WorkItemFields.id, WorkItemFields.title, WorkItemFields.workItemType], function (err, workItems) {
						if (err) {
							_self.displayError(err, ErrorMessages.getWorkItemDetails);
							reject(err);
						} else {
							var results: Array<WorkItemQuickPickItem> = [];
							for (var index = 0; index < workItems.length; index++) {
								results.push({
									id: workItems[index].fields[WorkItemFields.id],
									label: workItems[index].fields[WorkItemFields.id] + "  [" + workItems[index].fields[WorkItemFields.workItemType] +"]",
									description: workItems[index].fields[WorkItemFields.title]
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
					_self.displayError(err, ErrorMessages.getWorkItemQueries);
					reject(err);
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
						_self.displayError(err, ErrorMessages.getWorkItemTypes);
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