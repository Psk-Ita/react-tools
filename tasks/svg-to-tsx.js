const fs = require('fs');
const path = require('path');
const glob = require('glob');

const ICONS_SOURCE_DIR = './../src-svg';
const COMPONENTS_DIR = 'src/components/svg-images';

const _options = [];
const _exports = [];
const _includes = [];
const icons = glob.sync(`${ICONS_SOURCE_DIR}/**.svg`);

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
icons.forEach((icon, idx) => {
    const svg = fs.readFileSync(icon, 'utf8');
    const rawName = path.parse(icon).name;
    _options.push(rawName);
    const componentName = camelize(rawName);
    const componentCode = svg
        .replace(/<!--[\s\S\n]*?-->/gim, '')
        .replace(/<\?xml[\s\S\n]*?\?>/gim, '')
        .replace(/<desc>[\s\S\n]*?<\/desc>/gim, '')
        .replace(/<title>[\s\S\n]*?<\/title>/gim, '')
        .replace('>', ` fill='currentColor' {...props} >`)
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
        `import React from 'react';
export default (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
${componentCode}
);`,
    );
    _exports.push(componentName);
    _includes.push(`import ${capitalize(componentName)} from './${componentName}'`);
});

// create index for svg-images
fs.writeFile(
    `${COMPONENTS_DIR}/index.tsx`,
    `import React from 'react';
${_includes.join(`;
`)};

/* eslint-disable @typescript-eslint/camelcase */
export enum CustomIcons {
    ${_options.map((x) => `${clean(x)} = "${x}",`).join(`
    `)}
};
/* eslint-enable @typescript-eslint/camelcase */

export interface SvgImageProps extends React.SVGProps<SVGSVGElement> {
    icon: CustomIcons;
}

export const SvgImage = (props: SvgImageProps): JSX.Element => {
    const { icon, ...oth } = props;
    let result = <></>;
    switch (icon) {
        ${_options.map(
            (x) => `case CustomIcons.${clean(x)}: {
            result = <${camelize(x)} {...oth} />;
            break;
        }`,
        ).join(`
        `)}
    }
    return result;
};

export default {
    SvgImage,
    CustomIcons,
    ${_exports.join(`,
    `)},
};
`,
    function (err) {
        if (err) return console.log(err);
    },
);

// create test for index
fs.writeFile(
    `${COMPONENTS_DIR}/SvgImage.test.tsx`,
    `import { CustomIcons, SvgImage } from './';
import React from 'react';
import { render } from '@testing-library/react';

describe('SvgImage', () => {
    it.each\`
        icon
        ${_options.map((x) => '${CustomIcons.' + clean(x) + '}').join(`
        `)}
    \`('$icon should match the snapshot', ({ icon }) => {
        const { baseElement } = render(<SvgImage id={icon} icon={icon} height={'32px'} width={'32px'} />);
        expect(baseElement).toMatchSnapshot();
    });
});
`,
    function (err) {
        if (err) return console.log(err);
    },
);
