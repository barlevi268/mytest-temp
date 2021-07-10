function initBarcodeDetect() {
  $('.barcode-loader').hide()
  
  function detectCodeInImage(src) {
    const codeField = $('[name="test_barcode"]');
    var code = "";

    var config = quaggaDefaultConfig;

    $('.barcode-loader').show('fast');
    
    decodeBarcode(src, config, result => {
      result ? code = result : "";
      console.log(result)
      
      $('.barcode-loader').hide('fast');
      
      codeField.attr("placeholder", "הזן ברקוד");
      codeField.val(code);
    });
  }

  $("#uploadBarcode").on("change", function(e) {
    if (e.target.files && e.target.files.length) {
      detectCodeInImage(URL.createObjectURL(e.target.files[0]));
    }
  });
}

function initWebcamWidget() {
        var width = 320;
        var height = 0;

        var streaming = false;

        var video = null;
        var canvas = null;
        var photo = null;
        var startbutton = null;

        var startup = function() {
            video = document.getElementById('video');
            canvas = document.getElementById('canvas');
            photo = document.getElementById('photo');
            startbutton = document.getElementById('startbutton');

            navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false
                })
                .then(function(stream) {
                    video.srcObject = stream;
                    video.play();
                })
                .catch(function(err) {
                    console.log("An error occurred: " + err);
                });

            video.addEventListener('canplay', function(ev) {
                if (!streaming) {
                    height = video.videoHeight / (video.videoWidth / width);

                    if (isNaN(height)) {
                        height = width / (4 / 3);
                    }

                    video.setAttribute('width', width);
                    video.setAttribute('height', height);
                    canvas.setAttribute('width', width);
                    canvas.setAttribute('height', height);
                    streaming = true;
                }
            }, false);

        }()
}

function initBarcodeImagePicker() {
  if (!isMobile) {
    var field = $('[for="uploadBarcode"]')
    field.on('click', e => {
      e.preventDefault()
      alertModal.display({
        modalId:'webcamModal',
        afterInit: () => {
          initWebcamWidget()
        }
      })
    })
  }
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
          $(".pcr-test-types").show('fast');
        } else {
          $(".pcr-test-types").hide('fast');
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
  initBarcodeImagePicker();
  initConditionalFields();
});
