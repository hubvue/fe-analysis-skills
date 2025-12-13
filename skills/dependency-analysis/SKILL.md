---
name: analyzing-dependencies
description: Comprehensive dependency analyzer that identifies unused, missing, phantom, and circular dependencies. Use when you need to clean up project dependencies, detect potential issues with dependency management, optimize bundle size, or ensure dependency health. Provides analysis for all dependency types including detection of security vulnerabilities and outdated packages.
---

# Dependency Analyzer

This skill analyzes project dependencies and provides insights into dependency health, unused packages, missing dependencies, phantom dependencies, and circular imports.

## Quick Start

To analyze project dependencies, provide the project path and optional configuration:

```javascript
const result = await analyzeProject("/path/to/project", {
  scope: "all",  // 'dependencies' | 'devDependencies' | 'all'
  generateGraph: false,
  checkSecurity: false,
  files: "all"  // 'changed' | 'all' | string[]
});
```

## Core Analysis Capabilities

### Dependency Detection

**Unused Dependencies**: Identifies packages that are installed but never imported in the codebase, helping reduce bundle size and cleanup.

**Missing Dependencies**: Detects imports in code that don't have corresponding packages installed, suggesting required dependencies.

**Phantom Dependencies**: Finds dependencies that work because they're nested under other packages but aren't explicitly declared, which can break when dependencies are updated.

**Circular Dependencies**: Detects circular import patterns that can cause runtime errors and bundling issues.

### Analysis Options

**Scope Control**:
- `dependencies` - Analyze only production dependencies
- `devDependencies` - Analyze only development dependencies
- `all` - Analyze all dependency types (default)

**File Analysis**:
- `all` - Analyze all source files
- `changed` - Analyze only modified files
- `string[]` - Analyze specific file paths

**Advanced Options**:
- `generateGraph` - Generate dependency relationship graph
- `checkSecurity` - Perform security vulnerability check
- `checkOutdated` - Check for outdated package versions

## Usage Instructions

### Running Analysis

Execute the analysis script with project path:

```bash
node scripts/analyze-dependencies.js /path/to/project
```

With options:

```bash
node scripts/analyze-dependencies.js /path/to/project '{"scope": "dependencies", "checkSecurity": true}'
```

### Input Format

```json
{
  "projectPath": "string (required)",
  "options": {
    "scope": "dependencies | devDependencies | all",
    "generateGraph": "boolean (default: false)",
    "checkSecurity": "boolean (default: false)",
    "files": "string[] | 'changed' | 'all'"
  }
}
```

### Output Format

```json
{
  "success": true,
  "data": {
    "summary": {
      "total": 150,
      "unused": 5,
      "missing": 2,
      "phantom": 3,
      "circular": 1,
      "outdated": 10,
      "vulnerable": 1
    },
    "unused": [
      {
        "name": "lodash",
        "confidence": "high",
        "reason": "未在任何文件中导入",
        "type": "dependencies",
        "version": "^4.17.21"
      }
    ],
    "missing": [
      {
        "name": "axios",
        "usedIn": ["src/api/request.js"],
        "suggestDep": "dependencies",
        "confidence": "high"
      }
    ],
    "phantom": [
      {
        "name": "vue-router",
        "chain": ["vue-project-helper", "vue-router"],
        "risk": "medium",
        "reason": "如果直接依赖升级或移除，此依赖可能不可用",
        "version": "4.2.5"
      }
    ],
    "circular": [
      {
        "path": ["src/moduleA.js", "src/moduleB.js", "src/moduleA.js"],
        "severity": "high"
      }
    ],
    "outdated": [
      {
        "name": "webpack",
        "current": "^3.0.0",
        "latest": "^5.0.0",
        "type": "devDependencies"
      }
    ],
    "vulnerable": [
      {
        "name": "lodash",
        "version": "^4.17.15",
        "severity": "medium",
        "recommendation": "升级到最新版本"
      }
    ]
  },
  "warnings": [
    "检测到 3 个幽灵依赖，建议显式声明"
  ],
  "metadata": {
    "analyzedAt": "2024-12-13T10:00:00Z",
    "duration": 3500,
    "scope": "all",
    "filesAnalyzed": ["src/**/*.js", "src/**/*.ts"]
  }
}
```

## Implementation Details

### Detection Algorithms

**Unused Dependency Detection**:
- Scans all source files for import statements using AST parsing
- Matches imports against declared dependencies
- Handles ES6 imports, CommonJS requires, and dynamic imports
- Considers tool-specific patterns (babel presets, webpack loaders)

**Phantom Dependency Detection**:
- Identifies imports that resolve but aren't declared
- Traces dependency chains through node_modules
- Assesses risk based on dependency depth
- Provides upgrade impact analysis

**Circular Dependency Detection**:
- Builds dependency graph from import statements
- Uses depth-first search to detect cycles
- Provides complete cycle paths
- Assesses severity based on cycle length

### File Analysis

**Supported File Types**:
- JavaScript (.js, .jsx, .mjs, .cjs)
- TypeScript (.ts, .tsx)
- JSON configuration files

**Import Pattern Detection**:
- ES6: `import ... from 'module'`
- CommonJS: `require('module')`
- Dynamic: `import('module')`
- Conditional: `require.resolve('module')`

### Performance Optimizations

- Parallel file analysis for large codebases
- Incremental analysis support for `files: 'changed'`
- Efficient dependency graph construction
- Memory-conscious traversal algorithms

## Error Handling

The skill handles various error scenarios:
- Missing or invalid `package.json`
- File permission issues
- Malformed source files
- Invalid dependency versions
- Network errors for security checks

## Integration Examples

### Pre-commit Hook
```bash
#!/bin/bash
echo "检查依赖健康度..."
node scripts/analyze-dependencies.js . '{"scope": "dependencies"}'
```

### CI/CD Pipeline
```yaml
- name: Check Dependencies
  run: |
    node scripts/analyze-dependencies.js . '{
      "checkSecurity": true,
      "checkOutdated": true
    }'
```

### Bundle Optimization
```javascript
const analyzer = new DependencyAnalyzer('./', {
  scope: 'all',
  generateGraph: true
});

const result = await analyzer.analyze();

// Remove unused dependencies
result.data.unused.forEach(dep => {
  if (dep.confidence === 'high') {
    console.log(`Consider removing: ${dep.name}`);
  }
});
```

## Best Practices

1. **Regular Analysis**: Run dependency analysis regularly to catch issues early
2. **Scope Appropriately**: Use specific scopes for targeted analysis
3. **Review Phantom Deps**: Always review phantom dependencies before adding them
4. **Address High-Severity Issues**: Prioritize fixing circular dependencies and security issues
5. **Validate Before Cleanup**: Verify unused dependencies before removal
6. **Monitor Update Impact**: Check dependency chains before major updates