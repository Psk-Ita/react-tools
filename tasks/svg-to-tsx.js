const fs = require('fs');
const path = require('path');
const glob = require('glob');

const ICONS_SOURCE_DIR = 'tasks/src-svg';
const COMPONENTS_DIR = 'src/images';

const _options = [];
const _exports = [];
const _includes = [];
const icons = glob.sync(`${ICONS_SOURCE_DIR}/**.svg`);
const images = glob.sync(`${ICONS_SOURCE_DIR}/**.png`);

const capitalize = (input) => {
  const segments = input.split('');
  segments[0] = segments[0].toUpperCase();
  return segments.join('');
};

const clean = (input) => {
  return input
    .toLowerCase()
    .split('@')[0]
    .replace(/\.| |-/gim, '_');
};

const camelize = (input) => {
  return input
    .split(/\.| |-|@/gim)
    .map((x) => capitalize(x))
    .join('');
};

// for each svg image - write it's related tsx
icons.forEach((icon) => {
  const svg = fs.readFileSync(icon, 'utf8');
  const rawName = path.parse(icon).name;
  _options.push(rawName);
  const componentName = camelize(rawName);
  const componentCode = svg
    .replace(/<!--[\s\S\n]*?-->/gim, '')
    .replace(/<\?xml[\s\S\n]*?\?>/gim, '')
    .replace(/<desc>[\s\S\n]*?<\/desc>/gim, '')
    .replace(/<title>[\s\S\n]*?<\/title>/gim, '')
    .replace('>', ` fill='currentColor' focusable='false' {...props} >`)
    .replace(/((\-|\:)+[a-zA-Z]*(=|:))/g, (match) => {
      // camelCase attributes
      const segments = match.split('');
      segments.splice(0, 1);
      return capitalize(segments.join(''));
    })
    .replace(/ style="(.*?)"/g, (match) => {
      // style to react object
      let result = '';
      const tags = match.split('=');
      tags[1]
        .replace(/\"/gim, '')
        .split(';')
        .forEach((attr) => {
          if (attr.length > 0) {
            const def = attr.split(':');
            result += `${def[0]}:'${def[1]}', `;
          }
        });
      return ` style={{${result}}}`;
    });
  fs.writeFileSync(
    `${COMPONENTS_DIR}/${componentName}.tsx`,
    `import React from 'react'; export const ${componentName} = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (${componentCode});`,
  );
  _exports.push(componentName);
  _includes.push(`import { ${capitalize(componentName)} } from './${componentName}'`);
});

images.forEach((image) => {
  const stream = fs.readFileSync(image, 'base64');
  const rawName = path.parse(image).name;
  _options.push(rawName);
  const componentName = camelize(rawName);
  const componentCode = `<img alt="" src="data:image/png;base64,${stream}" focusable='false' {...props} />`;

  fs.writeFileSync(
    `${COMPONENTS_DIR}/${componentName}.tsx`,
    `import React from 'react'; export const ${componentName} = (props: React.SVGProps<HTMLImageElement>): JSX.Element => (${componentCode});`,
  );
  _exports.push(componentName);
  _includes.push(`import { ${capitalize(componentName)} } from './${componentName}'`);
});

// create index for svg-images
fs.writeFile(
  `${COMPONENTS_DIR}/index.tsx`,
  `import React from 'react';
${_includes.join(`;
`)};

//* eslint-disable @typescript-eslint/camelcase */
export enum MyImagesEnum {
    ${_options.map((x) => `${clean(x)} = "${x}",`).join(`
    `)}
};
//* eslint-enable @typescript-eslint/camelcase */
export interface MyImageProps extends React.SVGProps<SVGSVGElement | HTMLImageElement> {
    imageId: MyImagesEnum;
}

export const MyImage = (props: MyImageProps): JSX.Element => {
    const { imageId, ...oth } = props;
    let result = <React.Fragment />;
    switch (imageId) {
        ${_options.map((x) => {
          let props = `(oth as React.SVGProps<${
            images.indexOf(`${ICONS_SOURCE_DIR}/${x}.png`) < 0 ? 'SVGSVGElement' : 'HTMLImageElement'
          }>)`;
          return `case MyImagesEnum.${clean(x)}: {
            result = <${camelize(x)} {...${props}} />;
            break;
        }`;
        }).join(`
        `)}
    }
    return result;
};

export default {MyImage, MyImagesEnum, ${_exports.join(`,
    `)},};
`,
  function (err) {
    if (err) return console.log(err);
  },
);

// create test for index
fs.writeFile(
  `${COMPONENTS_DIR}/index.test.tsx`,
  `import { MyImage, MyImagesEnum } from './';
import React from "react"; import {render} from '@testing-library/react';
describe('MyImage', () => {
    it.each\`
    imageId
        ${_options.map((x) => '${MyImagesEnum.' + clean(x) + '}').join(`
        `)}
    \`('$imageId should match the snapshot', ({ imageId }) => {
        const {baseElement} = render(<MyImage id={imageId} imageId={imageId} height={'32px'} width={'32px'} />);
        expect(baseElement).toMatchSnapshot(imageId);
    });
});
`,
  function (err) {
    if (err) return console.log(err);
  },
);
