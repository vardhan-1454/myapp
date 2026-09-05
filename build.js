const fs = require('fs');
const { execSync } = require('child_process');

console.log('=== Vercel Build Script Starting ===');
console.log('Current working directory:', process.cwd());

if (fs.existsSync('frontend')) {
  console.log('Detected Root Directory mode. Navigating to frontend...');
  execSync('cd frontend && npm install && npm run build', { stdio: 'inherit' });
} else {
  console.log('Detected Frontend Directory mode. Building directly...');
  execSync('npm install && npm run build', { stdio: 'inherit' });
}
console.log('=== Build Complete Successfully ===');
