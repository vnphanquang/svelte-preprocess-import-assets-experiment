import sveltePreprocess from 'svelte-preprocess'
import importAssets from 'svelte-preprocess-import-assets';
import MagicString from 'magic-string';
import { parse } from 'svelte-parse-markup';
import { walk } from 'svelte/compiler';

export function preprocess() {
  /** @type { import('svelte/types/compiler/preprocess').PreprocessorGroup } */
	const preprocessor = {
		markup({ content, filename }) {
			const s = new MagicString(content);
			const ast = parse(content, { filename });

      walk(ast.html, {
        enter(node) {
          if (node.name === 'Image') {
            const srcAttr = node.attributes.find((attr) => attr.name === 'src');
            for (const value of srcAttr.value) {
              if (value?.expression?.type === 'ObjectExpression') {
                for (const prop of value.expression.properties) {
                  if (prop.type === 'Property' && prop.value?.type === 'Literal') {
                    const { start, end } = prop.value;
                    s.update(start, end, `'/vite.svg'`);
                  }
                }
              }
            }
          }
        },
      });

      return {
        code: s.toString(),
        map: s.generateMap(),
      };
    },
	};
  return preprocessor;
}

export default {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    preprocess(),
    // importAssets({
    //   sources: [
    //     {
    //       tag: 'Image',
    //       srcAttributes: ['src'],
    //     },
    //   ],
    // }),
    sveltePreprocess(),
  ]
}
