import { buildSync } from 'esbuild';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
const temp = mkdtempSync(join(tmpdir(), 'focusverse-design-'));
try {
  const output = join(temp, 'export.cjs');
  buildSync({ entryPoints:['scripts/export-spiderman-design.tsx'], bundle:true, platform:'node', format:'cjs', outfile:output });
  execFileSync(process.execPath, [output], { stdio:'inherit' });
} finally { rmSync(temp, { recursive:true, force:true }); }
