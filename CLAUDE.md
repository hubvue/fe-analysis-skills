# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
# Test the architecture analyzer skill
npm run test

# Run analysis on a project directly
node skills/architecture-analysis/scripts/analyze-project.js /path/to/project

# Run analysis with options
node skills/architecture-analysis/scripts/analyze-project.js /path/to/project '{"depth": 2, "excludePaths": ["test"]}'

# Unit test generator commands
node skills/unit-test-generator/scripts/detect-test-framework.js /path/to/project
node skills/unit-test-generator/scripts/generate-test.js src/components/Button.js
node skills/unit-test-generator/scripts/setup-test-config.js jest '{"react": true, "typescript": true}'

# Dependency analysis commands
node skills/dependency-analysis/scripts/analyze-dependencies.js /path/to/project
```

## Architecture

This repository contains Claude Code skills for frontend project analysis and testing. The main structure is:

- `skills/architecture-analysis/` - A comprehensive project architecture analyzer skill
- `skills/dependency-analysis/` - Dependency relationship analyzer
- `skills/unit-test-generator/` - Intelligent unit test generator skill
- `.claude-plugin/marketplace.json` - Plugin configuration for the skills collection

### Skills Overview

#### Architecture Analysis Skill
Located in `skills/architecture-analysis/`, this skill detects:
- Package managers (pnpm, yarn, npm)
- Node.js environments
- Frontend frameworks (Vue, React, Angular, Svelte, Solid)
- Meta-frameworks (Nuxt, Next.js, Remix, Gatsby, Astro)
- Build tools (Vite, Webpack, Rollup, Parcel, esbuild)
- TypeScript configuration and coverage
- Linters (ESLint, Prettier, Stylelint)
- Directory structure patterns
- Architecture patterns (monorepo, microservices, modular, layered)

Core scripts:
- `scripts/analyze-project.js` - Main analysis script with configurable options

#### Unit Test Generator Skill
Located in `skills/unit-test-generator/`, this skill provides:
- **Framework Detection**: Automatically identifies Jest, Vitest, Mocha, Jasmine testing setups
- **Smart Test Generation**: Creates tests for React, Vue, Angular components and utility functions
- **Configuration Management**: Generates test configuration files for new projects
- **Template System**: Provides test templates for different frameworks and patterns

Core scripts:
- `scripts/detect-test-framework.js` - Analyzes existing testing infrastructure
- `scripts/generate-test.js` - Generates test code from source files
- `scripts/setup-test-config.js` - Creates testing configuration for new projects

#### Dependency Analysis Skill
Located in `skills/dependency-analysis/`, this skill analyzes package dependencies and generates relationship reports. Features include:

- **Unused Dependencies**: Detects packages that are installed but not used
- **Phantom Dependencies**: Identifies dependencies used but not declared
- **Circular Dependencies**: Finds circular import patterns
- **Security Vulnerabilities**: Scans for known security issues
- **Version Health**: Analyzes package version compatibility

Core scripts:
- `scripts/analyze-dependencies.js` - Main dependency analysis engine

### Skill Structure

All skills follow the standard Claude Code skill structure:
- `SKILL.md` contains the skill definition and documentation with YAML frontmatter
- `package.json` contains metadata and entry points
- `scripts/` contains executable code for core functionality
- `references/` contains documentation and guides loaded as needed
- `assets/` contains templates and files used in output

The skills are designed to be used as Claude Code tools for analyzing, understanding, and improving frontend projects.