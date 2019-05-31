import * as FlattenJS from 'flattenjs';
import uniq from 'lodash/uniq';
import get from 'lodash/get';

const lastArrayAccessor = new RegExp(/\[\d*\]$/);

function getUniqueKeys(obj: any) {
  const keys = Object.keys(obj).map(s => s.replace(lastArrayAccessor, ''));
  return uniq(keys);
}

const generateCssClasses = (values, unit = '', indexOffset = 0) => (key, prop) => {
  if (Array.isArray(values)) {
    return values.reduce((acc, value, index) => {
      return `${acc}\n.${key}${index + indexOffset} { ${prop}: ${value}${unit}; }`;
    }, '')
  }

  return `.${key} { ${prop}: ${values}${unit}; }\n`;
}

function stringifyArray(...rest) {
  return [rest].join('\n');
}

interface MapperFunction {
  values: any;
  unit?: string;
  path?: string;
};

const transformMap = {
  space: ({ values, unit = 'px' }: MapperFunction): string[] => {
    const generator = generateCssClasses(values, unit);
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
    const generator = generateCssClasses(Array.isArray(values) ? values : [values], unit, 1);
    return [...generator('f', 'font-size')];
  },
  colors: ({ values, path }: MapperFunction): string[] => {
    const key = path && path.split('.').slice(1).join('-');
    const generator = generateCssClasses(values);

    return [
      ...generator(Array.isArray(values) ? `${key}-` : key, 'color'),
      ...generator(`bg-${key}`, 'background-color'),
      ...generator(`b-${key}`, 'border-color'),
    ];
  }
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
    return getUniqueKeys(this.flatTheme);
  }

  convertToCss() {
    const css = this.uniquePaths.reduce((acc, path) => {
      const wantedMapper = path.split('.')[0];
      const mapperFunction = transformMap[wantedMapper];

      if (mapperFunction) {
        const values = get(this.theme, path);
        return `${acc}\n${stringifyArray(mapperFunction({ values, path }))}`;
      }
      return acc;
    }, '');

    console.log(css);
  }
}
