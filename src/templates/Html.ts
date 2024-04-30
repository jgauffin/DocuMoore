import fs from 'fs';
import {
    ClassContext,
    FunctionContext,
    IOutputGenerator,
    OutputConfiguration,
    TemplateContext
} from './TemplateDefinition';
import mustache from 'mustache';

export class HtmlGenerator implements IOutputGenerator {
    private config: OutputConfiguration;
    private templateDir: string;

    prepare(config: OutputConfiguration) {
        this.config = config;

        this.templateDir = config.templateDir ?? __dirname + '/html/';
        if (this.templateDir.indexOf('\\out\\') >= 0) {
            this.templateDir = this.templateDir.replace('\\out\\', '\\src\\');
        }
        if (this.templateDir.indexOf('/out/') >= 0) {
            this.templateDir = this.templateDir.replace('/out/', '/src/');
        }
    }

    generateModule(context: TemplateContext): string {
        return this.render('module', context);
    }

    generateClass(context: ClassContext): string {
        return this.render('class', context);
    }
    generateInterface(context: ClassContext): string {
        return this.render('interface', context);
    }
    generateFunction(context: FunctionContext): string {
        return this.render('function', context);
    }
    generateCallback(context: FunctionContext): string {
        return this.render('callback', context);
    }

    private render(templateName: string, viewData: TemplateContext) {
        const template = this.loadTemplate(templateName);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = <any>viewData;
        for (const key in data) {
            if (Array.isArray(data[key])) {
                data['has' + key] = data[key].length > 0;
            }
        }

        const contents = mustache.render(template, data);

        const layout = this.loadTemplate('layout');
        return mustache.render(layout, {
            documentationTitle: this.config.title,
            page: {
                title: viewData.pageTitle,
                contents
            }
        });
    }
    private loadTemplate(templateName: string): string {
        const buffer = fs.readFileSync(this.templateDir + templateName + '.html');
        return buffer.toString();
    }
}
