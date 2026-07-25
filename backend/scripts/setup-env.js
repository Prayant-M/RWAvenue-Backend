const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const envFiles = [
  { example: '.env.example', target: '.env' },
  { example: path.join('frontend', '.env.example'), target: path.join('frontend', '.env') }
];

for (const { example, target } of envFiles) {
  const examplePath = path.join(rootDir, example);
  const targetPath = path.join(rootDir, target);

  if (!fs.existsSync(examplePath)) {
    console.warn(`[setup-env] Skipped ${target}: ${example} not found`);
    continue;
  }

  if (fs.existsSync(targetPath)) {
    console.log(`[setup-env] Kept existing ${target}`);
    continue;
  }

  fs.copyFileSync(examplePath, targetPath);
  console.log(`[setup-env] Created ${target} from ${example}`);
}
