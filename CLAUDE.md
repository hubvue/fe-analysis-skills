# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
# Test the architecture analyzer skill
npm run test

# Run analysis on a project directly
node fe-analysis-skills/analyzing-architecture/scripts/analyze-project.js /path/to/project

# Run analysis with options
node fe-analysis-skills/analyzing-architecture/scripts/analyze-project.js /path/to/project '{"depth": 2, "excludePaths": ["test"]}'
```

## Architecture

This repository contains Claude Code skills for frontend project analysis. The main structure is:

- `fe-analysis-skills/analyzing-architecture/` - A comprehensive project architecture analyzer skill
- `.claude-plugin/marketplace.json` - Plugin configuration for the skills collection

### Architecture Analyzer Skill

The core skill is located in `fe-analysis-skills/analyzing-architecture/` and consists of:

- `scripts/analyze-project.js` - Main analysis script that detects technology stacks, build tools, and architectural patterns
- `package.json` - Skill metadata and configuration
- `SKILL.md` - Skill documentation and usage instructions

The analyzer detects:
- Package managers (pnpm, yarn, npm)
- Node.js environments
- Frontend frameworks (Vue, React, Angular, Svelte, Solid)
- Meta-frameworks (Nuxt, Next.js, Remix, Gatsby, Astro)
- Build tools (Vite, Webpack, Rollup, Parcel, esbuild)
- TypeScript configuration and coverage
- Linters (ESLint, Prettier, Stylelint)
- Directory structure patterns
- Architecture patterns (monorepo, microservices, modular, layered)

### Skill Structure

This is a Claude Code skill plugin where each skill follows the standard structure:
- `SKILL.md` contains the skill definition and documentation
- `package.json` contains metadata and entry points
- Implementation files are in subdirectories

The skills are designed to be used as Claude Code tools for analyzing and understanding frontend projects quickly.