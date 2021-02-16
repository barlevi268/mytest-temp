const barcodeSVGConfig = {
  format: "code128",
  width: 2,
  background: "rgba(0,0,0,0)",
  lineColor: "var(--bg-primary)",
  height: 120,
  displayValue: false
};

const fakeID = "313521924";

const svgElmSelector = "#barcodePlaceholder";

JsBarcode(svgElmSelector, fakeID, barcodeSVGConfig);
