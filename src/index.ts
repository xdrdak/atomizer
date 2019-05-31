import * as FlattenJS from 'flattenjs';
import uniq from 'lodash/uniq';
import get from 'lodash/get';

const lastArrayAccessor = new RegExp(/\[\d*\]$/);

const atomicCssGenerator = ({ values, unit = '', indexOffset = 0 }) => (
  key,
  prop
) => {
  if (Array.isArray(values)) {
    return values.reduce((acc, value, index) => {
      return `${acc}\n.${key}${index +
        indexOffset} { ${prop}: ${value}${unit}; }`;
    }, '');
  }

  return `.${key} { ${prop}: ${values}${unit}; }\n`;
};

function stringifyArray(...rest) {
  return [rest].join('\n');
}

interface MapperFunction {
  values: any;
  unit?: string;
  path?: string;
}

function getLastPath(path) {
  return (
    path &&
    path
      .split('.')
      .slice(1)
      .join('-')
  );
}

const transformMap = {
  space: ({ values, unit = 'px' }: MapperFunction): string[] => {
    const generator = atomicCssGenerator({ values, unit });
    return [
      ...generator('pa', 'padding'),
      ...generator('pt', 'padding-top'),
      ...generator('pb', 'padding-bottom'),
      ...generator('pl', 'padding-left'),
      ...generator('pr', 'padding-right'),
      ...generator('ma', 'margin'),
      ...generator('mt', 'margin-top'),
      ...generator('mb', 'margin-bottom'),
      ...generator('ml', 'margin-left'),
      ...generator('mr', 'margin-right'),
    ];
  },
  fontSizes: ({ values, unit = 'px' }: MapperFunction): string[] => {
    const generator = atomicCssGenerator({ values, unit, indexOffset: 1 });
    return [...generator('f', 'font-size')];
  },
  fontWeights: ({ values, path }: MapperFunction): string[] => {
    const generator = atomicCssGenerator({ values });
    const key = getLastPath(path);

    return [...generator(`fw-${key}`, 'font-weight')];
  },
  colors: ({ values, path }: MapperFunction): string[] => {
    const key = getLastPath(path);
    const generator = atomicCssGenerator({ values });
    const nextKey = Array.isArray(values) ? `${key}-` : key;

    return [
      ...generator(nextKey, 'color'),
      ...generator(`bg-${nextKey}`, 'background-color'),
      ...generator(`b-${nextKey}`, 'border-color'),
    ];
  },
};

// https://system-ui.com/theme/
export class Atomizer {
  private themeObject: any;
  private flattenedObject: any;

  constructor(themeObject: any) {
    this.themeObject = themeObject;
    this.flattenedObject = FlattenJS.convert(themeObject);
  }

  get theme() {
    return this.themeObject;
  }

  get flatTheme() {
    return this.flattenedObject;
  }

  get uniquePaths() {
    const keys = Object.keys(this.flatTheme).map(s =>
      s.replace(lastArrayAccessor, '')
    );
    return uniq(keys);
  }

  convertToCss() {
    const output = this.uniquePaths.reduce((acc, path) => {
      const wantedMapper = path.split('.')[0];
      const mapperFunction = transformMap[wantedMapper];

      if (mapperFunction) {
        const values = get(this.theme, path);
        return `${acc}\n${stringifyArray(mapperFunction({ values, path }))}`;
      }
      return acc;
    }, '');

    return output;
  }
}
