# list-files

CLI tool to recursively list all files in a directory.  
Supports glob‑based exclusion patterns, relative/absolute paths, and is powered by `fast-glob`.

## Features

- Recursively scan any directory (default: current directory)
- Exclude files/folders using glob patterns (`--exclude`, can be repeated)
- Output relative paths (to current working directory) or absolute paths (`--absolute`)
- Cross‑platform (POSIX paths with `/`)
- Includes hidden files (dotfiles) by default

## Installation

### From GitHub (recommended)

```bash
npm install -g https://github.com/supercat1337/list-files.git
```

Then use the command globally:

```bash
list-files --help
```

### Local install (for development or `npx`)

```bash
npm install https://github.com/supercat1337/list-files.git
```

Run via `npx`:

```bash
npx list-files [options] [directory]
```

## Requirements

- Node.js **18+** (ES modules support)

## Usage

```
list-files [options] [directory]
```

If no `directory` is given, the current working directory is scanned.

### Options

| Option                | Alias | Description                                       |
| --------------------- | ----- | ------------------------------------------------- |
| `--absolute`          | `-a`  | Print absolute file paths                         |
| `--exclude <pattern>` | `-e`  | Exclude files/directories matching a glob pattern |
| `--output <file>`     | `-o`  | Write output to a file instead of stdout          |
| `--help`              | `-h`  | Show help screen                                  |

- The `--exclude` / `-e` flag can be used **multiple times** to add several exclude patterns.
- Patterns follow [fast-glob syntax](https://github.com/mrmlnc/fast-glob#pattern-syntax).

## Examples

### Basic listing (current directory)

```bash
list-files
```

Output (relative paths to current working directory):

```
src/index.js
README.md
package.json
```

### Scan a specific directory

```bash
list-files ./lib
```

### Exclude patterns

```bash
list-files --exclude "**/*.test.js"
```

Multiple excludes:

```bash
list-files -e "node_modules/**" -e "dist/**" -e "*.log"
```

Write output to a file:

```bash
list-files -o files.txt
list-files ./src -e "*.test.js" -o output.txt
```

### Absolute paths

```bash
list-files --absolute
```

### Combine all options

```bash
list-files ./project -e "temp/**" -e "*.tmp" --absolute
```

### Use with `xargs` or `grep`

```bash
list-files | grep "config"
list-files --absolute | xargs cat
```

## How it works

1. Resolves the target directory (or uses `.`).
2. Uses `fast-glob` with pattern `**/*` to list all files recursively.
3. Applies `--exclude` patterns to the `ignore` option.
4. Outputs each path:
    - Relative to `process.cwd()` by default
    - Absolute when `--absolute` is given
5. Normalizes Windows backslashes to forward slashes for consistency.

## License

MIT
