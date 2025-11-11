#!/usr/bin/env node

/**
 * Backend Build & Deployment Validation Script
 * Run this before deploying to ensure everything is configured correctly
 */

import { readFile } from 'fs/promises';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const checks = {
	passed: [],
	warnings: [],
	errors: []
};

console.log('🔍 SilentVoice Backend Validation\n');
console.log('='.repeat(50) + '\n');

// Check 1: package.json exists and is valid
async function checkPackageJson() {
	try {
		const pkg = require('./package.json');
		checks.passed.push('✓ package.json is valid');
		
		// Check required dependencies
		const required = ['express', 'mongoose', 'cors', 'dotenv', 'bcryptjs', 'jsonwebtoken', 'morgan'];
		const missing = required.filter(dep => !pkg.dependencies[dep]);
		
		if (missing.length > 0) {
			checks.errors.push(`✗ Missing dependencies: ${missing.join(', ')}`);
		} else {
			checks.passed.push('✓ All required dependencies present');
		}
		
		// Check engines
		if (!pkg.engines || !pkg.engines.node) {
			checks.warnings.push('⚠ No Node.js engine specified in package.json');
		} else {
			checks.passed.push(`✓ Node.js engine specified: ${pkg.engines.node}`);
		}
		
		// Check type: module
		if (pkg.type !== 'module') {
			checks.errors.push('✗ package.json should have "type": "module"');
		} else {
			checks.passed.push('✓ ES modules configured');
		}
		
		// Check scripts
		if (!pkg.scripts.start) {
			checks.errors.push('✗ Missing "start" script');
		} else {
			checks.passed.push(`✓ Start script: ${pkg.scripts.start}`);
		}
		
	} catch (error) {
		checks.errors.push('✗ Cannot read package.json: ' + error.message);
	}
}

// Check 2: Required files exist
async function checkRequiredFiles() {
	const files = [
		'src/index.js',
		'src/lib/db.js',
		'src/models/Admin.js',
		'src/models/Report.js',
		'src/routes/auth.js',
		'src/routes/reports.js',
		'src/middleware/auth.js'
	];
	
	for (const file of files) {
		try {
			await readFile(join(__dirname, file));
			checks.passed.push(`✓ Found ${file}`);
		} catch (error) {
			checks.errors.push(`✗ Missing file: ${file}`);
		}
	}
}

// Check 3: Environment configuration
async function checkEnvConfig() {
	try {
		await readFile(join(__dirname, 'env.example'));
		checks.passed.push('✓ env.example exists');
	} catch (error) {
		checks.warnings.push('⚠ env.example not found');
	}
	
	// Check if .env exists (shouldn't be in git, but needed locally)
	try {
		const envContent = await readFile(join(__dirname, '.env'), 'utf-8');
		checks.passed.push('✓ .env file exists');
		
		// Check required variables
		const requiredVars = ['MONGO_URI', 'JWT_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD'];
		const missing = requiredVars.filter(v => !envContent.includes(v));
		
		if (missing.length > 0) {
			checks.warnings.push(`⚠ Missing environment variables in .env: ${missing.join(', ')}`);
		} else {
			checks.passed.push('✓ All required environment variables defined');
		}
		
		// Check JWT_SECRET strength
		if (envContent.includes('JWT_SECRET=please_change_me') || 
		    envContent.includes('JWT_SECRET=dev_secret')) {
			checks.warnings.push('⚠ JWT_SECRET is using default value - change before deploying!');
		}
		
	} catch (error) {
		checks.warnings.push('⚠ .env file not found (required for local development)');
	}
}

// Check 4: Node.js version
function checkNodeVersion() {
	const version = process.version;
	const major = parseInt(version.slice(1).split('.')[0]);
	
	if (major >= 18) {
		checks.passed.push(`✓ Node.js version: ${version} (>= 18 required)`);
	} else {
		checks.errors.push(`✗ Node.js version ${version} is too old. Requires >= 18`);
	}
}

// Check 5: Syntax validation
async function checkSyntax() {
	const { exec } = await import('child_process');
	const { promisify } = await import('util');
	const execAsync = promisify(exec);
	
	const files = [
		'src/index.js',
		'src/lib/db.js',
		'src/models/Admin.js',
		'src/models/Report.js',
		'src/routes/auth.js',
		'src/routes/reports.js',
		'src/middleware/auth.js'
	];
	
	for (const file of files) {
		try {
			await execAsync(`node --check ${file}`);
			checks.passed.push(`✓ Syntax valid: ${file}`);
		} catch (error) {
			checks.errors.push(`✗ Syntax error in ${file}: ${error.message}`);
		}
	}
}

// Run all checks
async function runChecks() {
	await checkPackageJson();
	await checkRequiredFiles();
	await checkEnvConfig();
	checkNodeVersion();
	await checkSyntax();
}

// Display results
function displayResults() {
	console.log('\n' + '='.repeat(50));
	console.log('VALIDATION RESULTS\n');
	
	if (checks.passed.length > 0) {
		console.log('✅ PASSED CHECKS:\n');
		checks.passed.forEach(msg => console.log('  ' + msg));
	}
	
	if (checks.warnings.length > 0) {
		console.log('\n⚠️  WARNINGS:\n');
		checks.warnings.forEach(msg => console.log('  ' + msg));
	}
	
	if (checks.errors.length > 0) {
		console.log('\n❌ ERRORS:\n');
		checks.errors.forEach(msg => console.log('  ' + msg));
	}
	
	console.log('\n' + '='.repeat(50));
	
	const total = checks.passed.length + checks.warnings.length + checks.errors.length;
	console.log(`\nTotal Checks: ${total}`);
	console.log(`Passed: ${checks.passed.length}`);
	console.log(`Warnings: ${checks.warnings.length}`);
	console.log(`Errors: ${checks.errors.length}`);
	
	if (checks.errors.length === 0) {
		console.log('\n✅ Backend is ready for deployment!');
		if (checks.warnings.length > 0) {
			console.log('⚠️  But please review the warnings above.');
		}
		process.exit(0);
	} else {
		console.log('\n❌ Please fix the errors before deploying.');
		process.exit(1);
	}
}

// Main
runChecks()
	.then(displayResults)
	.catch((error) => {
		console.error('Validation script error:', error);
		process.exit(1);
	});
