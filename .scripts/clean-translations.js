const fs = require('fs');
const path = require('path');

const translationsPath = path.join(__dirname, '..', 'src', 'taskpane', 'owpttTranslations.js');
const root = path.join(__dirname, '..');

function readTranslations() {
  const src = fs.readFileSync(translationsPath, 'utf8');
  // Extract the JS object by replacing the export with a const and evaluating in a VM
  const code = src.replace(/export\s+const\s+owpttTranslations\s*=\s*/, 'const owpttTranslations = ');
  // Evaluate safely
  const vm = require('vm');
  const sandbox = {};
  vm.createContext(sandbox);
  try {
    vm.runInContext(code + '\n;globalThis.__OWPTT_TMP = owpttTranslations;', sandbox, {timeout:2000});
  } catch (e) {
    console.error('Failed to evaluate translations file:', e);
    process.exit(2);
  }
  const translations = sandbox.__OWPTT_TMP;
  return { translations, src };
}

function listSourceFiles() {
  const files = [];
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        // skip node_modules and dist
        if (e.name === 'node_modules' || e.name === 'dist') continue;
        walk(full);
      } else if (e.isFile()) {
        // Only scan relevant files
        if (/\.(js|html|css|ts|jsx|tsx)$/.test(e.name)) files.push(full);
      }
    }
  }
  walk(path.join(root, 'src'));
  return files;
}

function keyUsedInFiles(key, files) {
  const patterns = [
    `data-i18n=\"${key}\"`,
    `data-i18n-placeholder=\"${key}\"`,
    `data-i18n-aria-label=\"${key}\"`,
    `data-i18n='${key}'`,
    `data-i18n-placeholder='${key}'`,
    `t(\"${key}\"`,
    `t('\${key}'`,
    `\"${key}\"`,
    `\'${key}\'`
  ];
  // We will look for t("key") and data-i18n occurrences primarily, but also fallback to raw string
  for (const f of files) {
    const content = fs.readFileSync(f, 'utf8');
    // quick checks
    if (content.indexOf(key) === -1) continue;
    // More specific checks: t("key") or data-i18n attributes
    const re1 = new RegExp(`\\bt\\(\\s*["]${escapeForRegex(key)}["]`);
    const re2 = new RegExp(`data-i18n(\\-|=)\\s*['\"]${escapeForRegex(key)}['\"]`);
    if (re1.test(content) || content.includes(`data-i18n="${key}"`) || content.includes(`data-i18n-placeholder="${key}"`) || content.includes(`data-i18n-aria-label="${key}"`)) {
      return true;
    }
    // As fallback, if the raw key exists inside strings in code, consider used
    const rawRe = new RegExp(`["']${escapeForRegex(key)}["']`);
    if (rawRe.test(content)) return true;
  }
  return false;
}

function escapeForRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function prune() {
  const { translations, src } = readTranslations();
  const en = translations['en-GB'];
  if (!en) {
    console.error('No en-GB translations found');
    process.exit(2);
  }
  const keys = Object.keys(en);
  const files = listSourceFiles();

  const unused = [];
  for (const key of keys) {
    // Skip certain generic keys which might be used dynamically -- keep conservative list
    // For now, treat all keys equally
    const used = keyUsedInFiles(key, files);
    if (!used) unused.push(key);
  }

  console.log('Found', keys.length, 'keys in en-GB, of which', unused.length, 'appear unused.');
  if (unused.length === 0) return { unused: [] };

  // Build new translations object removing unused keys from all locales
  const newTranslations = {};
  for (const locale of Object.keys(translations)) {
    newTranslations[locale] = {};
    for (const k of Object.keys(translations[locale])) {
      if (!unused.includes(k)) newTranslations[locale][k] = translations[locale][k];
    }
  }

  // Serialize back to file: preserve header comment if present
  const headerMatch = src.match(/^[\s\S]*?(?=export\s+const\s+owpttTranslations\s*=)/);
  const header = headerMatch ? headerMatch[0] : '';
  const out = header + 'export const owpttTranslations = ' + JSON.stringify(newTranslations, null, 2) + ';\n';
  fs.writeFileSync(translationsPath, out, 'utf8');
  return { unused, count: unused.length };
}

const res = prune();
if (res && res.unused) {
  console.log('Unused keys removed:', res.unused);
} else if (res && res.count) {
  console.log('Removed', res.count, 'keys');
} else {
  console.log('No unused keys removed');
}
