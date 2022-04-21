# Kaholo Airtable Plugin
This plugin integrates Airtable with Kaholo, providing access to list Airtable data in Kaholo. This first iteration of the plugin does only this, with optional filtering by field and formula, sorting, and/or choosing a particular Airtable view.

## Prerequisites
The plugin requires an Airtable account with a personal API key. There must be at least one Airtable base and a table in it with some data. The personal API key and Airtable base ID look something like `keyvH5Dei3peZI58n` and `app2hL3K7MOlMwM6Z`, respectively. For tables, fields, and views ordinary names work, e.g. `Client List`, `first_name`, `Grid view`.

## Access and Authentication
Airtable controls Access and Authentication using a person API token, which looks something like `app2hL3K7MOlMwM6Z`. This is a secret that should be guarded carefully. In Kaholo it is encrypted in the Kaholo vault, where it can be safely used without being exposed to users or appearing in log files, activity log, or final result.

To get a personal API key, while in the Airtable web console, click on the person-shaped icon on the top right of the display and select "Account". There's a section named "<> API" with a button to "Generate API key". Push that button. The key will remain masked until you put the active cursor in the text box to right-click and copy the API key.

The base ID is not a secret but your data is not accessible without knowing what your base ID is. To get your base ID, while in the Airtable web console, click on "Help" in the top-right corner of the display and select "<> API Documentation". Near the top there will be prominently displayed `The ID of this base is app2hL3K7MOlMwM6Z.`. If you switch base and do it again you can get the ID of all of your bases.

API key and Base ID are required parameters for all methods of this plugin.

## Plugin Installation
For download, installation, upgrade, downgrade and troubleshooting of plugins in general, see [INSTALL.md](./INSTALL.md). INSTALL.md is included in both the code repository and the zip file.

## Plugin Settings
Plugin settings act as default parameter values. If configured in plugin settings, the action parameters will be automatically pre-configured with these values, as a convenience.
* Default API Key - an Airtable personal API key stored in the Kaholo Vault
* Default Base ID - the ID of an Airtable base
* Default Table - the name or ID of an Airtable table

## Method List Records
This method lists records from an Airtable table. With nothing but a table configured it will list every record in the table in no particular order. To select specific fields or records or sorting there are many optional parameters.

### Parameter Table
This is either the ordinary name of the Table as seen in the Airtable web console or its ID string, which begins with `tbl`. This is a required parameter.

### Parameter View
This is either the ordinary name of the View as seen in the Airtable web console or its ID string. Views are helpful in that they can provide advanced filtering and sorting functionality for your data, including formulaic virtual fields. Once a view is appropriately configured a Kaholo user can use that view and then ignore all the other parameters for sorting and filtering. If you DO select a view and then use sorting anyway, the sorting specified in Kaholo overrides the sorting configured in the view.

### Parameter Filter by Field
By default the plugin returns every field from the table or view. If you prefer to retrieve only one or a list of specific fields, list them here one per line in the order you want them to appear in the results. No brackets or quotes should be used. If coding this field use a single string with fields separated by `\n`.

### Parameter Filter by Formula
By default the plugin returns every record in the table. If you'd like only specific records, use this parameter to filter them using an Airtable formula. The formula typically evaluates to `TRUE()` or `FALSE()`, where if true the record is included and if false the record is excluded. For example using formula `FALSE()` as the filter results in no records returned at all.

Fields must be enclosed in `{curly brackets}`. It's alright if the field has space in it but do NOT put spaces or quotes around the field. It is not case sensitive. for example if the field name is `ID number`:

Good examples:
* `{ID number} = 23522`
* `{id number}=23522`

Bad examples (will not work):
* `{ ID number } = 23522`
* `{"ID number"} = 23522`

There are many functions and logic operators to choose from. For example to find a person who's first and last name both begin with "T":

`AND(FIND("T",{first_name})=1,FIND("T",{last_name})=1)`

Or to find people with "oo" in their name:

`OR(FIND("oo",{first_name})>0,FIND("oo",{last_name})>0)`

For more information about Airtable formulas see their [formula field reference](https://support.airtable.com/hc/en-us/articles/203255215).

### Parameter Sort By
Sort By is a any field in the table or view by which you'd like to sort. This over-rides the view if a view that has a sort order already specified.

For sorting on more than one field or other more sophisticated options, create a view in Airtable and then specify that view using the Kaholo plugin.

### Parameter Sort Order
Ascending and Descending sort orders are allowed. If you choose on of these, you must also specify parameter `Sort By`.

### Parameter Total Max Records
This parameter is to optionally restrict how many records are returned. By default all matching records are returned, which for large queries may overrun your allowed use of Airtable API queries because results are retrieved 100 at a time.

If this parameter is configured to a number smaller than the count of records in the table or view that pass the filters, then the result set is truncated to provide exactly `Total Max Records` amount.