#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkDependencies() {
  log('\n🔍 Checking test dependencies...', 'blue');

  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = ['jest', '@types/jest', 'babel-jest'];
  const missingDeps = [];

  requiredDeps.forEach((dep) => {
    if (
      !packageJson.devDependencies?.[dep] &&
      !packageJson.dependencies?.[dep]
    ) {
      missingDeps.push(dep);
    }
  });

  if (missingDeps.length > 0) {
    log(`❌ Missing dependencies: ${missingDeps.join(', ')}`, 'red');
    log('Installing missing dependencies...', 'yellow');

    try {
      execSync(`yarn add -D ${missingDeps.join(' ')}`, { stdio: 'inherit' });
      log('✅ Dependencies installed successfully!', 'green');
    } catch (error) {
      log('❌ Failed to install dependencies', 'red');
      process.exit(1);
    }
  } else {
    log('✅ All dependencies are installed', 'green');
  }
}

function runTypeCheck() {
  log('\n🔍 Running TypeScript type check...', 'blue');

  try {
    execSync('npx tsc --noEmit', { stdio: 'inherit' });
    log('✅ TypeScript check passed!', 'green');
    return true;
  } catch (error) {
    log('❌ TypeScript check failed', 'red');
    return false;
  }
}

function runLinter() {
  log('\n🔍 Running ESLint...', 'blue');

  try {
    execSync('npx eslint "src/**/*.{js,ts,tsx}" "__tests__/**/*.{js,ts,tsx}"', {
      stdio: 'inherit',
    });
    log('✅ Linting passed!', 'green');
    return true;
  } catch (error) {
    log('❌ Linting failed', 'red');
    return false;
  }
}

function runJestTests() {
  log('\n🧪 Running Jest tests...', 'blue');

  try {
    execSync('npx jest', { stdio: 'inherit' });
    log('✅ All tests passed!', 'green');
    return true;
  } catch (error) {
    log('❌ Some tests failed', 'red');
    return false;
  }
}

function runCoverageReport() {
  log('\n📊 Generating coverage report...', 'blue');

  try {
    execSync('npx jest --coverage', { stdio: 'inherit' });
    log('✅ Coverage report generated!', 'green');
    return true;
  } catch (error) {
    log('❌ Coverage generation failed', 'red');
    return false;
  }
}

function runBasicValidation() {
  log('\n🔍 Running basic validation tests...', 'blue');

  const tests = [
    {
      name: 'Check main export file exists',
      test: () => fs.existsSync('./src/index.tsx'),
    },
    {
      name: 'Check TypeScript config exists',
      test: () => fs.existsSync('./tsconfig.json'),
    },
    {
      name: 'Check package.json is valid',
      test: () => {
        try {
          JSON.parse(fs.readFileSync('./package.json', 'utf8'));
          return true;
        } catch {
          return false;
        }
      },
    },
    {
      name: 'Check main export can be imported',
      test: () => {
        try {
          if (!fs.existsSync('./lib/commonjs/index.js')) {
            return false;
          }
          const content = fs.readFileSync('./lib/commonjs/index.js', 'utf8');
          return (
            content.includes('initializeHealth') &&
            content.includes('isAvailable') &&
            content.includes('read') &&
            content.includes('write')
          );
        } catch {
          return false;
        }
      },
    },
  ];

  let passed = 0;

  tests.forEach(({ name, test }) => {
    try {
      if (test()) {
        log(`  ✅ ${name}`, 'green');
        passed++;
      } else {
        log(`  ❌ ${name}`, 'red');
      }
    } catch (error) {
      log(`  ❌ ${name} (${error.message})`, 'red');
    }
  });

  log(
    `\n📊 Basic validation: ${passed}/${tests.length} tests passed`,
    passed === tests.length ? 'green' : 'yellow'
  );

  return passed === tests.length;
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'all';

  log('🚀 React Native Health Link Test Runner', 'cyan');
  log('=========================================', 'cyan');

  let success = true;

  switch (command) {
    case 'deps':
      checkDependencies();
      break;

    case 'types':
      success = runTypeCheck();
      break;

    case 'lint':
      success = runLinter();
      break;

    case 'test':
      success = runJestTests();
      break;

    case 'coverage':
      success = runCoverageReport();
      break;

    case 'basic':
      success = runBasicValidation();
      break;

    case 'all':
    default:
      checkDependencies();
      success =
        runBasicValidation() && runTypeCheck() && runLinter() && runJestTests();
      break;

    case 'help':
      log('\nAvailable commands:', 'yellow');
      log('  deps     - Check and install test dependencies', 'white');
      log('  types    - Run TypeScript type checking', 'white');
      log('  lint     - Run ESLint', 'white');
      log('  test     - Run Jest tests', 'white');
      log('  coverage - Generate coverage report', 'white');
      log('  basic    - Run basic validation tests', 'white');
      log('  all      - Run all tests (default)', 'white');
      log('  help     - Show this help message', 'white');
      return;
  }

  log('\n=========================================', 'cyan');
  if (success) {
    log('🎉 All tests completed successfully!', 'green');
    process.exit(0);
  } else {
    log('❌ Some tests failed. Please check the output above.', 'red');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
