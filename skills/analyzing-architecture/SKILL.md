---
name: analyzing-architecture
description: Comprehensive project architecture analyzer that identifies technology stacks, build tools, and architectural patterns. Use when you need to quickly understand a project's structure, dependencies, and technical configuration. Provides analysis for frontend frameworks (Vue/React/Angular), Node.js environments, package managers, TypeScript usage, linters, and architecture patterns.
---

# Project Architecture Analyzer

This skill analyzes project architecture and provides a comprehensive overview of the technology stack, build tools, and patterns used in a codebase.

## Quick Start

To analyze a project, provide the project path and optional configuration:

```javascript
const result = await analyzeProject("/path/to/project", {
  depth: 3,
  excludePaths: ["node_modules", ".git"]
});
```

## Core Analysis Capabilities

### Package Manager Detection
Identifies the package manager in use:
- **pnpm** - Detects via `pnpm-lock.yaml` or `pnpm-workspace.yaml`
- **yarn** - Detects via `yarn.lock`
- **npm** - Detects via `package-lock.json`

### Node.js Environment Analysis
Extracts Node.js version requirements from:
- `.nvmrc` file
- `.node-version` file
- `package.json` engines field

### Framework Identification
Detects frontend frameworks and meta-frameworks:

**Main Frameworks:**
- Vue.js
- React
- Angular
- Svelte
- Solid.js

**Meta-Frameworks:**
- Nuxt.js (Vue)
- Next.js (React)
- Remix (React)
- Gatsby (React)
- Astro

### Build Tool Detection
Identifies build tools and bundlers:
- Vite
- Webpack
- Rollup
- Parcel
- esbuild
- Turbopack

### TypeScript Analysis
Analyzes TypeScript configuration:
- Checks `tsconfig.json` presence
- Detects strict mode setting
- Calculates TypeScript coverage percentage
- Extracts TypeScript version

### Linter Detection
Identifies code quality tools:
- ESLint configuration files
- Prettier configuration files
- Stylelint configuration files

### Directory Structure Analysis
Analyzes project organization patterns:
- **src-based**: Projects with `src/` directory
- **feature-based**: Projects with `components/`, `views/`, or `pages/`
- **library-based**: Projects with `lib/` directory

### Architecture Pattern Recognition
Identifies common architectural patterns:
- **Monorepo**: Detects workspace configurations
- **Microservices**: Identifies service-based structure
- **Modular**: Detects module-based organization
- **Layered**: Identifies layered architecture patterns

## Usage Instructions

### Running Analysis

Execute the analysis script with project path:

```bash
node scripts/analyze-project.js /path/to/project
```

With options:

```bash
node scripts/analyze-project.js /path/to/project '{"depth": 2, "excludePaths": ["test"]}'
```

### Input Format

```json
{
  "projectPath": "string (required)",
  "options": {
    "depth": "number (optional, default: 3)",
    "excludePaths": "string[] (optional)"
  }
}
```

### Output Format

```json
{
  "success": true,
  "data": {
    "packageManager": {
      "name": "pnpm",
      "version": "8.0.0",
      "lockFile": "pnpm-lock.yaml"
    },
    "node": {
      "version": ">=18.0.0",
      "source": ".nvmrc"
    },
    "framework": {
      "name": "vue",
      "version": "3.4.0",
      "major": 3,
      "metaFramework": "nuxt"
    },
    "buildTool": {
      "name": "vite",
      "version": "5.0.0",
      "configFile": "vite.config.js"
    },
    "typescript": {
      "enabled": true,
      "version": "5.3.0",
      "strict": true,
      "coverage": 85.5
    },
    "linters": {
      "eslint": {
        "enabled": true,
        "configFile": ".eslintrc.js"
      },
      "prettier": {
        "enabled": true,
        "configFile": ".prettierrc"
      }
    },
    "structure": {
      "pattern": "feature-based",
      "directories": ["src/", "components/", "views/"]
    },
    "architecturePatterns": ["modular", "layered"]
  },
  "metadata": {
    "analyzedAt": "2024-12-13T10:00:00Z",
    "duration": 2500
  }
}
```

## Implementation Notes

- The analysis script is located at `scripts/analyze-project.js`
- Uses Node.js File System API for file operations
- Supports recursive directory traversal with exclusion patterns
- Handles JSON parsing errors gracefully
- Calculates TypeScript coverage based on file extensions
- Uses spawn commands for package manager version detection

## Error Handling

The skill handles various error scenarios:
- Missing or invalid `package.json`
- Invalid JSON configuration files
- File permission issues
- Missing package manager binaries
- Malformed version strings

All errors are captured and reported in the result object while allowing partial analysis completion.
