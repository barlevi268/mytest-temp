function initBarcodeDetect() {
  const quaggaConfig = {
    numOfWorkers: 4,
    decoder: {
      readers: ["ean_reader", "code_128_reader"],
      multiple: true
    },
    locate: true,
    src: null
  };
  
  function decode(src) {
    config = $.extend({}, self.state, { src: src });

    Quagga.decodeSingle(config, function(result) {
      console.log(result);
    });
  }
  $("#uploadBarcode").on("change", function(e) {
    if (e.target.files && e.target.files.length) {
      barcodeReader.decode(URL.createObjectURL(e.target.files[0]));
    }
  });
}

var barcodeReader = {
  init: function() {
    barcodeReader.attachListeners();

    Quagga.onDetected(function(result) {
      var code = result[0].codeResult.code;
      $('[name="test_barcode"]').val(code);
    });
  },
  attachListeners: function() {
    var self = this;
  },
  decode: function(src) {
    var self = this,
      config = $.extend({}, self.state, { src: src });

    Quagga.decodeSingle(config, function(result) {
      console.log(result);
    });
  },
  state: {
    numOfWorkers: 4,
    decoder: {
      readers: ["ean_reader", "code_128_reader"],
      multiple: true
    },
    locate: true,
    src: null
  }
};

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
  barcodeReader.init();

  initConditionalFields();
});
