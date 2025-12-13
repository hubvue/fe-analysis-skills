#!/usr/bin/env node

/**
 * Project Architecture Analyzer
 * Analyzes project structure and identifies technology stack, build tools, and patterns.
 */

const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');
const { createRequire } = require('module');

class ProjectAnalyzer {
    constructor(projectPath, options = {}) {
        this.projectPath = path.resolve(projectPath);
        this.options = options;
        this.depth = options.depth || 3;
        this.excludePaths = options.excludePaths || [];
        this.result = {
            success: true,
            data: {},
            metadata: {
                analyzedAt: new Date().toISOString(),
                duration: 0
            }
        };
    }

    async analyze() {
        const startTime = Date.now();

        try {
            // Analyze package manager
            await this.analyzePackageManager();

            // Analyze Node.js environment
            await this.analyzeNodeEnvironment();

            // Analyze framework
            await this.analyzeFramework();

            // Analyze build tools
            await this.analyzeBuildTools();

            // Analyze TypeScript
            await this.analyzeTypeScript();

            // Analyze linters
            await this.analyzeLinters();

            // Analyze directory structure
            await this.analyzeDirectoryStructure();

            // Analyze architecture patterns
            await this.analyzeArchitecturePatterns();

        } catch (error) {
            this.result.success = false;
            this.result.error = error.message;
        }

        // Calculate duration
        this.result.metadata.duration = Date.now() - startTime;

        return this.result;
    }

    async analyzePackageManager() {
        const packageManagers = {
            pnpm: ['pnpm-lock.yaml', 'pnpm-workspace.yaml'],
            yarn: ['yarn.lock'],
            npm: ['package-lock.json']
        };

        for (const [manager, files] of Object.entries(packageManagers)) {
            for (const file of files) {
                const filePath = path.join(this.projectPath, file);
                if (await this.fileExists(filePath)) {
                    const version = await this.getPackageManagerVersion(manager);
                    this.result.data.packageManager = {
                        name: manager,
                        version,
                        lockFile: file
                    };
                    return;
                }
            }
        }

        this.result.data.packageManager = null;
    }

    async analyzeNodeEnvironment() {
        const versionFiles = [
            { file: '.nvmrc', source: 'nvmrc' },
            { file: '.node-version', source: 'nodenv' },
            { file: 'package.json', source: 'engines' }
        ];

        for (const { file, source } of versionFiles) {
            const filePath = path.join(this.projectPath, file);
            if (await this.fileExists(filePath)) {
                if (file === '.nvmrc' || file === '.node-version') {
                    const content = await fs.readFile(filePath, 'utf-8');
                    const version = content.trim();
                    this.result.data.node = {
                        version,
                        source
                    };
                    return;
                } else if (file === 'package.json') {
                    try {
                        const packageJson = JSON.parse(await fs.readFile(filePath, 'utf-8'));
                        if (packageJson.engines && packageJson.engines.node) {
                            this.result.data.node = {
                                version: packageJson.engines.node,
                                source
                            };
                            return;
                        }
                    } catch (error) {
                        // Invalid JSON, continue
                    }
                }
            }
        }

        this.result.data.node = null;
    }

    async analyzeFramework() {
        const packageJsonPath = path.join(this.projectPath, 'package.json');
        if (!await this.fileExists(packageJsonPath)) {
            this.result.data.framework = null;
            return;
        }

        try {
            const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
            const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

            const framework = this.detectFramework(deps);
            const metaFramework = this.detectMetaFramework(deps);

            if (framework) {
                this.result.data.framework = {
                    name: framework.name,
                    version: framework.version,
                    major: framework.major,
                    metaFramework
                };
            } else {
                this.result.data.framework = null;
            }
        } catch (error) {
            this.result.data.framework = null;
        }
    }

    detectFramework(deps) {
        const frameworks = {
            vue: ['vue'],
            react: ['react'],
            angular: ['@angular/core', '@angular/common'],
            svelte: ['svelte'],
            solid: ['solid-js']
        };

        for (const [frameworkName, packages] of Object.entries(frameworks)) {
            for (const pkg of packages) {
                if (deps[pkg]) {
                    const version = deps[pkg];
                    const majorVersion = this.extractMajorVersion(version);
                    return {
                        name: frameworkName,
                        version,
                        major: majorVersion
                    };
                }
            }
        }

        return null;
    }

    detectMetaFramework(deps) {
        const metaFrameworks = {
            nuxt: ['nuxt', '@nuxt/core'],
            next: ['next', 'nextjs'],
            remix: ['remix', '@remix-run/react'],
            gatsby: ['gatsby'],
            astro: ['astro']
        };

        for (const [framework, packages] of Object.entries(metaFrameworks)) {
            if (packages.some(pkg => deps[pkg])) {
                return framework;
            }
        }

        return null;
    }

    async analyzeBuildTools() {
        const buildTools = {
            vite: ['vite'],
            webpack: ['webpack', 'webpack-cli'],
            rollup: ['rollup'],
            parcel: ['parcel'],
            esbuild: ['esbuild'],
            turbopack: ['@next/swc-darwin-x64', '@next/swc-linux-x64-gnu']
        };

        const packageJsonPath = path.join(this.projectPath, 'package.json');
        if (!await this.fileExists(packageJsonPath)) {
            this.result.data.buildTool = null;
            return;
        }

        try {
            const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
            const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

            for (const [tool, packages] of Object.entries(buildTools)) {
                for (const pkg of packages) {
                    if (deps[pkg]) {
                        const configFile = await this.findConfigFile(tool);
                        const version = deps[pkg];
                        this.result.data.buildTool = {
                            name: tool,
                            version,
                            configFile
                        };
                        return;
                    }
                }
            }

            this.result.data.buildTool = null;
        } catch (error) {
            this.result.data.buildTool = null;
        }
    }

    async findConfigFile(tool) {
        const configPatterns = {
            vite: ['vite.config.js', 'vite.config.ts', 'vite.config.mjs'],
            webpack: ['webpack.config.js', 'webpack.config.ts', 'webpackfile.js'],
            rollup: ['rollup.config.js', 'rollup.config.ts', 'rollup.config.mjs'],
            parcel: ['.parcelrc'],
            esbuild: ['esbuild.config.js', 'esbuild.js', 'build.js']
        };

        if (configPatterns[tool]) {
            for (const pattern of configPatterns[tool]) {
                const filePath = path.join(this.projectPath, pattern);
                if (await this.fileExists(filePath)) {
                    return pattern;
                }
            }
        }

        return null;
    }

    async analyzeTypeScript() {
        const tsconfigPath = path.join(this.projectPath, 'tsconfig.json');
        if (!await this.fileExists(tsconfigPath)) {
            this.result.data.typescript = { enabled: false };
            return;
        }

        try {
            const tsconfig = JSON.parse(await fs.readFile(tsconfigPath, 'utf-8'));
            const packageJsonPath = path.join(this.projectPath, 'package.json');
            let packageJson = {};

            if (await this.fileExists(packageJsonPath)) {
                packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
            }

            const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

            const strictMode = tsconfig.compilerOptions?.strict || false;
            const tsVersion = deps.typescript || 'unknown';

            // Calculate TypeScript coverage (simplified)
            const files = await this.readdirRecursive(this.projectPath);
            const tsFiles = files.filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));
            const jsFiles = files.filter(f => f.endsWith('.js') || f.endsWith('.jsx') && !f.includes('node_modules'));

            const totalFiles = tsFiles.length + jsFiles.length;
            const coverage = totalFiles > 0 ? Math.round((tsFiles.length / totalFiles) * 100 * 10) / 10 : 0;

            this.result.data.typescript = {
                enabled: true,
                version: tsVersion,
                strict: strictMode,
                coverage
            };
        } catch (error) {
            this.result.data.typescript = { enabled: true, version: 'unknown', strict: false, coverage: 0 };
        }
    }

    async analyzeLinters() {
        const linters = {};

        // ESLint
        const eslintConfigs = ['.eslintrc.js', '.eslintrc.json', '.eslintrc.yml', '.eslintrc.yaml', '.eslintrc', 'eslint.config.js'];
        for (const config of eslintConfigs) {
            const configPath = path.join(this.projectPath, config);
            if (await this.fileExists(configPath)) {
                linters.eslint = {
                    enabled: true,
                    configFile: config
                };
                break;
            }
        }

        // Prettier
        const prettierConfigs = ['.prettierrc', '.prettierrc.json', '.prettierrc.yml', '.prettierrc.yaml', 'prettier.config.js'];
        for (const config of prettierConfigs) {
            const configPath = path.join(this.projectPath, config);
            if (await this.fileExists(configPath)) {
                linters.prettier = {
                    enabled: true,
                    configFile: config
                };
                break;
            }
        }

        // Stylelint
        const stylelintConfigs = ['.stylelintrc', '.stylelintrc.json', '.stylelintrc.yml', '.stylelintrc.yaml'];
        for (const config of stylelintConfigs) {
            const configPath = path.join(this.projectPath, config);
            if (await this.fileExists(configPath)) {
                linters.stylelint = {
                    enabled: true,
                    configFile: config
                };
                break;
            }
        }

        this.result.data.linters = Object.keys(linters).length > 0 ? linters : null;
    }

    async analyzeDirectoryStructure() {
        const items = await fs.readdir(this.projectPath, { withFileTypes: true });
        const keyDirs = [];

        for (const item of items) {
            if (item.isDirectory() && !this.excludePaths.includes(item.name) && !item.name.startsWith('.')) {
                keyDirs.push(`${item.name}/`);
            }
        }

        // Determine pattern
        let pattern = 'unknown';
        if (keyDirs.includes('src/')) {
            pattern = 'src-based';
        } else if (['components/', 'views/', 'pages/'].some(dir => keyDirs.includes(dir))) {
            pattern = 'feature-based';
        } else if (keyDirs.includes('lib/')) {
            pattern = 'library-based';
        }

        this.result.data.structure = {
            pattern,
            directories: keyDirs
        };
    }

    async analyzeArchitecturePatterns() {
        const patterns = [];

        // Check for Monorepo
        const monorepoFiles = ['pnpm-workspace.yaml', 'lerna.json', 'nx.json'];
        if (await Promise.any(monorepoFiles.map(file => this.fileExists(path.join(this.projectPath, file))))) {
            patterns.push('monorepo');
        }

        // Check for microservices
        const items = await fs.readdir(this.projectPath, { withFileTypes: true });
        if (items.some(item => item.isDirectory() && item.name.startsWith('service-'))) {
            patterns.push('microservices');
        }

        // Check for modular architecture
        const srcPath = path.join(this.projectPath, 'src');
        if (await this.fileExists(srcPath)) {
            const srcItems = await fs.readdir(srcPath, { withFileTypes: true });
            const modules = srcItems.filter(item => item.isDirectory() && !item.name.startsWith('.'));
            if (modules.length > 3) {
                patterns.push('modular');
            }
        }

        // Check for layered architecture
        const layerPatterns = ['controllers', 'services', 'models', 'repositories'];
        let layerCount = 0;
        for (const pattern of layerPatterns) {
            if (await this.fileExists(path.join(srcPath, pattern))) {
                layerCount++;
            }
        }
        if (layerCount >= 2) {
            patterns.push('layered');
        }

        this.result.data.architecturePatterns = patterns.length > 0 ? patterns : null;
    }

    async getPackageManagerVersion(manager) {
        return new Promise((resolve) => {
            const process = spawn(manager, ['--version'], {
                stdio: 'pipe',
                timeout: 5000
            });

            let output = '';
            process.stdout.on('data', (data) => {
                output += data.toString();
            });

            process.on('close', (code) => {
                if (code === 0) {
                    resolve(output.trim());
                } else {
                    resolve(null);
                }
            });

            process.on('error', () => {
                resolve(null);
            });
        });
    }

    extractMajorVersion(version) {
        const match = version.replace(/^[\^~<>=]+/, '').match(/^(\d+)/);
        return match ? parseInt(match[1]) : null;
    }

    async fileExists(filePath) {
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    async readdirRecursive(dir, files = []) {
        const items = await fs.readdir(dir, { withFileTypes: true });

        for (const item of items) {
            const fullPath = path.join(dir, item.name);

            if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
                await this.readdirRecursive(fullPath, files);
            } else if (item.isFile()) {
                files.push(fullPath);
            }
        }

        return files;
    }
}

// CLI interface
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.error('Usage: node analyze-project.js <project_path> [options]');
        process.exit(1);
    }

    const projectPath = args[0];
    let options = {};

    if (args.length > 1) {
        try {
            options = JSON.parse(args[1]);
        } catch (error) {
            console.error('Options must be valid JSON');
            process.exit(1);
        }
    }

    const analyzer = new ProjectAnalyzer(projectPath, options);

    analyzer.analyze()
        .then(result => {
            console.log(JSON.stringify(result, null, 2));
        })
        .catch(error => {
            console.error('Analysis failed:', error.message);
            process.exit(1);
        });
}

module.exports = ProjectAnalyzer;