# list-files

CLI tool to recursively list all files in a directory.  
Supports glob‑based include/exclusion patterns, relative/absolute paths, and is powered by `fast-glob`.

## Features

- Recursively scan any directory (default: current directory)
- **Include** only files matching glob patterns (`--include`, can be repeated, default: `**/*`)
- **Exclude** files/folders using glob patterns (`--exclude`, can be repeated)
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

| Option                | Alias | Description                                                                          |
| --------------------- | ----- | ------------------------------------------------------------------------------------ |
| `--include <pattern>` | `-i`  | Include files/directories matching a glob pattern (can be repeated, default: `**/*`) |
| `--exclude <pattern>` | `-e`  | Exclude files/directories matching a glob pattern (can be repeated)                  |
| `--absolute`          | `-a`  | Print absolute file paths                                                            |
| `--output <file>`     | `-o`  | Write output to a file instead of stdout                                             |
| `--help`              | `-h`  | Show help screen                                                                     |

- The `--include` / `-i` flag can be used **multiple times** to add several include patterns. The final set of files is the union of all matching patterns.
- The `--exclude` / `-e` flag can be used **multiple times** to add several exclude patterns. Excludes are applied after includes.
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

### Include only specific file types

```bash
list-files --include "*.js"
```

Multiple include patterns:

```bash
list-files -i "src/**/*.ts" -i "lib/**/*.ts"
```

### Exclude patterns

```bash
list-files --exclude "**/*.test.js"
```

Multiple excludes:

```bash
list-files -e "node_modules/**" -e "dist/**" -e "*.log"
```

### Combine include and exclude

```bash
list-files -i "**/*.js" -e "**/*.test.js"
```

### Write output to a file

```bash
list-files -o files.txt
list-files ./src -i "*.js" -o output.txt
```

### Absolute paths

```bash
list-files --absolute
```

### Combine all options

```bash
list-files ./project -i "**/*.js" -e "temp/**" -e "*.tmp" --absolute
```

### Use with `xargs` or `grep`

```bash
list-files | grep "config"
list-files --absolute | xargs cat
```

## How it works

1. Resolves the target directory (or uses `.`).
2. Uses `fast-glob` with the provided include patterns (default `**/*`) to list matching files.
3. Applies `--exclude` patterns to the `ignore` option.
4. Outputs each path:
    - Relative to `process.cwd()` by default
    - Absolute when `--absolute` is given
5. Normalizes Windows backslashes to forward slashes for consistency.

## License

MIT
