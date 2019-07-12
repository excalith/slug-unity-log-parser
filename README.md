# SLUG - Unity Log Parser
A (very) simple tool written in rush for parsing Unity3D Engine logs to see player's journey easily within a markdown table. This is not intended to be a production-ready tool, but might come in handy for people who is struggling reading huge logs.

### The Catch
In order to use this tool, you should format your logs (Debug.Log etc.) like this:

`Debug.Log("[CLASS NAME] Real Log Message")`

With this way, slug can parse any log message starting with `[` and create a markdown entry.

### Usage
You should use the `slug` command with the `Engine.log` file path
```
slug [engine.log file]
```