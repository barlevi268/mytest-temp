var isMobile = "ontouchstart" in window;

var localizations = (async function() {
  var elements = document.querySelectorAll("[trns]");
  var inputs = document.querySelectorAll("input");
  var selects = document.querySelectorAll("select");

  var lang = localStorage.getItem("lang") ? localStorage.getItem("lang") : "HE";

  var langRequest = await fetch(`/translations/${lang}.json`);
  var langResults = await langRequest.json();

  document.querySelector("html").setAttribute("dir", langResults.dir);

  const translateValue = value => {
    var text = langResults.values[value];
    return text ? text : value;
  };

  elements.forEach(item => {
    item.textContent = translateValue(item.textContent);
  });

  [...selects, ...inputs].forEach(input => {
    input.setAttribute(
      "placeholder",
      translateValue(input.getAttribute("placeholder"))
    );
  });

  function _init() {
    var selectLang = document.querySelector(".floating-lang");
    if (selectLang) {
      selectLang.value = lang;
      selectLang.addEventListener("change", e => {
        localStorage.setItem("lang", e.target.value);
        location.reload();
      });
    }

    window["_translations"] = langResults;
    initSelect2();
  }

  _init();
})();

var alertModal = {
  subView: $("#alertModal"),
  show: () => alertModal.subView.modal("show"),
  clear: () => {
    alertModal.primaryButton.html("אישור");
    alertModal.secondaryButton.html("ביטול");
    alertModal.primaryButton.on("click", () => alertModal.hide());
    alertModal.secondaryButton.on("click", () => alertModal.hide());
    alertModal.successIcon.addClass("d-none");
    alertModal.secondaryButton.addClass(["col-spaced", "col-6"]);
  },
  hide: () => {
    alertModal.subView.modal("hide");
    alertModal.clear();
  },
  display: message => {
    if (typeof message == "object") {
      if (message.modalId) {
        alertModal.subView = $(`#${message.modalId}`);
        alertModal.init();
      }

      if (message.content) {
        alertModal.content.html(message.content);
      }

      if (message.primaryAction) {
        alertModal.primaryButton.on("click", e =>
          message.primaryAction.call(e)
        );
      }
      if (message.preventPrimaryDismiss) {
        alertModal.primaryButton
          .off()
          .on("click", e => message.primaryAction.call(e));
      }

      if (message.primaryLabel) {
        alertModal.primaryButton.html(message.primaryLabel);
      }

      if (message.secondaryAction) {
        alertModal.secondaryButton.on("click", message.secondaryAction);
      }

      if (message.secondaryLabel) {
        alertModal.secondaryButton.html(message.secondaryLabel);
      }

      if (message.hideSecondary) {
        alertModal.secondaryButton.hide();
        alertModal.primaryButton.removeClass(["col-spaced", "col-6"]);
      }

      if (message.icon) {
        message.icon == "success"
          ? alertModal.successIcon.removeClass("d-none")
          : alertModal.successIcon.addClass("d-none");
      }

      if (message.onInit) {
        message.onInit.call();
      }

      if (message.afterInit) {
        alertModal.subView.on("shown.bs.modal", () => message.afterInit.call());
      }
    } else if (typeof message == "string") {
      alertModal.content.html(message);
    }
    alertModal.show();
  },
  init: () => {
    alertModal.subView.modal({ backdrop: "static", keyboard: false });
    alertModal.content = alertModal.subView.find(".modal-message");
    alertModal.successIcon = alertModal.subView.find(".modal-icon");
    alertModal.primaryButton = alertModal.subView.find(".primary-action");
    alertModal.secondaryButton = alertModal.subView.find(".secondary-action");
    alertModal.clear();
  }
};

var mobileStream = (function() {
  var modal = $("#mobileLiveScanModal");
  var mobileStream = $(".mobile-stream")[0];
  var btn;
  var barcodeInput;

  function initQuagga() {
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: document.querySelector(".mobile-stream") // Or '#yourElement' (optional)
        },
        decoder: {
          readers: ["code_128_reader"]
        }
      },
      function(err) {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();
      }
    );

    Quagga.onDetected(e => hanldeQuaggaResults(e));
  }

  function initMobileStreamModal() {
    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: { exact: "environment" } }
      })
      .then(async function(stream) {
        mobileStream.srcObject = stream;
        await mobileStream.play();
        initQuagga();
      })
      .catch(function(err) {
        console.log("An error occurred: " + err);
      });
  }

  function hanldeQuaggaResults(e) {
    console.log(e);
    if (e.codeResult) {
      if (e.codeResult.code.length > 8) {
        barcodeInput.val(e.codeResult.code);
        modal.find(".secondary-action").trigger("click");
        Quagga.stop();
      }
    }
  }

  function initListeners() {
    btn.on("click", e => {
      alertModal.display({
        modalId: "mobileLiveScanModal",
        onInit: () => initMobileStreamModal(),
        afterInit: () => {}
      });
    });
  }
  function _init({ resultInput, openButton }) {
    barcodeInput = $(resultInput);
    btn = $(openButton);
    initListeners();
  }
  return {
    init: _init
  };
})();

var quaggaDefaultConfig = {
  inputStream: {
    type: "ImageStream",
    length: 10,
    size: 1800
  },
  numOfWorkers: 1,
  locate: true,
  locator: {
    patchSize: "medium",
    halfSample: true
  }
};

function decodeBarcode(src, config, cb) {
  function handleResults(result) {
    if (result) {
      if (result.codeResult) {
        console.timeEnd("time to success scan barcode");
        cb(result.codeResult.code);
      }
    }
  }

  config.src = src;
  console.time("time to scan barcode");

  Quagga.decodeSingle(config, result => {
    handleResults(result);

    config.inputStream.size = 1600;

    Quagga.decodeSingle(config, result => {
      handleResults(result);

      config.inputStream.size = 1200;

      Quagga.decodeSingle(config, result => {
        handleResults(result);

        config.inputStream.size = 600;

        Quagga.decodeSingle(config, result => {
          handleResults(result);

          console.timeEnd("time to failed scan barcode");
          cb(false);
        });
      });
    });
  });
}

function initSelect2() {
  $.each($("[select2-type]"), (i, val) => {
    var displayMode = $(val).attr("select2-type");
    var settings = {
      width: "100%",
      dir: _translations.dir,
      placeholder: $(val).attr("placeholder")
    };
    displayMode != "search"
      ? (settings.minimumResultsForSearch = -1)
      : delete settings.minimumResultsForSearch;
    $(val).select2(settings);
  });
}

function initUploadField() {
  $('[type="file"]').on("change", e => {
    var $parent = $(e.target).parent();
    var $this = $(e.target);

    function readURL(input) {
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = e => {
          $parent.find(".upload-caddy").attr("src", e.target.result);
          $parent
            .find(`[for="${$this.attr("id")}"]`)
            .addClass("d-flex align-items-center justify-content-between");
          $parent
            .find(`[for="${$this.attr("id")}"]`)
            .find("u")
            .html("החלף תמונה");
        };

        reader.readAsDataURL(input.files[0]);
      }
    }

    e.target.files && e.target.files.length ? readURL(e.target) : "";
  });
}

function initMandatoryFields() {
  var fields = $("[mandatory]");
  var emptyFields = [];

  function formValidated() {
    var valid = true;
    emptyFields = [];

    $.each(fields, (i, val) => {
      var $val = $(val);
      if ($val.val() == "" || $val.val() == undefined) {
        valid = false;
        emptyFields.push($val);
      }
    });

    return valid;
  }

  $('[type="submit"]').on("click", e => {
    e.preventDefault();

    if (formValidated()) {
      $("form").submit();
    } else {
      $(".field-message").remove();

      alertModal.display({
        content: "חלק מהשדות הנדרשים ריקים",
        hideSecondary: true,
        primaryLabel: "הבנתי"
      });

      $.each(emptyFields, (i, val) => {
        var $val = $(val);
        $val.after('<span class="field-message text-danger">שדה חובה</span>');
        $val.addClass("border border-danger");

        $val.on("input", e => {
          $val.removeClass("border border-danger");
        });
      });
    }
  });
}

function dataURItoBlob(dataURI) {
  var byteString = atob(dataURI.split(",")[1]);

  // separate out the mime component
  var mimeString = dataURI
    .split(",")[0]
    .split(":")[1]
    .split(";")[0];

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
}

function initClearInputHelper() {
  $('#clearBarcodeHelper').on('click', e => $(e.target).closest('.form-group').find('input').val(''))
}

$(() => {
  initClearInputHelper()
  
  alertModal.init();

  initUploadField();

  initMandatoryFields();
});
