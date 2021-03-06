# Visual Studio Team Services work items extension

Create, query, and access Visual Studio Team Services work items from within Visual Studio Code.

## Features
The features are available through the commands that were added to the [command palette](https://code.visualstudio.com/Docs/editor/codebasics#_command-palette) as well as the [key bindings](https://code.visualstudio.com/docs/customization/keybindings) associated with each: *Open Visual Studio Team Services work items portal (```Ctrl+W Ctrl+P```)*, *Create Visual Studio Team Services work item (```Ctrl+W Ctrl+N```)*, *Create Visual Studio Team Services task from selection (```Ctrl+W Ctrl+T```)*, and *Query Visual Studio Team Services work items (```Ctrl+W Ctrl+O```)*.
### Visual Studio Team Services account/team project indicator
Based on the information specified in ```settings.json``` a visual indicator is added to the Visual Studio Code status bar with the details of the Visual Studio Team Service account and team project that the extension is connected to.
![VSCode](assets/vscode1.png)
### Create new work item
![VSCode](assets/vscode4.png)
![VSCode](assets/vscode5.png)
### Create task from selection
Create a new Visual Studio Team Services task from a single-line text selection to easily track tasks from comments. A link to the newly created task will be automatically injected into the editor. This feature is only available for JavaScript, TypeScript, TypeScript React, and C# files.
![VSCode](assets/vscode6.png)
### Query work items
Execute a work item querie stored in the "My Queries" folder and open a work item that is returned by the work item query.
![VSCode](assets/vscode2.png)
![VSCode](assets/vscode3.png)

## Configuration 
In order for the extension to access your Visual Studio Team Servies account you need to provide the account name, the team project name, and a [personal access token](https://www.visualstudio.com/en-us/news/2015-jul-7-vso.aspx) with "work items (read and write)" permission. After installing the extension, and restarting Visual Studio Code, add the following section into your ```settings.json```:
```
{
	// Visual Studio Team Services account (Ex: contoso.visualstudio.com).
	"vsts.account": "",

	// Visual Studio Team Services personal access token.
	"vsts.pat": "",

	// Visual Studio Team Services team project name.
	"vsts.teamProject": ""
}
```

You can also add the  ```vsts.workItemTypes``` optional setting to control the work item types that can be created using Visual Studio Code, as well as the ```vsts.statusBarItemPriority``` optional setting to control the location of the status bar item (the greater the value the more left the item is displayed). 
```
	// Visual Studio Team Services work item types. (Ex: ["Bug", "Task"])
	"vsts.workItemTypes": [],

	// Priority of the status bar item. The higher the priority the more left the item is displayed.
	"vsts.statusBarItemPriority": 99,

```

## Changelog
### v0.0.3 (2016-01-11)
* Fixed the issue with the command on the status bar indicator

### v0.0.2 (2015-12-06)
* Create new task from a single-line text selection (JavaScript, TypeScript, TypeScript React, C#). Using this feature you can easily convert comments into tasks. The link to the newly created task will be automatically injected into the editor.
* Key bindings for each of the available commands
* Configuration setting to filter work item types
* Configuration setting to control status bar item ordering

### v0.0.1 (2015-11-30)
* Visual Studio Team Services account/team project indicator on the status bar
* Open Visual Studio Team Services work items portal
* Create new Visual Studio Team Services work item
* Query Visual Studio Team Services work items

## License
MIT. For more details check [LICENSE](LICENSE).
