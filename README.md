# Visual Studio Team Services work items extension

Create, query, and access Visual Studio Team Services work items from within Visual Studio Code.

## Features
* Visual Studio Team Services account/team project indicator on the status bar. 
* Quickly access your Visual Studio Team Services account by clicking on the status bar item.
* Create a new work item in your Visual Studio Team Services account.
* Execute a work item querie stored in the "My Queries" folder in your Visual Studio Team Services account/team project. 
* Quickly open a work item that is returned by your work item query.

## Configuration 
In order for the extension to access your Visual Studio Team Servies account you need to provide the account name, the team project name, and a [personal access token](https://www.visualstudio.com/en-us/news/2015-jul-7-vso.aspx). After installing the extension, open your settings.json (*Preferences: Open user settings* in the [command palette](https://code.visualstudio.com/Docs/editor/codebasics#_command-palette)) and add the following section:
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


## License
MIT. For more details check [LICENSE] (LICENSE).
