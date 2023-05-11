// npm install
// npm run "image-lib"
// npm run "image-lib-lazy"
/*
  check loading effect by static ot lazy loading
  use your favourite approach 
*/

import { MyImage, MyImagesEnum } from "./components/My-Images";
import { MyLazyImage, MyLazyImagesEnum } from "./components/My-Images-Lazy";
import React, { CSSProperties, useState } from "react";

import { render } from "react-dom";

const divStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "start",
  justifyContent: "space-between",
};

const fieldsetStyle: CSSProperties = {
  border: "1px solid gainsboro",
  borderRadius: "16px",
};

const divImage: CSSProperties = {
  border: ".5px dotted gainsboro",
  padding: "1%",
  borderTop: "none",
  borderLeft: "none",
  borderRadius: "8px",
};

const App: React.FC = () => {
  const [lazy, setLazy] = useState(false);

  const renderImages = (): JSX.Element => {
    const keys = Object.keys(lazy ? MyLazyImagesEnum : MyImagesEnum);
    return (
      <React.Fragment>
        <label>http status images</label>
        <fieldset style={fieldsetStyle}>
          <legend>
            licensed&nbsp;as&nbsp;"Creative Commons Attribution 4.0
            International License"&nbsp;by&nbsp;
            <a href="https://www.drlinkcheck.com/blog/free-http-error-images">
              Dr. Link Check
            </a>
          </legend>
          <div style={divStyle}>
            {keys
              .filter((x) => x.match(/^http/gim))
              .map((key) => (
                <div
                  key={`${lazy ? "l" : "s"}-${key}`}
                  style={{ ...divImage, flexBasis: "31%" }}
                >
                  <div>{key}</div>
                  {lazy ? (
                    <MyLazyImage
                      imageId={MyLazyImagesEnum[key]}
                      style={{ width: "100%", height: "300px" }}
                    />
                  ) : (
                    <MyImage
                      imageId={MyImagesEnum[key]}
                      style={{ width: "100%", height: "300px" }}
                    />
                  )}
                </div>
              ))}
          </div>
        </fieldset>

        <fieldset style={fieldsetStyle}>
          <legend>other random sample images from the web</legend>
          <div style={divStyle}>
            {keys
              .filter((x) => !x.match(/^http/gim))
              .map((key) => (
                <div
                  key={`${lazy ? "l" : "s"}-${key}`}
                  style={{ ...divImage, maxWidth: "22%" }}
                >
                  <div>{key}</div>
                  {lazy ? (
                    <MyLazyImage
                      imageId={MyLazyImagesEnum[key]}
                      style={{ width: "100%" }}
                    />
                  ) : (
                    <MyImage
                      imageId={MyImagesEnum[key]}
                      style={{ width: "100%" }}
                    />
                  )}
                </div>
              ))}
          </div>
        </fieldset>
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <div>
        <h1>
          <select
            value={lazy ? "1" : "0"}
            onChange={(ev) => setLazy(ev.target.value === "1")}
          >
            <option value={"1"}>Lazy Loading</option>
            <option value={"0"}>Static Loading</option>
          </select>
          <span
            style={{
              marginLeft: "43%",
              transform: "translateX(-50%)",
              display: "inline-block",
            }}
          >
            {lazy ? "Lazy" : "Static"}&nbsp;Loaded
          </span>
        </h1>
      </div>
      {renderImages()}
    </React.Fragment>
  );
};

render(<App />, document.getElementById("app"));
