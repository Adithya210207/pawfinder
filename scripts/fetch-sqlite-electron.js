// Downloads the prebuilt better-sqlite3 binary for Electron's ABI.
// Uses prebuild-install (no compiler / node-gyp), so it works even when
// the project path contains spaces — node-gyp does not.
const { spawnSync } = require('child_process');
const path = require('path');

const electronVersion = require('electron/package.json').version;
const arch = process.arch === 'ia32' ? 'ia32' : 'x64';
const sqliteDir = path.dirname(require.resolve('better-sqlite3/package.json'));
const prebuildBin = require.resolve('prebuild-install/bin.js');

console.log(`Fetching better-sqlite3 prebuilt for Electron ${electronVersion} (${arch})…`);

const result = spawnSync(
  process.execPath,
  [prebuildBin, '--runtime', 'electron', '--target', electronVersion, '--arch', arch, '--tag-prefix', 'v'],
  { cwd: sqliteDir, stdio: 'inherit' }
);

if (result.status !== 0) {
  console.error('\nprebuild-install failed for Electron. Cannot continue packaging.');
  process.exit(result.status || 1);
}
console.log('better-sqlite3 Electron binary ready.');
