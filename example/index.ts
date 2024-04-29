export * from "someFile";
export * as moduleName from "how";
export {SomeType} from "aFile";

/**
 * Display hello world.
 * @param name Name to use in hello world.
 * @returns shit Some bajs
 */
export function helloWorld(name: string): void{


}


/**
 * Hello my class!
 */
export class SomeClass{
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
    constructor(public name: string, private action: number){

    }

    /**
     * This is a callback.
     * @param someValue A string
     * @returns Anything yiou want.
     */
    myCallback: (someValue: string) => any;
}

interface Goto{

}