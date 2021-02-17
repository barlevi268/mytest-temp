const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const patient = {
  id: urlParams.get("id"),
  firstName: urlParams.get("firstName"),
  lastName: urlParams.get("lastName"),
  birthDate: urlParams.get("birthDate")
};

$(() => {
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

  $("#saveAsImage").on("click", e => {});
  html2canvas($("#bpDiv")[0], {
    onrendered: canvas => {
      theCanvas = canvas;

      canvas.toBlob(blob => {
        saveAs(blob, "Dashboard.png");
      });
    }
  }).then(canvas => {
    canvas.toBlob(blob => {
      saveAs(blob, "Dashboard.png");
    });
  });
});
