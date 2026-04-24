#!/usr/bin/env node

// @ts-check

import fg from 'fast-glob';
import fs from 'node:fs';
import path from 'node:path';
import minimist from 'minimist';
import { getError } from './utils.js';

/**
 * Displays the help message.
 */
function showHelp() {
    console.log(`
Usage: list-files [options] [directory]

List all files recursively inside the specified directory (or current directory if omitted).
Paths are printed relative to the current working directory by default.

Arguments:
  directory               Target directory to scan (default: current directory)

Options:
  -a, --absolute          Print absolute file paths
  -e, --exclude <pattern> Exclude files/directories matching a glob pattern (can be repeated)
  -o, --output <file>     Write output to a file instead of stdout
  -h, --help              Show this help message

Glob pattern examples:
  "*.tmp"                 All .tmp files in the root of the scanned directory
  "**/*.test.js"          All .test.js files in any subdirectory
  "node_modules/**"       Exclude the entire node_modules folder
  "**/temp/*"             All files inside any 'temp' folder

Examples:
  list-files
  list-files ./src
  list-files --exclude "**/*.log"
  list-files -e "node_modules/**" -e "dist/**" --absolute
  list-files /home/user/project -e "*.tmp" -a
  list-files -o files.txt
  list-files ./src -e "*.test.js" -o output.txt
`);
}

/**
 * Writes output lines to a file or console.
 * @param {string[]} lines - Lines to write
 * @param {string | undefined} outputFilePath - Path to output file, or undefined for stdout
 * @returns {Promise<void>}
 */
async function writeOutput(lines, outputFilePath) {
    const content = lines.join('\n') + (lines.length ? '\n' : '');
    if (outputFilePath) {
        try {
            await fs.promises.writeFile(outputFilePath, content, 'utf8');
        } catch (e) {
            let error = getError(e);
            console.error(`Error writing to file "${outputFilePath}":`, error.message);
            process.exit(1);
        }
    } else {
        // Print to stdout
        for (const line of lines) {
            console.log(line);
        }
    }
}

/**
 * Main entry point of the file listing utility.
 * @returns {Promise<void>}
 */
async function main() {
    const argv = minimist(process.argv.slice(2), {
        boolean: ['absolute', 'help', 'a', 'h'],
        alias: {
            a: 'absolute',
            e: 'exclude',
            h: 'help',
            o: 'output',
        },
        default: {
            exclude: [],
        },
    });

    if (argv.help) {
        showHelp();
        process.exit(0);
    }

    const targetDir = argv._[0] || '.';
    const outputFile = argv.output;

    // Validate output file path if provided
    if (outputFile && typeof outputFile !== 'string') {
        console.error('Error: --output requires a file path');
        process.exit(1);
    }

    // Resolve absolute path and validate directory
    let dirAbsolute;
    try {
        dirAbsolute = path.resolve(targetDir);
        const stat = fs.statSync(dirAbsolute);
        if (!stat.isDirectory()) {
            console.error(`Error: "${targetDir}" is not a directory`);
            process.exit(1);
        }
    } catch (e) {
        let error = getError(e);
        console.error(`Error accessing directory "${targetDir}":`, error.message);
        process.exit(1);
    }

    // Normalise exclude patterns
    let excludePatterns = argv.exclude;
    if (!Array.isArray(excludePatterns)) {
        excludePatterns = [excludePatterns];
    }
    excludePatterns = excludePatterns.filter(
        (/** @type {string} */ pattern) => pattern && typeof pattern === 'string'
    );

    try {
        const relativeFilePaths = await fg('**/*', {
            cwd: dirAbsolute,
            ignore: excludePatterns,
            onlyFiles: true,
            absolute: false,
            followSymbolicLinks: false,
            dot: true,
        });

        const outputLines = [];
        for (const relPath of relativeFilePaths) {
            const absolutePath = path.join(dirAbsolute, relPath);
            let outputPath = argv.absolute
                ? absolutePath
                : path.relative(process.cwd(), absolutePath);
            outputPath = outputPath.replace(/\\/g, '/');
            outputLines.push(outputPath);
        }

        await writeOutput(outputLines, outputFile);
    } catch (e) {
        let error = getError(e);
        console.error('Error while scanning files:', error.message);
        process.exit(1);
    }
}

main().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
});
