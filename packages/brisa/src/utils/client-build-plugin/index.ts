import type { ESTree } from 'meriyah';

import AST from '@/utils/ast';
import getWebComponentAst from './get-web-component-ast';
import transformToDirectExport from './transform-to-direct-export';
import defineBrisaElement from './define-brisa-element';
import mergeEarlyReturnsInOne from './merge-early-returns-in-one';
import optimizeEffects from './optimize-effects';
import transformToReactiveArrays from './transform-to-reactive-arrays';
import transformToReactiveProps from './transform-to-reactive-props';
import mapComponentStatics from './map-component-statics';
import replaceExportDefault from './replace-export-default';
import processClientAst from './process-client-ast';
import getReactiveReturnStatement from './get-reactive-return-statement';
import { WEB_COMPONENT_ALTERNATIVE_REGEX, NATIVE_FOLDER } from './constants';
import defineCustomElementToAST from './define-custom-element-to-ast';

type ClientBuildPluginConfig = {
  isI18nAdded?: boolean;
  isTranslateCoreAdded?: boolean;
  forceTranspilation?: boolean;
  customElementSelectorToDefine?: null | string;
};

const { parseCodeToAST, generateCodeFromAST } = AST('tsx');
const BRISA_INTERNAL_PATH = '__BRISA_CLIENT__';
const DEFAULT_CONFIG: ClientBuildPluginConfig = {
  isI18nAdded: false,
  isTranslateCoreAdded: false,
  forceTranspilation: false,
  customElementSelectorToDefine: null,
};

export default function clientBuildPlugin(
  code: string,
  path: string,
  config = DEFAULT_CONFIG,
): string {
  const isInternal = path.startsWith(BRISA_INTERNAL_PATH);

  if (
    path.includes(NATIVE_FOLDER) &&
    !isInternal &&
    !config.forceTranspilation
  ) {
    return code;
  }

  const rawAst = parseCodeToAST(code);
  const ast = processClientAst(rawAst, path);
  const astWithDirectExport = transformToDirectExport(ast);
  const out = transformToReactiveProps(astWithDirectExport);
  const reactiveAst = transformToReactiveArrays(out.ast, path);
  const observedAttributesSet = new Set(out.observedAttributes);
  let [componentBranch, exportIndex, identifierIndex] =
    getWebComponentAst(reactiveAst);

  if (
    !componentBranch ||
    (WEB_COMPONENT_ALTERNATIVE_REGEX.test(path) &&
      !isInternal &&
      !config.forceTranspilation)
  ) {
    return generateCodeFromAST(reactiveAst);
  }

  for (const { observedAttributes = new Set<string>() } of Object.values(
    out.statics ?? {},
  )) {
    for (const prop of observedAttributes) observedAttributesSet.add(prop);
  }

  componentBranch = mergeEarlyReturnsInOne(
    optimizeEffects(componentBranch, out.vars),
  );

  // Merge early returns in one + optimize effects inside statics (suspense + error phases)
  mapComponentStatics(reactiveAst, out.componentName, (value, name) => {
    const comp = getReactiveReturnStatement(
      mergeEarlyReturnsInOne(value),
      name,
    ) as ESTree.FunctionDeclaration;
    if (out.statics?.[name]) {
      return optimizeEffects(comp, out.statics[name]!.vars);
    }
    return comp;
  });

  const [importDeclaration, brisaElement, componentAst] = defineBrisaElement(
    componentBranch,
    observedAttributesSet,
    out.componentName,
  );

  // #### Wrap the component with brisaElement ####
  // Replace: export default function Component() {}
  // To: export default brisaElement(Component)
  (reactiveAst.body[exportIndex!] as any).declaration = brisaElement;

  // Replace the component with reactive component
  if (identifierIndex !== -1) {
    // If it was: export default Component (identifier) -> we can replace the original
    // component with the new one.
    reactiveAst.body[identifierIndex!] = componentAst as ESTree.Statement;
  } else {
    // In case of: export default function Component() {} (not identifier), so we need
    // to insert the updated component because the old one was replaced to
    // brisaElement(Component)
    reactiveAst.body.splice(exportIndex!, 0, componentAst as ESTree.Statement);
  }

  // Add the import declaration
  reactiveAst.body.unshift(importDeclaration as ESTree.ImportDeclaration);

  // Useful for internal web components as context-provider
  if (isInternal) {
    const internalComponentName = path.split(BRISA_INTERNAL_PATH).at(-1)!;
    return generateCodeFromAST(
      replaceExportDefault(reactiveAst, internalComponentName),
    );
  }

  // This is used for standalone component builds (library components)
  if (config.customElementSelectorToDefine) {
    defineCustomElementToAST(reactiveAst, {
      selector: config.customElementSelectorToDefine,
      content: brisaElement,
    });
  }

  return generateCodeFromAST(reactiveAst);
}
