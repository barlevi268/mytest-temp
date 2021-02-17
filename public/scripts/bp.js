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
  html2canvas($("body")[0], {
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

const svg = $('svg')[0].outerH;

svgToPng(svg, imgData => {
  const pngImage = document.createElement("img");
  document.body.appendChild(pngImage);
  pngImage.src = imgData;
});

function svgToPng(svg, callback) {
  const url = getSvgUrl(svg);
  svgUrlToPng(url, imgData => {
    callback(imgData);
    URL.revokeObjectURL(url);
  });
}

function getSvgUrl(svg) {
  return URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
}

function svgUrlToPng(svgUrl, callback) {
  const svgImage = document.createElement("img");
  document.body.appendChild(svgImage);
  svgImage.onload = function() {
    const canvas = document.createElement("canvas");
    canvas.width = svgImage.clientWidth;
    canvas.height = svgImage.clientHeight;
    const canvasCtx = canvas.getContext("2d");
    canvasCtx.drawImage(svgImage, 0, 0);
    const imgData = canvas.toDataURL("image/png");
    callback(imgData);
    // document.body.removeChild(imgPreview);
  };
  svgImage.src = svgUrl;
}
