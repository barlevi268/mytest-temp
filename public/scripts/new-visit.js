function initBarcodeDetect() {
  function readBarcodePromise(config) {
    return new Promise(resolve => {
      Quagga.decodeSingle(config, result => {
        resolve(result);
      });
    });
  }

  async function decode(src) {
    var code = "";

    var results = [];

    const config = size => {
      return {
        inputStream: {
          type: "ImageStream",
          length: 20,
          size: size
        },
        numOfWorkers: 1,
        decoder: {
          readers: ["ean_reader", "code_128_reader"],
          multiple: false
        },
        locate: true,
        src: src
      };
    };
    
    Quagga.decodeSingle(config(800), result => {
      Quagga.decodeSingle(config(1200), result => {
        Quagga.decodeSingle(config(1800), result => {});
      });
    });
    
    results.push(await readBarcodePromise(config(800)));
    results.push(await readBarcodePromise(config(1200)));
    results.push(await readBarcodePromise(config(1800)));
    
    console.log(results)
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
    console.log($('[name="pcrTestType"]').val());
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
