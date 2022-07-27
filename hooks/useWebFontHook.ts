import { Dictionary } from 'lodash';

export enum FontStyles {
  normal = 'normal',
  italic = 'italic'
}

export enum FontWeigths {
  Bold = 700,
  Regular = 400,
  SemiBold = 600
}

export interface WebFontProps {
  baseUrl: string;
  fontName: String;
  fontFamily: String;
  isDefault?: boolean;
  weights?: FontWeigths[] | undefined;
  style?: FontStyles | undefined;
}

export const useWebFont = (props: WebFontProps[]): void => {
  props.forEach(({ baseUrl, fontName, fontFamily, isDefault, weights, style }) => {
    const uid = `${fontName}-${(weights || []).join('-')}${style ? `-${style}` : ''}`;

    let fontStyleIn = `${style || ''}`;
    let fontStyleOut = `${style || FontStyles.normal}`;

    let fontDefinition: Dictionary<string> = {};
    if (Array.isArray(weights) && weights.length > 0) {
      weights.forEach(x => {
        const weigth = FontWeigths[x];
        fontDefinition[weigth] = `@font-face { font-family: "${fontFamily}"; src: local("${fontFamily} ${weigth}${
          style ? ` ${style}` : ''
        }"), local("${fontName}-${x}${fontStyleIn}"), url("${baseUrl}/${fontName}-${x}${fontStyleIn}.woff2") format("woff2"), url("${baseUrl}/${fontName}-${x}${fontStyleIn}.woff") format("woff"); font-weight: ${weigth}; font-style: ${fontStyleOut}; }`;
      });
    } else {
      fontDefinition[
        FontWeigths[FontWeigths.Regular]
      ] = `@font-face { font-family: "${fontFamily}"; src: local("${fontFamily}"), local("${fontName}${fontStyleIn}"), url("${baseUrl}/${fontName}${fontStyleIn}.woff2") format("woff2"), url("${baseUrl}/${fontName}${fontStyleIn}.woff") format("woff"); font-weight: normal; font-style: ${fontStyleOut}; }`;
    }

    const cssId = `${isDefault ? 'DEF' : 'PSK'}-${uid}-Font`;
    let domCss = document.getElementById(cssId);
    if (!domCss) {
      domCss = document.createElement('style');
      domCss.id = cssId;
      document.head.appendChild(domCss);
      let out = '';
      for (const k in fontDefinition) {
        out += `
      ${fontDefinition[k]}`;
      }
      domCss.innerHTML = out;
    }

    if (isDefault) {
      ['woff', 'woff2'].forEach((format: string) => {
        const linkId = `EFC-${uid}-${format}-Preload`;

        let domLink = document.getElementById(linkId);
        if (!domLink) {
          domLink = document.createElement('link');
          domLink.id = linkId;
          document.head.appendChild(domLink);

          if (domLink instanceof HTMLLinkElement) {
            domLink['as'] = 'style';
            domLink['rel'] = 'preload';
            domLink['href'] = `${baseUrl}/${fontName}-${FontWeigths.Regular}.${format}`;
          }
        }
      });

      domCss.append(`
html, body { font-family: '${fontFamily}'; font-style: normal; }`);
    }
  });
};
