#!/usr/bin/env node
const fs = require('fs')
const ora = require('ora')
const parsePath = require('parse-filepath')
const chalk = require('chalk')
const boxen = require('boxen')
const checkForUpdate = require('update-check')
const pkg = require('./package.json')

let input = process.argv[2]
let hasError
let parsedLog
let lineNumber = 0

ProcessArgs()

function ProcessArgs() {
    if (input === undefined) {
        console.log('')
        ora('Missing Engine Log File').fail()
        console.log('')
        ShowHelp()
        return
    }
    else if (input === '-h' || input === '--help')
    {
        ShowHelp()
        return
    }
    else if (input === '-v' || input === '--version')
    {
        CheckUpdates()
        return
    }

    ParseLog(input)
}

function ShowHelp()
{
    console.log('')
    console.log('usage: slug path/to/engine.log')
    console.log('')
    console.log('       slug -h --help      Shows this help')
    console.log('       slug -v --version   Checks for updates') 
}

function ParseLog(path)
{
    parsedLog =  '| ERROR | LINE | CLASS | LOG |\n'
    parsedLog += '|-------|------|-------|-----|\n'

    var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(path)
    })

    lineReader.on('line', function (line) {
        CheckLogType(line)
    }).on('close', function (line) {
        SaveLog()
    })
}

function CheckLogType(line)
{
    ++lineNumber

    if (hasError)
    {
        hasError = false
        let str = line.split('[')

        parsedLog += str[0] + '|\n'
    }   
    else
    {
        if (CheckBlackList(line) == false)
            return

        if (line.startsWith('['))
            FormatLog(line, lineNumber)
        else
            FormatException(line)
    }
}

function FormatException(line)
{
    if (
        line.startsWith('MissingReferenceException') ||
        line.startsWith('NullReferenceException') ||
        line.startsWith('KeyNotFoundException') ||
        line.startsWith('ArgumentOutOfRangeException') ||
        line.startsWith('IndexOutOfRangeException') ||
        line.startsWith('InvalidOperationException') ||
        line.startsWith('OverflowException') ||
        line.startsWith('InvalidCastException') ||
        line.startsWith('FormatException') ||
        line.startsWith('ArgumentException')
    )
    {
        hasError = true

        let str = line.split(':')
    
        var result = '|**ERROR**' + 
                     '|' + lineNumber + 
                     '|' + str[0] + 
                     '|' + str[1] + ': '
    
        parsedLog += result
    }
}

function FormatLog(line, lineNumber)
{
    let title = line.substring(
        line.lastIndexOf('[') + 1, 
        line.lastIndexOf(']')
    )

    let desc = line.replace('[' + title + '] ', '')

    var result = '| ' + 
                 '|' + lineNumber + 
                 '|' + title + 
                 '|' + desc + '|\n'

    parsedLog += result
}

function SaveLog()
{
    let path = parsePath(input)

    let fullPath = path.dirname + '/' + 'Engine.md'

    let warning  = '> **WARNING:** This log is only for checking out progression easily. You should examine the original `Engine.log` as well.\n\n'
    let result = warning + parsedLog

    fs.writeFile(fullPath, result, function (err) {
        if (err) return console.log(err)
        ora('Log Exported: ' + fullPath).succeed()
    })
}

function CheckBlackList(line)
{
    if (line.startsWith('[/'))
        return false
    if (line.startsWith('[   '))
        return false
    if (line.startsWith('[00:'))
        return false
    if (line.startsWith('[PathTracer]'))
        return false
    if (line.startsWith('[Package Manager]'))
        return false
    if (line.startsWith('    (location'))
        return false
    if (line.startsWith('[VSCode'))
        return false
    if (line.includes('buildslave\\unity\\build'))
        return false

    return true
}

async function CheckUpdates() {

    const updateSpinner = ora('Checking for updates').start();

	let update = null

	try {
		update = await checkForUpdate(pkg)
	} catch (err) {
        updateSpinner.fail('Failed to check updates:\n')
        console.error(err)
        return
	}

	let updateText, commandText

    updateSpinner.succeed('Successfully checked updates\n')

	if (update) {
		updateText = 'Update available ' + chalk.gray(pkg.version) + ' → ' + chalk.green(update.latest)
		commandText = 'Run ' + chalk.cyan('npm i -g ' + pkg.name) + ' to update'
	}
	else
	{
		updateText = 'You are using the latest version'
		commandText = pkg.name + ' v' + pkg.version
	}

	console.log(
		boxen(updateText + '\n' + commandText, {
			padding: 1,
			margin: 1,
			align: 'center'
		})
	)
}