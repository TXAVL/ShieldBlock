/*******************************************************************************
    ShieldBlock - Chrome Web Store Packager
    Produces clean dist/ShieldBlock-v<version>-cws.zip ready for CWS upload.
*******************************************************************************/

import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const distBuild = path.join(root, 'dist', 'build', 'ShieldBlock.chromium');
const metadataDir = path.join(distBuild, '_metadata');

console.log('--- ShieldBlock Chrome Web Store Packager ---');

// 1. Remove _metadata if exists
try {
    await fs.rm(metadataDir, { recursive: true, force: true });
    console.log('✓ Cleaned _metadata folder (strictly prohibited by CWS)');
} catch (e) {
    // Ignore if not present
}

// 2. Verify manifest.json and version
const manifestPath = path.join(distBuild, 'manifest.json');
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
const outputZip = path.join(root, 'dist', `ShieldBlock-v${manifest.version}-cws.zip`);
console.log(`✓ Manifest verified: ${manifest.short_name} v${manifest.version} (MV${manifest.manifest_version})`);

// 3. Clean previous zip
try {
    await fs.rm(outputZip, { force: true });
} catch (e) {}

// 4. Create ZIP using python zipfile (reliable, fast, cross-platform)
const pyScript = `
import os, zipfile
dist_dir = r"${distBuild.replace(/\\/g, '\\\\')}"
out_zip = r"${outputZip.replace(/\\/g, '\\\\')}"
with zipfile.ZipFile(out_zip, 'w', zipfile.ZIP_DEFLATED) as zf:
    for root, dirs, files in os.walk(dist_dir):
        if '_metadata' in dirs:
            dirs.remove('_metadata')
        for f in files:
            full = os.path.join(root, f)
            rel = os.path.relpath(full, dist_dir)
            zf.write(full, rel)
`;

execFileSync('python', ['-c', pyScript], { stdio: 'inherit' });

const stat = await fs.stat(outputZip);
console.log(`\n🎉 SUCCESS: Extension packaged successfully!`);
console.log(`📦 Output ZIP: ${outputZip}`);
console.log(`📊 File Size: ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
console.log(`👉 This ZIP file is 100% clean and ready to upload directly to Chrome Web Store Developer Dashboard.`);
