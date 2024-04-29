import { ClassDoc, FunctionDocs, ModuleDoc, TypeDoc } from "../definitions";

export interface OutputConfiguration{

    /**
     * Documentation generated from your source code.
     */
    docs: ModuleDoc;

    /**
     * Documentation title. 
     * 
     * Typically the name of your application/library/framework.
     */
    title: string;

    /**
     * Directory that the templates are located in.
     * 
     * Uses the default templates if not defined.
     */
    templateDir?: string;

    /**
     * Generator to use.
     * 
     * Will use the default generator if not specified.
     */
    generator?: IOutputGenerator;

    /**
     * Directory that the generated files should be saved in.
     */
    outDir: string;
}

export interface FunctionContext extends TemplateContext{

    /**
     * Parent (interface or class). undefined if the function is declared directly in the module.
     */
    parent?: TypeDoc;
    
    /**
     * Function that the documentation is currently being generated for.
     */
    function: FunctionDocs;
}

export interface ClassContext extends TemplateContext{

    /**
     * Class that the documentation is currently being generated for.
     */
    cls: ClassDoc;
}

export interface InterfaceContext extends TemplateContext{

    /**
     * Interface that the documentation is currently being generated for.
     */
    interface: InterfaceContext;
}

export interface ModuleContext extends TemplateContext{
    name: string;
}

export interface TemplateContext{

    /**
     * Title of current page. 
     * 
     * Is the name of the currently generated object (like a function name).
     */
    pageTitle: string;

    /**
     * Module that the documenation is currently being generated.
     */
    module: ModuleDoc;
}

/**
 * Implement this interface to create your own output generator.
 * 
 * Output generates are used to take the documentation structure and generate some sort of files from it.
 */
export interface IOutputGenerator{

    /**
     * Prepare generator for the next documentation to generate.
     * @param config Configuration.
     */
    prepare(config: OutputConfiguration): void;

    /**
     * Generate the module page (but no child pages).
     * @param context 
     */
    generateModule(context: TemplateContext): string;

    /**
     * Generate a class page (but no child pages).
     * @param context 
     */
    generateClass(context: ClassContext): string;

    /**
     * Generate a class page (but no child pages).
     * @param context 
     */
    generateInterface(context: ClassContext): string;

    /**
     * Generate a function page.
     * @param context 
     */
    generateFunction(context: FunctionContext): string;

    /**
     * Generate a callback page.
     * @param context 
     */
    generateCallback(context: FunctionContext): string;
}
