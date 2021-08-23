var webcam = (function() {
  var width = 320;
  var height = 0;

  var streaming = false;

  var video = document.getElementById("video");
  var canvas = document.getElementById("canvas");
  var photo = document.getElementById("photo");
  var startbutton = document.getElementById("startbutton");
  
  var webcamBlob;
  
  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  }
  
  function takepicture() {
    $('.pre-capture').hide()
    $('.post-capture').show()
    var context = canvas.getContext('2d');
    if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);

        var data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);
    } else {
        clearphoto();
    }
  }
  
  function approveCapture() {
      var data = canvas.toDataURL('image/png');
      webcamBlob = dataURItoBlob(data)
      detectCodeInImage(URL.createObjectURL(webcamBlob))
      $("#webcamModal").modal('hide')
  }
         
  function retakeCapture() {
    $('[for="uploadBarcode"]')[0].click()
  }
  
  $('#approveCapture').on('click', e => approveCapture() )
  $('#retakeCapture').on('click', e => retakeCapture() )
  
  function startup() {
    
    navigator.mediaDevices
      .getUserMedia({
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

    video.addEventListener(
      "canplay",
      function(ev) {
        if (!streaming) {
          height = video.videoHeight / (video.videoWidth / width);

          if (isNaN(height)) {
            height = width / (4 / 3);
          }

          video.setAttribute("width", width);
          video.setAttribute("height", height);
          canvas.setAttribute("width", width);
          canvas.setAttribute("height", height);
          streaming = true;
        }
      },
      false
    );
  }
  
  function handleCapture() {
    takepicture()
  }

  function initBarcodeImagePicker() {
    if (!isMobile) {
      var field = $('[for="uploadBarcode"]');
      field.on("click", e => {
        e.preventDefault();
        alertModal.display({
          modalId: "webcamModal",
          primaryLabel: "צלם",
          primaryAction: () => handleCapture(),
          preventPrimaryDismiss: true,
          onInit: () => {
            $('.pre-capture').show()
            $('.post-capture').hide()
          },
          afterInit: () => startup()
        });
      });
    }
  }
  
  function handleFormSubmit() {
    var form = $('form')
    form.on('submit', e => {
      e.preventDefault();
      var formData = new FormData(form[0])
      
      formData.append(webcamBlob,"uploadBarcode")
      
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/', true);
      xhr.send(formData);
    })
  }
  
  return {
    init: function() {
      initBarcodeImagePicker()
      handleFormSubmit()
    }
  };
})();

var mobileStream = function() {
  var modal = $('#mobileLiveScanModal')
  var stream = $('.mobile-stream')[0]
  var btn = $('.mobile-stream-btn')
  var barcodeInput = $('[name=barcode_test]')
  
  function initQuagga() {
    
    Quagga.init({
      inputStream : {
        name : "Live",
        type : "LiveStream",
        target: document.querySelector('#video')    // Or '#yourElement' (optional)
      },
      decoder : {
        readers : ["code_128_reader"]
      }
    }, function(err) {
        if (err) {
            console.log(err);
            return
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();
    });
    
    Quagga.onDetected((e) =)
  }
  
  function initMobileStreamModal() {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: false
      })
      .then(function(stream) {
        stream.srcObject = stream;
        stream.play();
      })
      .catch(function(err) {
        console.log("An error occurred: " + err);
      });
  }
  
  function hanldeQuaggaResults(e) {
    if (e.codeResults) {
      barcodeInput.val(e.codeResults.code)
      modal.find('close-btn').trigger('click')
      Quagga.stop()
    }
  }
  
  function initListeners() {
    btn.on('click', e => {
      alertModal.display({
          modalId: "mobileLiveScanModal",
          onInit: () => {},
          afterInit: () => initMobileStreamModal()
        });
    })
  }
  function _init() {
    initListeners()
  }
  return {
    init: _init
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
  webcam.init();
  initConditionalFields();
});
