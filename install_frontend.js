const { execSync } = require('child_process');
const path = require('path');

const frontendDir = path.join(__dirname, 'frontend');
console.log('Installing frontend packages with verbose log...');

try {
  const output = execSync('npm.cmd install --no-audit --no-fund', {
    cwd: frontendDir,
    encoding: 'utf-8',
    shell: true
  });
  console.log(output);
  console.log('✅ Frontend dependencies installed successfully!');
} catch (error) {
  console.error('❌ Installation error:', error.stdout || error.message);
  process.exit(1);
}
