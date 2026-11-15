import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';

const source = process.env.PUBLIC_CONTRACT_PATH ?? '../mi-barrio-api/contracts/public.openapi.yaml';
const target = 'contracts/public.openapi.yaml';
const hashFile = 'contracts/public.openapi.sha256';

function sha256(content) {
  return createHash('sha256').update(content).digest('hex');
}

if (process.argv.includes('--verify')) {
  if (!existsSync(target) || !existsSync(hashFile)) {
    console.error('Faltan el contrato público sincronizado o su hash');
    process.exit(1);
  }
  const expected = readFileSync(hashFile, 'utf8').trim();
  const actual = sha256(readFileSync(target));
  if (actual !== expected) {
    console.error(`El contrato público no coincide con el hash fijado: ${actual}`);
    process.exit(1);
  }
  if (existsSync(source)) {
    const sourceHash = sha256(readFileSync(source));
    if (sourceHash !== expected) {
      console.error(`El contrato del API cambió; ejecute contracts:sync: ${sourceHash}`);
      process.exit(1);
    }
  }
  console.log(`OK contrato público ${actual}`);
} else {
  if (!existsSync(source)) {
    console.error(`No se encontró el contrato de origen: ${source}`);
    process.exit(1);
  }
  const content = readFileSync(source);
  copyFileSync(source, target);
  writeFileSync(hashFile, `${sha256(content)}\n`);
  console.log(`Sincronizado ${target} desde ${source}`);
}
