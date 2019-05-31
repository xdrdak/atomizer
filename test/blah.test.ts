import { Atomizer } from '../src';

const testThemeObject = {
  space: [0, 4, 8, 16, 32, 64],
  fontSizes: [12, 14, 16, 20],
  colors: {
    blue: '#07c',
    blues: ['#004170', '#006fbe', '#2d8fd5', '#5aa7de'],
    green: '#0fa',
    red: {
      100: 'red',
      200: 'darkred',
    }
  },
  fonts: {
    serif: 'Helvetica',
  },
};

const myAtomizer = new Atomizer(testThemeObject);

describe('Atomizer', () => {
  it('works', () => {
    console.log(myAtomizer.uniquePaths);
    console.log(myAtomizer.convertToCss());
    expect(true).toEqual(true);
  });
});
