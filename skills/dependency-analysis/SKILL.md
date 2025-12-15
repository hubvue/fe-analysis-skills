---
name: dependency-analysis
description: Advanced dependency analyzer with peer dependency detection, import analysis, and deep dependency inspection. Use when you need to clean up project dependencies, detect peer dependency conflicts, find unused packages, identify phantom dependencies, detect circular imports, check security vulnerabilities, or optimize bundle size. Analyzes JavaScript/TypeScript imports, CSS imports, framework-specific patterns, and provides actionable recommendations for dependency management.
---

# Advanced Dependency Analyzer

Comprehensive dependency analysis tool that identifies unused packages, missing dependencies, phantom dependencies, peer dependency conflicts, and circular imports.

## Quick Start

Analyze any JavaScript/TypeScript project:

```bash
node scripts/analyze-dependencies-v2.js /path/to/project

# With options
node scripts/analyze-dependencies-v2.js /path/to/project --checkPeerDependencies --checkOutdated
```

## Core Capabilities

### Dependency Detection
- **Unused Dependencies**: Packages installed but never imported
- **Missing Dependencies**: Imports without corresponding packages
- **Phantom Dependencies**: Nested dependencies that work but aren't declared
- **Peer Dependencies**: Conflicts and missing peer dependencies
- **Circular Dependencies**: Import cycles that cause runtime issues

### Advanced Features
- **Deep Import Analysis**: Supports ES6, CommonJS, dynamic imports, TypeScript path mapping
- **Framework Support**: Vue.js, React, Svelte, Next.js, Nuxt.js specific patterns
- **Style Imports**: CSS @import, SCSS @use/@forward detection
- **Alias Resolution**: TypeScript paths, Webpack aliases, Vite aliases
- **Security Scanning**: Known vulnerability detection
- **Version Analysis**: Outdated package identification
- **Health Scoring**: Overall dependency quality assessment

## Usage Examples

### Basic Analysis
```bash
node scripts/analyze-dependencies-v2.js .
```

### Full Analysis with All Features
```bash
node scripts/analyze-dependencies-v2.js . \
  --checkPeerDependencies \
  --checkOutdated \
  --checkSecurity \
  --scope=all \
  --includeDev
```

### Production Dependencies Only
```bash
node scripts/analyze-dependencies-v2.js . --scope=dependencies
```

## Output Format

```json
{
  "success": true,
  "data": {
    "summary": {
      "total": 150,
      "unused": 5,
      "missing": 2,
      "phantom": 3,
      "outdated": 10,
      "vulnerable": 1,
      "peerConflicts": 2,
      "circular": 1
    },
    "health": {
      "score": 75,
      "issues": [
        "Remove 5 unused dependencies",
        "Install 2 missing dependencies"
      ]
    }
  }
}
```

## Import Pattern Detection

The analyzer supports:
- JavaScript/TypeScript: `import`, `require()`, dynamic imports
- Vue.js: Script blocks, template imports, style imports
- Svelte: Script imports, style imports
- CSS/SCSS: `@import`, `@use`, `@forward`
- Framework-specific: Next.js dynamic imports, Vue async components

## Reference Documentation

Detailed implementation guides and patterns:

- **Import Patterns**: See [import-patterns.md](references/import-patterns.md)
- **Peer Dependencies**: See [peer-dependency-analysis.md](references/peer-dependency-analysis.md)
- **Deep Analysis**: See [deep-dependency-patterns.md](references/deep-dependency-patterns.md)