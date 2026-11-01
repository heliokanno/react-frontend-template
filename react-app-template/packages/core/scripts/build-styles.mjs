// @ts-check
/**
 * Gera os artefatos de estilo da biblioteca em dist/:
 *
 *  - tokens.css          → tokens do Design System inlined (variáveis CSS puras)
 *  - tailwind-preset.css → tokens + mapeamento @theme + variante .dark (para
 *                          consumidores que usam Tailwind v4)
 *  - styles.css          → CSS pré-compilado (Tailwind) para consumidores sem
 *                          Tailwind (fallback)
 *
 * tokens.css e tailwind-preset.css são CSS bruto (o consumidor Tailwind precisa
 * das diretivas @theme/@custom-variant). Só styles.css passa pelo compilador.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const srcStyles = resolve(root, 'src/styles');
const dist = resolve(root, 'dist');

mkdirSync(dist, { recursive: true });

/** Resolve @import relativos de forma rasa, concatenando o conteúdo. */
function inlineImports(entryPath, seen = new Set()) {
  const absolute = resolve(entryPath);
  if (seen.has(absolute)) return '';
  seen.add(absolute);

  const content = readFileSync(absolute, 'utf8');
  const baseDir = dirname(absolute);

  return content.replace(/@import\s+['"]([^'"]+)['"]\s*;/g, (match, importPath) => {
    // Mantém imports de pacotes (ex.: 'tailwindcss') intactos.
    if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
      return match;
    }
    return inlineImports(resolve(baseDir, importPath), seen);
  });
}

// tokens.css: apenas as variáveis, com os @import locais resolvidos.
const tokensCss = inlineImports(resolve(srcStyles, 'tokens.css'));
writeFileSync(resolve(dist, 'tokens.css'), tokensCss);

// tailwind-preset.css: tokens + mapeamento de tema + variante dark (CSS bruto).
const presetRaw = readFileSync(resolve(srcStyles, 'preset.css'), 'utf8');
const presetCss = `${tokensCss}\n${presetRaw}`;
writeFileSync(resolve(dist, 'tailwind-preset.css'), presetCss);

// styles.css: compilado pelo Tailwind (fallback para quem não usa Tailwind).
execFileSync(
  'tailwindcss',
  ['-i', resolve(srcStyles, 'styles.css'), '-o', resolve(dist, 'styles.css'), '--minify'],
  { stdio: 'inherit', cwd: root },
);

console.log('[build-styles] tokens.css, tailwind-preset.css e styles.css gerados em dist/');
