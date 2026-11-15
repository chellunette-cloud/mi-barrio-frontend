import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const roots = ['src', 'tests', 'scripts', 'migrations'];
const extensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.sql']);
const ignored = new Set(['node_modules', 'dist', 'coverage', 'test-results']);

function walk(dir) {
  const entries = [];
  for (const name of readdirSync(dir)) {
    if (ignored.has(name)) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) entries.push(...walk(path));
    else if (extensions.has(name.slice(name.lastIndexOf('.')))) entries.push(path);
  }
  return entries;
}

const failures = [];
for (const root of roots) {
  let files = [];
  try { files = walk(root); } catch { continue; }
  for (const file of files) {
    if (/(?:internal-schema|api-schema)\.ts$/.test(file)) continue;
    const content = readFileSync(file, 'utf8').replace(/\n$/, '');
    const lines = content.split(/\r?\n/).length;
    if (lines > 100) failures.push(`${relative(process.cwd(), file)}: ${lines} líneas`);
  }
}

if (failures.length) {
  console.error('Archivos que superan 100 líneas:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('OK: todos los archivos de código tienen <= 100 líneas.');
