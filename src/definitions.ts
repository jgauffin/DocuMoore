
export class FunctionDocs {
    constructor(public name: string, public docuId: string) {}
    remarks?: string;
    summary?: string;
    arguments: ArgumentDocs[] = [];
    returnType: string;
    returnSummary?: string;
    tags: Map<string, string> = new Map();
  }
  
  export class ArgumentDocs {
    constructor(
      public name: string,
      public typeName: string,
      public summary: string
    ) {}
  }
  
  export class PropertyDocs {
    constructor(
      public name: string,
      public typeName: string,
      public summary?: string
    ) {}
  }
  
  /**
   * Interface for shared structure for classes and interfaces.
   */
  export interface TypeDoc {

    /**
     * All exported functions.
     */
    functions: FunctionDocs[];

    /**
     * All exported callbacks.
     */
    callbacks: FunctionDocs[];

    /**
     * All exported properties.
     */
    properties: PropertyDocs[];

    /**
     * Class name
     */
    name: string;

    /**
     * Class documentation.
     */
    summary?: string;
  }

  /**
   * 
   */
  export class InterfaceDoc implements TypeDoc {
    constructor(public name: string, public summary?: string) {}
    functions: FunctionDocs[] = [];
    callbacks: FunctionDocs[] = [];
    properties: PropertyDocs[] = [];
  }

  /**
   * A documented class.
   */
  export class ClassDoc implements TypeDoc {
    constructor(public name: string, public summary?: string) {}
    classDoc: globalThis.Function;
    constr?: FunctionDocs;
    functions: FunctionDocs[] = [];
    callbacks: FunctionDocs[] = [];
    properties: PropertyDocs[] = [];
  }
 

  /**
   * Module documentation.
   * 
   * Includes everything defined directly in the module, including exports.
   * Exports with aliases are exported through the @see modules property.
   */
  export class ModuleDoc {
    constructor(public directory: string, public filename: string){

    }

    
    /**
     * Exported functions.
     */
    functions: FunctionDocs[] = [];

    /**
     * Exported callbacks.
     */
    callbacks: FunctionDocs[] = [];

    /**
     * Exported properties.
     */
    properties: PropertyDocs[] = [];

    /**
     * Classes exported from the module.
     */
    classes: ClassDoc[] = [];

    /**
     * Interfaces exported from the module.
     */
    interfaces: InterfaceDoc[] = [];


    /**
     * Modules defined through exports with aliases.
     * 
     * @example export * as moduleName from "./someFile";
     */
    modules: ModuleDoc[]=[];
  }