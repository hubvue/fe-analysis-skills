# Project Architecture Analyzer Skill

A comprehensive skill for analyzing project architecture and identifying technology stacks, build tools, and architectural patterns.

## Installation

This skill is packaged as a `.skill` file for easy installation in Claude Code environments.

## Usage

```bash
# Analyze current directory
skill use analyzing-architecture --path .

# Analyze specific project
skill use analyzing-architecture --path /path/to/project --options '{"depth": 3}'
```

## Features

- ✅ Package manager detection (npm, yarn, pnpm)
- ✅ Node.js environment analysis
- ✅ Framework identification (Vue, React, Angular, etc.)
- ✅ Meta-framework detection (Next.js, Nuxt, Remix, etc.)
- ✅ Build tool identification (Vite, Webpack, etc.)
- ✅ TypeScript configuration analysis
- ✅ Linter detection (ESLint, Prettier, Stylelint)
- ✅ Directory structure analysis
- ✅ Architecture pattern recognition

## Output

The skill provides a structured JSON output containing:
- Technology stack information
- Build tool configurations
- TypeScript usage statistics
- Code quality tool setup
- Architecture patterns in use
- Analysis metadata

## Example Output

See the SKILL.md file for detailed output format examples.