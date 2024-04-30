export * from './someFile';
export * as moduleName from './OneModule';
export { External } from './ExternalThree';

/**
 * Display hello world.
 * @param name Name to use in hello world.
 * @returns shit Some bajs
 */
export function helloWorld(name: string): void {
    console.log(name);
}

/**
 * Hello my class!
 * 
 * @see helloWorld See that one.
 */
export class SomeClass {
    /**
     * Dome docs
     * @param name Some name
     * @param action perform the action.
     * @see helloWorld
     *
     * @example var a = 0;
     * 0+10 = 3;
     *
     * @requires ConditionalExpression
     */
    constructor(
        public name: string,
        private action: number
    ) {}

    /**
     * This is a callback.
     * @param someValue A string
     * @returns Anything yiou want as long as it's a string.
     */
    myCallback: (someValue: string) => string;

    /**
     *  This is a function.
     * @param someArg   This is some arg.
     * @returns if the function succeeded.
     */
    myFunction(someArg: string): boolean {
        console.log(someArg);
        return true;
    }
}

export interface Goto {}
