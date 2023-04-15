
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const ICONS_SOURCE_DIR = 'tasks/image-lib';
const COMPONENTS_DIR = 'src/components/Images';

const _options = [];
const _exports = [];
const _includes = [];
const icons = glob.sync(`${ICONS_SOURCE_DIR}/**.svg`);
const images = glob.sync(`${ICONS_SOURCE_DIR}/**/*.(png|jpeg|jpg|webp)'`);

const clean = (input) => {
  return input
    .toLowerCase()
    .split('@')[0]
    .replace(/\.| |-/gim, '_');
};

const capitalize = (input) => {
  const segments = input.split('');
  segments[0] = segments[0].toUpperCase();
  return segments.join('');
};

const camelize = (input, escape = 0) => {
    return input
        .split(/\.| |-|@/gim)
        .map((x, idx) => (idx < escape ? x : capitalize(x)))
        .join('');
};

// for each svg image - write it's related tsx
icons.forEach(icon => {
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
        .replace(/ class=/gim, ' className=')
        .replace(/((\-|\:)+[a-zA-Z]*(=|:))/g, match => {
            // camelCase attributes
            const segments = match.split('');
            segments.splice(0, 1);
            return capitalize(segments.join(''));
        })
        .replace(/ style="(.*?)"/g, match => {
            // style to react object
            let result = '';
            const tags = match.split('=');
            tags[1]
                .replace(/\"/gim, '')
                .split(';')
                .forEach(attr => {
                    if (attr.length > 0) {
                        const def = attr.split(':');
                        if (def.length > 1) {
                            let value = def[1].trim();
                            if (value[value.length - 1] !== "'") {
                                value = value + "'";
                            }
                            if (value[0] !== "'") {
                                value = "'" + value;
                            }
                            result += `${camelize(def[0].trim(), 1)}:${value}, `;
                        }
                    }
                });
            return ` style={{${result}}}`;
        });
    fs.writeFileSync(
        `${COMPONENTS_DIR}/${componentName}.tsx`,
        `/****************************************************************************************
    DO NOT EDIT THIS FILE
    APPLY YOUR CHANGES TO ${icon} FILE, INSTEAD
    THEN RUN npm run image-lib COMMAND
****************************************************************************************/
        import React from 'react'; export const ${componentName}: React.FC = (props: React.SVGProps<SVGSVGElement>) => (
            <span role="img" aria-label="${rawName}" className="my-icon my-icon-${rawName}">
                ${componentCode}
            </span>
        );`,
    );
    _exports.push(componentName);
    _includes.push(`import { ${capitalize(componentName)} } from './${componentName}'`);
});

images.forEach(image => {
    const stream = fs.readFileSync(image, 'base64');
    const rawName = path.parse(image).name;
    _options.push(rawName);
    const componentName = camelize(rawName);
    const componentCode = `<img alt="" src="data:image/${path.extname(image).substring(1)};base64,${stream}" focusable='false' {...props} />`;

    fs.writeFileSync(
        `${COMPONENTS_DIR}/${componentName}.tsx`,
        `/****************************************************************************************
    DO NOT EDIT THIS FILE
    APPLY YOUR CHANGES TO ${icon} FILE, INSTEAD
    THEN RUN npm run image-lib COMMAND
****************************************************************************************/
       import React from 'react'; export const ${componentName}: React.FC<React.SVGProps<HTMLImageElement>> = (props) => (
            <span role="img" aria-label="${rawName}" className="my-icon my-icon-${rawName}">
                ${componentCode}
            </span>
        );`,
    );
    _exports.push(componentName);
    _includes.push(`import { ${capitalize(componentName)} } from './${componentName}'`);
});

// create index for svg-images
fs.writeFile(
  `${COMPONENTS_DIR}/index.tsx`,
  `/****************************************************************************************
    DO NOT ADD COMPONENTS IN THIS FILE
    ADD YOUR .SVG IN ${ICONS_SOURCE_DIR} FOLDER
    THEN RUN npm run image-lib COMMAND
****************************************************************************************/
import React, { Suspense } from 'react';

${_includes.join(`;
`)};

//* eslint-disable @typescript-eslint/camelcase */
export enum MyImages {
    ${_options.map((x) => `${clean(x)} = "${x}",`).join(`
    `)}
};
//* eslint-enable @typescript-eslint/camelcase */
export interface MyImageProps extends React.SVGProps<SVGSVGElement | HTMLImageElement> {
    icon: MyImages;
}

export const MyImage = (props: MyImageProps): JSX.Element => {
    const { icon, ...oth } = props;

    const capitalize = (input:string): string => {
      const segments = input.split('');
      segments[0] = segments[0].toUpperCase();
      return segments.join('');
    };
    
    const camelize = (input:string): string => {
      return input
        .split(/\\.| |-|@/gim)
        .map((x) => capitalize(x))
        .join('');
    };
    
    const Icon = React.lazy(() => import(${'`'}./\${camelize(icon)}${'`'}));

    return (
      <React.Fragment>
        <Suspense fallback={<React.Fragment />}>
          <Icon {...oth} />
        </Suspense>
      </React.Fragment>
    );
};

export default {MyImage, MyImages, ${_exports.join(`,
    `)},};
`,
  function (err) {
    if (err) return console.log(err);
  },
);

// create test for index
fs.writeFile(
  `${COMPONENTS_DIR}/index.test.tsx`,
  `import { MyImage, MyImages } from './';
   import React from 'react'; import { render } from '@testing-library/react'; describe('MyImage', () => {
    it.each\`
      icon${_options.map((x) => '${MyImages.' + clean(x) + '}').join(`
`)}\`('$icon should match the snapshot', ({ icon }) => {
      const { baseElement } = render(<MyImage id={icon} icon={icon} height={'32px'} width={'32px'} />);
      expect(baseElement).toMatchSnapshot();
    });
});
`,
  function (err) {
    if (err) return console.log(err);
  },
);
