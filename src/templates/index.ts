import { dirname } from "path";
import { ModuleDoc } from "../definitions";
import { HtmlGenerator } from "./Html";
import { OutputConfiguration } from "./TemplateDefinition";
import fs from "fs";

export function generateOutput(config: OutputConfiguration, docs: ModuleDoc){
    var generator = config.generator ?? new HtmlGenerator();
    generator.prepare(config);

    var html = generator.generateModule({
        module: docs,
        pageTitle: docs.filename
    });

    let filename=`${config.outDir}/${docs.filename}.html`;
    ensureDirectory(filename);
    fs.writeFileSync(filename, html);

    docs.classes.forEach(x => {
    
        var html = generator.generateClass({
            module: docs,
            cls: x,
            pageTitle: docs.filename
        });

        filename=`${config.outDir}/${docs.filename}/${x.name}.html`;
        ensureDirectory(filename);
        fs.writeFileSync(filename, html);

    })

}

function ensureDirectory(filename: string){
    var dir = dirname(filename);
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
}