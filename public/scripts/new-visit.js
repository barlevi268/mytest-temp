function initBarcodeDetect() {

  function decode(src) {
    var code = "";

    var results = [];

    var surfaceSize = 800;

    var config = {
      inputStream: {
        type: "ImageStream",
        length: 20,
        size: surfaceSize
      },
      numOfWorkers: 8,
      decoder: {
        readers: ["ean_reader", "code_128_reader"],
        multiple: false
      },
      locate: true,
      src: src
    };
    
    alertModal.display()
    
    Quagga.decodeSingle(config, result => {
      config.inputStream.size = 1200;
      console.log(result, Date.now());
      if (result) {
        result.codeResult ? (code = result.codeResult.code) : "";
        console.log(code);
      }
      console.log(code);
      Quagga.decodeSingle(config, result => {
        config.inputStream.size = 1600;
        console.log(result, Date.now());
        if (result) {
          result.codeResult ? (code = result.codeResult.code) : "";
          console.log(code);
        }
        Quagga.decodeSingle(config, result => {
          console.log(result, Date.now());
          if (result) {
            result.codeResult ? (code = result.codeResult.code) : "";
            console.log(code);
          }
          alertModal.hide()
        });
      });
    });
    
  }

  $("#uploadBarcode").on("change", function(e) {
    if (e.target.files && e.target.files.length) {
      decode(URL.createObjectURL(e.target.files[0]));
    }
  });
}

const fakeVisit = {
  fullName: "חיים רפאלי",
  testBarcode: "40132164",
  visitId: "31628"
};

function fakeVisitSuccess() {
  alertModal.display({
    modalId: "visitSuccessModal",
    primaryLabel: "חזרה לתפריט",
    secondaryLabel: "צור ביקור נוסף",
    icon: "success",
    primaryAction: () => (location.href = "/menu"),
    secondaryAction: () => (location.href = "/findPatient"),
    onInit: () => {
      $("#patientFullNameLabel").html(fakeVisit.fullName);
      $("#testBarcodeLabel").html(fakeVisit.testBarcode);
      $("#visitIdLabel").html(fakeVisit.visitId);
    }
  });
}

function initConditionalFields() {
  $(".form-group").on("change", e => {
    var $target = $(e.target);
    switch ($target.attr("name")) {
      case "testType":
        if ($('[name="testType"]:checked').val() == "PCR") {
          $(".pcr-test-types").show("fast");
        } else {
          $(".pcr-test-types").hide("fast");
        }
        break;
      case "pcrTestType":
        if ($('[name="pcrTestType"]').val() == "personal") {
          $(".impair-test-barcode")
            .show("fast")
            .removeClass("d-none");
        } else {
          $(".impair-test-barcode").hide("fast");
        }
        break;
      default:
        break;
    }
  });
}

$(() => {
  initBarcodeDetect();

  initConditionalFields();
});
