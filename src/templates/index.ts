import { dirname } from 'path';
import { ModuleDoc } from '../definitions';
import { HtmlGenerator } from './Html';
import { OutputConfiguration } from './TemplateDefinition';
import fs from 'fs';

/**
 * Generate output from the documentation meta that was generated in the previous step.
 * @param config Contains the type of formatter, destination directory etc.
 * @param docs Metadata to generate outfor for.
 */
export function generateOutput(config: OutputConfiguration, docs: ModuleDoc) {
    const generator = config.generator ?? new HtmlGenerator();
    generator.prepare(config);

    const indexOutput = generator.generateModule({
        module: docs,
        pageTitle: docs.filename
    });

    let filename = `${config.outDir}/${docs.filename}.html`;
    ensureDirectory(filename);
    fs.writeFileSync(filename, indexOutput);

    docs.classes.forEach((x) => {
        const outputContents = generator.generateClass({
            module: docs,
            cls: x,
            pageTitle: docs.filename
        });

        filename = `${config.outDir}/${docs.filename}/${x.name}.html`;
        ensureDirectory(filename);
        fs.writeFileSync(filename, outputContents);
    });
}

function ensureDirectory(filename: string) {
    const dir = dirname(filename);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}
