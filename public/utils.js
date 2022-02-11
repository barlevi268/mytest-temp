var isMobile = "ontouchstart" in window;

var localizations = (async function () {
  var elements = document.querySelectorAll("[trns]");
  var inputs = document.querySelectorAll("input");
  var selects = document.querySelectorAll("select");

  var lang = localStorage.getItem("lang") ? localStorage.getItem("lang") : "HE";

  var langRequest = await fetch(`/translations/${lang}.json`);
  var langResults = await langRequest.json();

  document.querySelector("html").setAttribute("dir", langResults.dir);

  const translateValue = (value) => {
    var text = langResults.values[value];
    return text ? text : value;
  };

  elements.forEach((item) => {
    item.textContent = translateValue(item.textContent.trim());
  });

  [...selects, ...inputs].forEach((input) => {
    input.setAttribute(
      "placeholder",
      translateValue(input.getAttribute("placeholder"))
    );
  });

  function _init() {
    $(".form-loader").remove();
    $(".container").show();
    var selectLang = document.querySelector(".floating-lang");
    if (selectLang) {
      selectLang.value = lang;
      selectLang.addEventListener("change", (e) => {
        localStorage.setItem("lang", e.target.value);
        location.reload();
      });
    }

    window["_translations"] = langResults;
    initSelect2();
  }

  _init();
})();

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
        if (!message.modalId) {
          message.modalId = 'alertModal';
        }

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
  var modal;
  var mobileStreamElm;
  var btn;
  var barcodeInput;
  var barcodeInputCallback;
  var html5QrCode;

  function initQuagga() {
    html5QrCode = new Html5Qrcode("mobileStream");
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    html5QrCode.start({ facingMode: "environment" }, config, hanldeQuaggaResults);
  }

  function reloadStream() {
    mobileStreamElm.find("video").remove();
    initQuagga();
  }

  function hanldeQuaggaResults(decodedText, decodedResult) {
    if (decodedText) {
      if (decodedText.length > 1) {
        barcodeInput.val(decodedText);
        if (barcodeInputCallback) {
          barcodeInputCallback(decodedText);
        }
        modal.find('.modal-icon').removeClass('d-none');
        html5QrCode.stop()
        setTimeout(() => {
          modal.find(".secondary-action").trigger("click");
        }, 1000)
      }
    }
  }

  function initListeners() {
    btn.on("click", (e) => {
      modal.find('.modal-icon').addClass('d-none');
      alertModal.display({
        modalId: "mobileLiveScanModal",
        onInit: () => initQuagga(),
        afterInit: () => {},
        secondaryAction:() => {
          if (html5QrCode.getState() === 2) {
            html5QrCode.stop();
          }
        }
      });
    });
  }
  function _init({ resultInput, openButton, resultInputCallback }) {
    barcodeInput = $(resultInput);
    btn = $(openButton);
    barcodeInputCallback = resultInputCallback;
    modal = $("#mobileLiveScanModal")
    mobileStreamElm = $(".mobile-stream")
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

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
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



function initMandatoryFields() {
  var fields = $("[mandatory]");
  var emptyFields = [];

  function formValidated() {
    var valid = true;
    emptyFields = [];

    $.each(fields, (i, val) => {
      var $val = $(val);
      if ($val.attr('type') === 'radio') {
        let isCheckedRadio = false;
        $.each($val.find('input'), (iRadio, valRadio) => {
          let $valRadio = $(valRadio);
          if ($valRadio.is(":checked")) {
            isCheckedRadio = true;
          }
        })
        if (!isCheckedRadio) {
          valid = false;
          emptyFields.push($val);
        }
        return
      }
      if ($val.attr('type') === 'email') {
        let email = $val.val();
        let filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        if (!filter.test(email)) {
          valid = false;
          emptyFields.push($val);
          return;
        }
      }
      if ($val.val() == "" || $val.val() == undefined) {
        valid = false;
        emptyFields.push($val);
        return;
      }

      if ($val.attr('data-type') === 'phone') {
        if (!formIsValidPhone($val.val())) {
          valid = false;
          emptyFields.push($val);
          return;
        }
      }
      if ($val.attr('data-type-radio')) {
        let type = $(`[name=${$val.attr('data-type-radio')}]:checked`).val()
        if (!type) {
          return;
        }
      if (type === 'id') {
       if (!isValidIsraeliID($val.val())) {
         valid = false;
         emptyFields.push($val);
         return;
       }
      }
        if (type === 'passport') {
          if (!isOnlyNumber($val.val())) {
            valid = false;
            emptyFields.push($val);
            return;
          }
        }
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
        let isTypeRadio = false;
        var $val = $(val);
        if ($val.attr('type') === 'radio') {
          isTypeRadio = true;
        }
        $val.after(`<span class="field-message text-danger">${getError($val)}</span>`);
        if (isTypeRadio) {
          let label$ = $val.find('input + label');
          $.each(label$, (_, labelVal) => {
            $(labelVal).addClass("border border-danger");
          })

          $.each($val.find('input'), (_, inputVal) => {
            $(inputVal).on("change", (e) => {
              $.each(label$, (_, labelVal) => {
                $(labelVal).removeClass("border border-danger");
              })
              $val.nextAll('span.field-message').remove();
            });
          })
          return;
        }

        $val.addClass("border border-danger");

        $val.on("input", (e) => {
          $val.removeClass("border border-danger");
          $val.nextAll('span.field-message').remove();
        });
      });
    }
  });

  function formIsValidPhone(val) {
    let phoneArr = (val || '').split('');
    return phoneArr.length === 10 && phoneArr[0] === '0' && phoneArr[1] === '5';
  }
  function isOnlyNumber(val) {
    return /^\d+$/.test(val || '')
  }

  function isValidIsraeliID(IsraeliID) {
    if (!IsraeliID) {
      IsraeliID = '';
    }
    let id = String(IsraeliID).trim();
    if (id.length > 9 || id.length < 5 || isNaN(parseInt(id))) return false;

    // Pad string with zeros up to 9 digits
    id = id.length < 9 ? ('00000000' + id).slice(-9) : id;

    return (
      Array.from(id, Number).reduce((counter, digit, i) => {
        const step = digit * ((i % 2) + 1);
        return counter + (step > 9 ? step - 9 : step);
      }) %
      10 ===
      0
    );
  }

  function getError($val) {
    let type = '';

    if ($val.attr('type')) {
      type = $val.attr('type');
    }
    if ($val.attr('data-type')) {
      type =$val.attr('data-type');
    }

    if ($val.attr('data-type-radio')) {
      let tempType = $(`[name=${$val.attr('data-type-radio')}]:checked`).val();
      if (tempType) {
        type = tempType;
      }
    }

    if ($val.val()) {
      switch (type) {
        case 'email': {
          return 'Invalid Email Address'
        }
        case 'phone': {
          return 'Invalid phone'
        }
        case 'id': {
          return 'Invalid Israeli ID'
        }
        case 'passport': {
          return 'only number'
        }
      }
    }
    return 'שדה חובה';
  }
}

$.fn.btn = function (action) {
  const spinner = $(
      '<span class="btn-spinner spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );

  function disable(elm) {
      $(elm).prop("disabled", true);
  }

  function enable(elm) {
      $(elm).prop("disabled", false);
  }

  function startLoader(elm) {
      var text = $(`<span class="btn-label">${$(elm).text()}</span>`);

      text.hide();
      $(elm).btn("disable");
      $(elm)
          .html("")
          .append(text, spinner);
  }

  function stopLoader(elm) {
      $(elm)
          .find(".btn-label")
          .show();
      $(elm)
          .find(".btn-spinner")
          .hide();
      $(elm).btn("enable");
  }

  return this.each(function () {
      action == "disable" && disable(this);
      action == "enable" && enable(this);
      action == "startLoader" && startLoader(this);
      action == "stopLoader" && stopLoader(this);
  });
};

Swal.warning = function (message) {
  Swal.fire({
      title: message,
      icon: "warning",
      showConfirmButton: false,
      timer: 1500
  });
};

Swal.error = function (message) {
  Swal.fire({
      title: message,
      icon: "error",
      showConfirmButton: false,
      timer: 1500
  });
};

Swal.success = function (message) {
  Swal.fire({
      title: message,
      icon: "success",
      showConfirmButton: false,
      timer: 1500
  });
};

const valByName = (nameAtt) => $(`[name="${nameAtt}"]`).val()

function initPrefixFields() {
  var prefixFields = $('[data-prefix]');
  prefixFields.each((_, val) => {
    let prefix = $(val).attr('data-prefix');
    $(val).val(prefix);
    $(val).on('paste keydown', (e) => {
      let prefix = $(val).attr('data-prefix');
      let oldvalue = $(val).val();
      setTimeout( () => {
        if ($(val).val().indexOf(prefix) !== 0) {
          $(val).val(oldvalue);
        }
      }, 1)
    });
  })
}

$(() => {
  initAlertModal()
  initMandatoryFields();
  initPrefixFields();
});
