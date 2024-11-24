import { describe, expect, it } from 'bun:test';
import type { ESTree } from 'meriyah';

import defineBrisaElement from '.';
import * as BRISA_CLIENT from '@/core/client';
import { normalizeHTML } from '@/helpers';
import AST from '@/utils/ast';
import getPropsNames from '@/build-process/2-entrypoints/3-client-pages/transpilation/get-props-names';
import getWebComponentAst from '@/build-process/2-entrypoints/3-client-pages/transpilation/get-web-component-ast';

const { parseCodeToAST, generateCodeFromAST } = AST('tsx');
const output = (ast: any) =>
  normalizeHTML(generateCodeFromAST(ast as unknown as ESTree.Program));

describe('utils', () => {
  describe('client-build-plugin', () => {
    describe('defineBrisaElement', () => {
      it('should exist all the import declarations from brisa/client', () => {
        const code = `
          export default function MyComponent({ exampleProp }) {
            return ['div', {}, () => exampleProp.value]
          }
        `;

        const ast = parseCodeToAST(code);
        const [component] = getWebComponentAst(ast);
        const [propNames] = getPropsNames(component!);
        const [importDeclaration] = defineBrisaElement(
          component!,
          propNames,
          'MyComponent',
        );

        (importDeclaration as ESTree.ImportDeclaration).specifiers.forEach(
          (specifier) => {
            expect((BRISA_CLIENT as any)[specifier.local.name]).toBeDefined();
          },
        );
      });
      it('should wrap the web-component with brisaElement and return the import declaration', () => {
        const code = `
          export default function MyComponent({ exampleProp }) {
            return ['div', {}, () => exampleProp.value]
          }
        `;
        const ast = parseCodeToAST(code);
        const [component] = getWebComponentAst(ast);
        const [propNames] = getPropsNames(component!);
        const [importDeclaration, brisaElement, wrappedComponent] =
          defineBrisaElement(component!, propNames, 'MyComponent');
        expect(output(importDeclaration)).toBe(
          'import {brisaElement, _on, _off} from "brisa/client";',
        );
        expect(output(brisaElement)).toBe(
          `brisaElement(MyComponent, ["exampleProp"])`,
        );
        expect(output(wrappedComponent)).toBe(
          normalizeHTML(`
          function MyComponent({exampleProp}) {
            return ["div", {}, () => exampleProp.value];
          }
        `),
        );
      });

      it('should work with fragments and props', () => {
        const code = `
          export default function MyComponent(props) {
            return [null, {}, [["div", {}, () => props.foo.value], ["span", {}, () => props.bar.value]]]
          }
        `;
        const ast = parseCodeToAST(code);
        const [component] = getWebComponentAst(ast);
        const [propNames] = getPropsNames(component!);
        const [importDeclaration, brisaElement, wrappedComponent] =
          defineBrisaElement(component!, propNames, 'MyComponent');
        expect(output(importDeclaration)).toBe(
          'import {brisaElement, _on, _off} from "brisa/client";',
        );
        expect(output(brisaElement)).toBe(
          `brisaElement(MyComponent, ["foo", "bar"])`,
        );
        expect(output(wrappedComponent)).toBe(
          normalizeHTML(`
          function MyComponent(props) {
              return [null, {}, [["div", {}, () => props.foo.value], ["span", {}, () => props.bar.value]]];
          }
        `),
        );
      });
    });
  });
});
