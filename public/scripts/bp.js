// get URL params //
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const patient = {
  id: urlParams.get("id"),
  firstName: urlParams.get("firstName"),
  lastName: urlParams.get("lastName"),
  birthDate: urlParams.get("birthDate")
};


// print elemnt function //
function printElm(elem){
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');

    mywindow.document.write('<html><head><title>' + document.title  + '</title>');
    mywindow.document.write('</head><body >');
    mywindow.document.write('<h1>' + document.title  + '</h1>');
    mywindow.document.write(document.getElementById(elem).innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return true;
}

// make png function //
function makePNGfromSVG(svgCode) {
  const svg = svgCode;

  svgToPng(svg, imgData => {
    const pngImage = document.createElement("img");
    $(".bp-barcode").append(pngImage);
    pngImage.src = imgData;
  });

  function svgToPng(svg, callback) {
    const url = getSvgUrl(svg);
    svgUrlToPng(url, imgData => {
      callback(imgData);
      URL.revokeObjectURL(url);
      $("#pngCaddy").hide();
    });
  }

  function getSvgUrl(svg) {
    return URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  }

  function svgUrlToPng(svgUrl, callback) {
    const svgImage = document.createElement("img");
    svgImage.id = "pngCaddy";
    document.body.appendChild(svgImage);
    svgImage.onload = function() {
      const canvas = document.createElement("canvas");
      canvas.width = svgImage.clientWidth;
      canvas.height = svgImage.clientHeight;
      const canvasCtx = canvas.getContext("2d");
      canvasCtx.drawImage(svgImage, 0, 0);
      const imgData = canvas.toDataURL("image/png");
      callback(imgData);
    };
    svgImage.src = svgUrl;
  }
}

// HTML to Canvas save Screenshot
function saveSnip(selector,cb) {
  html2canvas($(selector)[0]).then(canvas => {
    canvas.toBlob(blob => {
      saveAs(blob, `${patient.id}.png`);
      cb()
    });
  });
}

// save SVG from ELM
function saveSVGfromELM(selector) {
  var svgBlob = new Blob([$(selector)[0].outerHTML], {
    type: "image/svg+xml;charset=utf-8"
  });
  var svgUrl = URL.createObjectURL(svgBlob);
  var downloadLink = document.createElement("a");
  downloadLink.href = svgUrl;
  downloadLink.download = "newesttree.svg";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

// init functions
function initPatient() {
  $('.patient-first-name').text(patient.firstName)
  $('.patient-last-name').text(patient.lastName)
  $('.patient-id').text(patient.id)
  $('.patient-birth-date').text(patient.birthDate)
}


function initBarcodeImage() {
  const barcodeSVGConfig = {
    format: "code128",
    width: 2,
    background: "rgba(0,0,0,0)",
    lineColor: "var(--bg-primary)",
    height: 120,
    displayValue: false
  };

  const svgElmSelector = "#barcodePlaceholder";

  JsBarcode(svgElmSelector, patient.id, barcodeSVGConfig);

  makePNGfromSVG($("#barcodePlaceholder")[0].outerHTML);
  $("#barcodePlaceholder").remove();
}

// on Document Ready //
$(() => {
  
  initPatient()
  
  initBarcodeImage()
  
  $("#saveAsImage").on("click", e => {
    
    $('.wrapper').removeClass('px-4-5 py-5').addClass('p-3')
    $('#bpDiv').addClass('p-4')
    $('.bp-wrapper').addClass('border')
    
    alertModal.display({
      modalId:"loaderModal"
    })
    
    setTimeout(() => {
      saveSnip("#bpDiv", () => {
        $('#bpDiv').removeClass('p-4')
        $('.bp-wrapper').removeClass('border')
        $('.wrapper').addClass('px-4-5 py-5').removeClass('p-3')
        alertModal.hide()
      });
    }, 500)

    
  });
  
  $('#printBp').on('click', e => printElm(document.getElementById('bpDiv')))

});
