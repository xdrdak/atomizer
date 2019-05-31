import { Atomizer } from '../src';

const testThemeObject = {
  space: [0, 4, 8, 16, 32, 64],
  fontSizes: [12, 14, 16, 20],
  fontWeights: {
    normal: '400',
    bold: 'bold',
  },
  colors: {
    blues: ['#004170', '#006fbe', '#2d8fd5', '#5aa7de'],
    green: '#0fa',
    red: {
      100: 'red',
      200: 'darkred',
    },
  },
  fonts: {
    serif: 'Helvetica',
  },
};

const myAtomizer = new Atomizer(testThemeObject);
const css = myAtomizer.convertToCss();

describe('Atomizer', () => {
  describe('Spaces', () => {
    it('should have created a bunch of padding classes', () => {
      testThemeObject.space.forEach((value, index) => {
        expect(css).toMatch(`.pa${index} { padding: ${value}px; }`);
        expect(css).toMatch(`.pt${index} { padding-top: ${value}px; }`);
        expect(css).toMatch(`.pb${index} { padding-bottom: ${value}px; }`);
        expect(css).toMatch(`.pl${index} { padding-left: ${value}px; }`);
        expect(css).toMatch(`.pr${index} { padding-right: ${value}px; }`);
      });
    });

    it('should have created a bunch of margin classes', () => {
      testThemeObject.space.forEach((value, index) => {
        expect(css).toMatch(`.ma${index} { margin: ${value}px; }`);
        expect(css).toMatch(`.mt${index} { margin-top: ${value}px; }`);
        expect(css).toMatch(`.mb${index} { margin-bottom: ${value}px; }`);
        expect(css).toMatch(`.ml${index} { margin-left: ${value}px; }`);
        expect(css).toMatch(`.mr${index} { margin-right: ${value}px; }`);
      });
    });
  });

  describe('Font-Sizes', () => {
    it('should have created a bunch of font size classes', () => {
      testThemeObject.fontSizes.forEach((value, index) => {
        expect(css).toMatch(`.f${index + 1} { font-size: ${value}px; }`);
      });
    });
  });

  describe('Colors', () => {
    it('should handle color array class generation', () => {
      testThemeObject.colors.blues.forEach((value, index) => {
        expect(css).toMatch(`.blues-${index} { color: ${value}; }`);
        expect(css).toMatch(
          `.bg-blues-${index} { background-color: ${value}; }`
        );
      });
    });

    it('should handle nested object class generation', () => {
      expect(css).toMatch(
        `.red-100 { color: ${testThemeObject.colors.red[100]}; }`
      );
      expect(css).toMatch(
        `.red-200 { color: ${testThemeObject.colors.red[200]}; }`
      );
      expect(css).toMatch(
        `.bg-red-100 { background-color: ${testThemeObject.colors.red[100]}; }`
      );
      expect(css).toMatch(
        `.bg-red-200 { background-color: ${testThemeObject.colors.red[200]}; }`
      );
    });

    it('should handle straight up key value pairs', () => {
      expect(css).toMatch(`.green { color: ${testThemeObject.colors.green}; }`);
      expect(css).toMatch(
        `.bg-green { background-color: ${testThemeObject.colors.green}; }`
      );
    });
  });
});
