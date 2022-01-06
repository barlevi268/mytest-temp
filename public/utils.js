function initAlertModal() {
  var alertModal = {
    subView: $("#alertModal"),
    show: function () {
      alertModal.subView.modal("show");
    },
    clear: function () {
      alertModal.primaryButton.html("אישור");
      alertModal.secondaryButton.html("ביטול");
      alertModal.primaryButton.on("click", () => alertModal.hide());
      alertModal.secondaryButton.on("click", () => alertModal.hide());
      alertModal.successIcon.addClass("d-none");
      alertModal.secondaryButton.addClass(["col-spaced", "col-6"]);
    },
    hide: function () {
      alertModal.subView.modal("hide");
      alertModal.clear();
    },
    display: function (message) {
      if (typeof message == "object") {
        if (message.modalId) {
          alertModal.subView = $(`#${message.modalId}`);
          alertModal.init();
        }

        if (message.content) {
          alertModal.content.html(message.content);
        }

        if (message.primaryAction) {
          alertModal.primaryButton.on("click", (e) =>
            message.primaryAction.call(e)
          );
        }
        if (message.preventPrimaryDismiss) {
          alertModal.primaryButton
            .off()
            .on("click", (e) => message.primaryAction.call(e));
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
          alertModal.subView.on("shown.bs.modal", () =>
            message.afterInit.call()
          );
        }
      } else if (typeof message == "string") {
        alertModal.content.html(message);
      }
      alertModal.show();
    },
    init: function () {
      alertModal.subView.modal({ backdrop: "static", keyboard: false });
      alertModal.content = alertModal.subView.find(".modal-message");
      alertModal.successIcon = alertModal.subView.find(".modal-icon");
      alertModal.primaryButton = alertModal.subView.find(".primary-action");
      alertModal.secondaryButton = alertModal.subView.find(".secondary-action");
      alertModal.clear();
    },
  };
  
  window["alertModal"] = alertModal
}

var mobileStream = (function () {
  var modal = $("#mobileLiveScanModal");
  var mobileStreamElm = $(".mobile-stream");
  var btn;
  var barcodeInput;

  function initQuagga() {
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: ".mobile-stream",
        },
        decoder: {
          readers: ["code_128_reader"],
        },
      },
      function (err) {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();
        mobileStreamElm.find("video").on("click", reloadStream);
      }
    );

    Quagga.onDetected((e) => hanldeQuaggaResults(e));
  }

  function reloadStream() {
    mobileStreamElm.find("video").remove();
    initQuagga();
  }

  function hanldeQuaggaResults(e) {
    if (e.codeResult) {
      if (e.codeResult.code.length > 8) {
        barcodeInput.val(e.codeResult.code);
        modal.find(".secondary-action").trigger("click");
        Quagga.stop();
      }
    }
  }

  function initListeners() {
    btn.on("click", (e) => {
      alertModal.display({
        modalId: "mobileLiveScanModal",
        onInit: () => initQuagga(),
        afterInit: () => {},
      });
    });
  }
  function _init({ resultInput, openButton }) {
    barcodeInput = $(resultInput);
    btn = $(openButton);
    initListeners();
  }
  return {
    init: _init,
    refresh: initQuagga,
  };
})();

var quaggaDefaultConfig = {
  inputStream: {
    type: "ImageStream",
    length: 10,
    size: 1800,
  },
  numOfWorkers: 1,
  locate: true,
  locator: {
    patchSize: "medium",
    halfSample: true,
  },
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

  Quagga.decodeSingle(config, (result) => {
    handleResults(result);

    config.inputStream.size = 1600;

    Quagga.decodeSingle(config, (result) => {
      handleResults(result);

      config.inputStream.size = 1200;

      Quagga.decodeSingle(config, (result) => {
        handleResults(result);

        config.inputStream.size = 600;

        Quagga.decodeSingle(config, (result) => {
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
      placeholder: $(val).attr("placeholder"),
    };
    displayMode != "search"
      ? (settings.minimumResultsForSearch = -1)
      : delete settings.minimumResultsForSearch;
    $(val).select2(settings);
  });
}


function dataURItoBlob(dataURI) {
  var byteString = atob(dataURI.split(",")[1]);

  // separate out the mime component
  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
}

function initClearInputHelper() {
  $("#clearBarcodeHelper").on("click", (e) =>
    $(e.target).closest(".form-group").find("input").val("")
  );
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

  $('[type="submit"]').on("click", (e) => {
    e.preventDefault();

    if (formValidated()) {
      $("form").submit();
    } else {
      $(".field-message").remove();

      alertModal.display({
        content: "חלק מהשדות הנדרשים ריקים",
        hideSecondary: true,
        primaryLabel: "הבנתי",
      });

      $.each(emptyFields, (i, val) => {
        var $val = $(val);
        $val.after('<span class="field-message text-danger">שדה חובה</span>');
        $val.addClass("border border-danger");

        $val.on("input", (e) => {
          $val.removeClass("border border-danger");
        });
      });
    }
  });
}

$(() => {
  initMandatoryFields();
  
  initAlertModal()
});