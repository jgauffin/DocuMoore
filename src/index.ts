import { parseFile } from './analyzer';
//import { parseArgs, ParseArgsConfig } from 'util';
import { generateOutput } from './templates';
import path from 'path';
import { Options } from './config/config';

let root = process.cwd();
if (root.endsWith('src') || root.endsWith('out')) {
  const pos = root.lastIndexOf(path.sep);
  root = root.substring(0, pos);
}
console.log('found root', root, process.cwd());

const file = root + '/example/index.ts';
generate({
  entryPoints: file,
  outDir: root + '/out/docs'
});

// const args = ['-f', '--bar', 'b'];
// const config: ParseArgsConfig = {
//   args,
//   options: {
//     foo: {
//       type: 'boolean',
//       short: 'f'
//     },
//     bar: {
//       type: 'string'
//     }
//   }
// };

// const { values, positionals } = parseArgs(config);

/**
 * Generate documentation based on code
 * @param options
 */
export function generate(options: Options) {
  if (typeof options.entryPoints === 'string') {
    const docs = parseFile(options.entryPoints);
    generateOutput(
      {
        docs,
        outDir: options.outDir,
        title: 'Documoore'
      },
      docs
    );
  } else if (Array.isArray(options.entryPoints)) {
    options.entryPoints.forEach((entryPoint) => {
      if (typeof entryPoint === 'string') {
        const docs = parseFile(entryPoint);
        generateOutput(
          {
            docs,
            outDir: options.outDir,
            title: 'Documoore'
          },
          docs
        );
          }
    });
  }
}
