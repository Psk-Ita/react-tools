export interface WebFontProps {
  baseUrl: string;
  fontName: String;
  fontFamily: String;
  setDefault?: boolean;
}

export const useWebFont = ({ baseUrl, fontName, fontFamily, setDefault }: WebFontProps): void => {
  const fontDefinition = `
@font-face { font-family: "${fontFamily}"; src: local("${fontFamily} Bold"), local("${fontName}-Bold"), url("${baseUrl}/${fontName}-Bold.woff2") format("woff2"), url("${baseUrl}/${fontName}-Bold.woff") format("woff"); font-weight: bold; font-style: normal; }
@font-face { font-family: "${fontFamily}"; src: local("${fontFamily} Black"), local("${fontName}-Black"), url("${baseUrl}/${fontName}-Black.woff2") format("woff2"), url("${baseUrl}/${fontName}-Black.woff") format("woff"); font-weight: 900; font-style: normal; }
@font-face { font-family: "${fontFamily}"; src: local("${fontFamily} Light"), local("${fontName}-Light"), url("${baseUrl}/${fontName}-Light.woff2") format("woff2"), url("${baseUrl}/${fontName}-Light.woff") format("woff"); font-weight: 300; font-style: normal; }
@font-face { font-family: "${fontFamily}"; src: local("${fontFamily} Italic"), local("${fontName}-Italic"), url("${baseUrl}/${fontName}-Italic.woff2") format("woff2"), url("${baseUrl}/${fontName}-Italic.woff") format("woff"); font-weight: normal; font-style: italic; }
@font-face { font-family: "${fontFamily}"; src: local("${fontFamily} Regular"), local("${fontName}-Regular"), url("${baseUrl}/${fontName}-Regular.woff2") format("woff2"), url("${baseUrl}/${fontName}-Regular.woff") format("woff"); font-weight: normal; font-style: normal; }
@font-face { font-family: "${fontFamily}"; src: local("${fontFamily} SemiBold"), local("${fontName}-SemiBold"), url("${baseUrl}/${fontName}-SemiBold.woff2") format("woff2"), url("${baseUrl}/${fontName}-SemiBold.woff") format("woff"); font-weight: 600; font-style: normal; }
@font-face { font-family: "${fontFamily}"; src: local("${fontFamily} ExtraLight"), local("${fontName}-ExtraLight"), url("${baseUrl}/${fontName}-ExtraLight.woff2") format("woff2"), url("${baseUrl}/${fontName}-ExtraLight.woff") format("woff"); font-weight: 200; font-style: normal; }
@font-face { font-family: "${fontFamily}"; src: local("${fontFamily} Bold Italic"), local("${fontName}-BoldItalic"), url("${baseUrl}/${fontName}-BoldItalic.woff2") format("woff2"), url("${baseUrl}/${fontName}-BoldItalic.woff") format("woff"); font-weight: bold; font-style: italic; }
@font-face { font-family: "${fontFamily}"; src: local("${fontFamily} Light Italic"), local("${fontName}-LightItalic"), url("${baseUrl}/${fontName}-LightItalic.woff2") format("woff2"), url("${baseUrl}/${fontName}-LightItalic.woff") format("woff"); font-weight: 300; font-style: italic; }
@font-face { font-family: "${fontFamily}"; src: local("${fontFamily} SemiBold Italic"), local("${fontName}-SemiBoldItalic"), url("${baseUrl}/${fontName}-SemiBoldItalic.woff2") format("woff2"), url("${baseUrl}/${fontName}-SemiBoldItalic.woff") format("woff"); font-weight: 600; font-style: italic; }
@font-face { font-family: "${fontFamily}"; src: local("${fontFamily} ExtraLight Italic"), local("${fontName}-ExtraLightItalic"), url("${baseUrl}/${fontName}-ExtraLightItalic.woff2") format("woff2"), url("${baseUrl}/${fontName}-ExtraLightItalic.woff") format("woff"); font-weight: 200; font-style: italic; }
`;

  const cssId = `EFC-${fontName}-Font`;
  let domCss = document.getElementById(cssId);
  if (!domCss) {
    domCss = document.createElement("style");
    domCss.id = cssId;
    document.head.appendChild(domCss);
  }
  domCss.innerHTML = fontDefinition;

  if (setDefault) {
    ["woff2", "woff"].forEach((format: string) => {
      const linkId = `EFC-${fontName}-${format}-Preload`;

      let domLink = document.getElementById(linkId);
      if (!domLink) {
        domLink = document.createElement("link");
        domLink.id = linkId;
        document.head.appendChild(domLink);
      }

      if (domLink instanceof HTMLLinkElement) {
        domLink["as"] = "style";
        domLink["rel"] = "preload";
        domLink["href"] = `${baseUrl}/${fontName}-Regular.${format}`;
      }
    });

    domCss.append(`
html, body { font-family: '${fontFamily}'; font-style: normal; }`);
  }
};
