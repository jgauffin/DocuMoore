import { parseClass } from "./classes";
import { sourceToClass } from "../../tests/source";

// import test, {ExecutionContext} from 'ava';

// test('my passing test', (t:ExecutionContext) => {
// 	t.pass();
// });

const cls: string = `/**
* Hello my class!
*/
export class SomeClass{
   /**
    * Some docs
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

   /**
    *  This is a function.
    * @param someArg   This is some arg.
    * @returns if the function succeeded.
    */
   myFunction(someArg: string): boolean {
       return true;
   }

}`;


describe('class documentation parser', () => {
  const node = sourceToClass(cls);

  test('include summary', () => {

    const doc = parseClass(node);

    expect(doc.summary).toBe("Hello my class!");
    expect(doc.name).toBe("SomeClass");
  });


  // Rest if the function parsing is tested in another class.
  test('include function', () => {

    const doc = parseClass(node);

    expect(doc.functions).toHaveProperty([0, 'name'], "myFunction");
  });


  test('include callbacks', () => {

    const doc = parseClass(node);

    expect(doc.callbacks[0].name).toBe("myCallback");
  });

  test('include constructor', () => {

    const doc = parseClass(node);

    expect(doc.constr.summary).toBe("Some docs");
  });
});


