/**
 * Pre-assigns heading ids with Danish-friendly transliteration (æ→ae, ø→oe, å→aa).
 * Runs before Astro's rehypeHeadingIds so existing ids are preserved and collected into `headings`.
 */
import { visit } from 'unist-util-visit';

function danishSlugBase(text) {
  return String(text)
    .toLowerCase()
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'oe')
    .replace(/å/g, 'aa')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function headingText(node) {
  let text = '';
  visit(node, (child, _, parent) => {
    if (child.type === 'element' || parent == null) return;
    if (child.type === 'text' || child.type === 'raw') {
      text += child.value ?? '';
    }
  });
  return text.trim();
}

export function rehypeDanishHeadingIds() {
  return (tree) => {
    const seen = new Map();
    visit(tree, 'element', (node) => {
      if (!/^h[1-6]$/.test(node.tagName)) return;
      node.properties = node.properties || {};
      if (typeof node.properties.id === 'string' && node.properties.id.length > 0) return;

      const base = danishSlugBase(headingText(node)) || 'sektion';
      const count = seen.get(base) ?? 0;
      seen.set(base, count + 1);
      node.properties.id = count === 0 ? base : `${base}-${count}`;
    });
  };
}
