import {describe, expect, test} from '@jest/globals';
import {parseFunction} from './functions';
import { sourceToFunction } from '../../tests/source';

describe('function docs', () => {
  test('should include summary', () => {
    const source= sourceToFunction(funcStr);

    const item = parseFunction(source, true);

    expect(item.name).toBe("helloWorld");
  });

  test('should include param', () => {
    const source= sourceToFunction(funcStr);

    const item = parseFunction(source, true);

    expect(item.arguments).toHaveProperty(['0', 'name'], 'name');
    expect(item.arguments).toHaveProperty(['0', 'summary'], 'Name to use in hello world.');
  });

  test('should include return value', () => {
    const source= sourceToFunction(funcStr);

    const item = parseFunction(source, true);

    expect(item.returnType).toBe('string')
    expect(item.returnSummary).toBe('Some bajs')
  });
});


const funcStr: string = `/**
* Display hello world.
* @param name Name to use in hello world.
* @returns Some bajs
*/
export function helloWorld(name: string): string {
   console.log(name);
}
`;
