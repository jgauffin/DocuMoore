
/**
 * Used when there are multiple entrypoints and they should generate different sets of documentation.
 */
export interface EntryPoint {
    /**
     * Documentation title.
     */
    title: string;
  
    /**
     * Directory and filename of the typescript file to use as entry point.
     */
    path: string;
  
    /**
     * Used to overide the default outDir (defined in @see Options).
     */
    outDir?: string;
  }
  
  /**
   * Options for the documentation generation.
   */
  export interface Options {
    /**
     * Relative paths to all entry points.
     *
     */
    entryPoints: string | string[] | EntryPoint[];
  
    /**
     * Will merge all entry points into a single documentation.
     *
     * Will generate one set of documentation per entry point if not specifed.
     */
    mergeEntryPoints?: boolean;
  
    /**
     * Relative directory to where documentation should be stored.
     */
    outDir: string;
  }
  