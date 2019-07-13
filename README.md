# SLUG - Unity Log Parser
A (very) simple tool written in rush for parsing Unity3D Engine logs to see player's journey easily within a markdown table. This is not intended to be a production-ready tool, but might come in handy for people who is struggling reading huge logs.

## Benefits
It formats each log entry into a markdown table row, without the stack trace bloating. This way you can read the sequence of things happened. It also captures the exceptions with the latest stack call - so you can see what threw the exception.

### Sample Data
Below is an example of what `Engine.log` looks like after exporting as markdown:

> **WARNING:** This log is only for checking out progression easily. You should examine the original `Engine.log` as well.

| ERROR   | LINE | CLASS                     | LOG                                                                                        |
|---------|------|---------------------------|--------------------------------------------------------------------------------------------|
|         |197931| Game Manager              | Level Loaded: MyBeautifulLevel                                                             |
|         |197931| Game Manager              | Music Started: MyBeautifulAudio                                                            |
|         |197931| Escape Menu               | Escape Menu Instantiated                                                                   |
|         |197860| WorldTimeManager          | Game Paused                                                                                |
|         |197931| Escape Menu               | Escape Menu Destroyed                                                                      |
|**ERROR**|212984| MissingReferenceException | The object of type 'MySh*ttyCode' has been destroyed but you are still trying to access it |


### The Catch
In order to use this tool, you should format your logs (Debug.Log etc.) like this:
```
Debug.Log("[CLASS NAME] Real Log Message")
```
Or optionally, you can check out [SLUG - Unity Logger](https://github.com/excalith/slug-unity-logger) which does the same thing, except for writing down `[Class Name]` manually.

Either way, slug can parse all log messages starting with `[` and create a markdown table.

## How To Use
### Install 
To install, run the command
```
npm i -g slug-unity-log-parser
```

### Usage
To run the app, use `slug` command with the `Engine.log` file path
```
slug path/to/engine.log
```