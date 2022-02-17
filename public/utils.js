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
    modals: {},
    show: function (modalId) {
      alertModal.modals[modalId].subView.modal("show")
    },
    clear: function (modalId) {
      alertModal.modals[modalId].primaryButton.html("אישור");
      alertModal.modals[modalId].secondaryButton.html("ביטול");
      alertModal.modals[modalId].primaryButton.off();
      alertModal.modals[modalId].secondaryButton.off();
      alertModal.modals[modalId].primaryButton.on("click", () => alertModal.hide(modalId));
      alertModal.modals[modalId].secondaryButton.on("click", () => alertModal.hide(modalId));
      alertModal.modals[modalId].successIcon.addClass("d-none");
      alertModal.modals[modalId].secondaryButton.addClass(["col-spaced", "col-6"]);
    },
    hide: function (modalId) {
      alertModal.modals[modalId].subView.modal("hide");
      alertModal.clear(modalId);
    },
    display: function (message) {
      if (typeof message == "object") {
        if (!message.modalId) {
          message.modalId = 'alertModal';
        }

        if (message.modalId) {
          alertModal.modals[message.modalId] = {};
          alertModal.modals[message.modalId].subView = $(`#${message.modalId}`);
          alertModal.init(message.modalId);
        }

        if (message.content) {
          alertModal.modals[message.modalId].content.html(message.content);
        }

        if (message.primaryAction) {
          alertModal.modals[message.modalId].primaryButton.on("click", (e) =>
            message.primaryAction.call(e)
          );
        }
        if (message.preventPrimaryDismiss) {
          alertModal.modals[message.modalId].primaryButton
            .off()
            .on("click", (e) => message.primaryAction.call(e));
        }

        if (message.primaryLabel) {
          alertModal.modals[message.modalId].primaryButton.html(message.primaryLabel);
        }

        if (message.secondaryAction) {
          alertModal.modals[message.modalId].secondaryButton.on("click", message.secondaryAction);
        }

        if (message.secondaryLabel) {
          alertModal.modals[message.modalId].secondaryButton.html(message.secondaryLabel);
        }

        if (message.hideSecondary) {
          alertModal.modals[message.modalId].secondaryButton.hide(message.modalId);
          alertModal.modals[message.modalId].primaryButton.removeClass(["col-spaced", "col-6"]);
        }

        if (message.icon) {
          message.icon == "success"
            ? alertModal.modals[message.modalId].successIcon.removeClass("d-none")
            : alertModal.modals[message.modalId].successIcon.addClass("d-none");
        }

        if (message.onInit) {
          message.onInit.call();
        }

        if (message.afterInit) {
          alertModal.modals[message.modalId].subView.on("shown.bs.modal", () =>
            message.afterInit.call()
          );
        }
      } else if (typeof message == "string") {
        alertModal.modals[message.modalId].content.html(message);
      }
      alertModal.show(message.modalId);
    },
    init: function (modalId) {
      if (!modalId) {
        modalId = 'alertModal';
        alertModal.modals[modalId] = {};
        alertModal.modals[modalId].subView = $(`#${modalId}`);
      }
      alertModal.modals[modalId].subView.modal({ backdrop: "static", keyboard: false });
      alertModal.modals[modalId].content = alertModal.modals[modalId].subView.find(".modal-message");
      alertModal.modals[modalId].successIcon = alertModal.modals[modalId].subView.find(".modal-icon");
      alertModal.modals[modalId].primaryButton = alertModal.modals[modalId].subView.find(".primary-action");
      alertModal.modals[modalId].secondaryButton = alertModal.modals[modalId].subView.find(".secondary-action");
      alertModal.clear(modalId);
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

function isValidForm(form$) {
  return initMandatoryFields.formValidated({
    emptyFields: [],
    form: form$,
    fields: form$.find("[mandatory]")
  })
}
window['isValidForm'] = isValidForm;

var initMandatoryFields  = {
  forms: $("form"),
  formsAndFields: [],
  init: () => {
    initMandatoryFields.forms = $("form");
    initMandatoryFields.formsAndFields = [];
    $.each(initMandatoryFields.forms, (_, form) => {
      let fields = $(form).find("[mandatory]")
      initMandatoryFields.formsAndFields.push({
        form: $(form),
        fields: fields,
        emptyFields: []
      })
    })

    $('[type="submit"]').on("click", (e) => {
      e.preventDefault();
      let formHtml = $(e.target).closest("form");
      let formObject = initMandatoryFields.getForm(formHtml);
      if (initMandatoryFields.formValidated(formObject)) {
        formObject.form.submit();
      } else {
        $(".field-message").remove();

        alertModal.display({
          content: "חלק מהשדות הנדרשים ריקים",
          hideSecondary: true,
          primaryLabel: "הבנתי",
        });

        $.each(formObject.emptyFields, (i, val) => {
          let isTypeRadio = false;
          var $val = $(val);
          let dataRequiredIf$;
          const dataRequiredIf = $val.attr('data-required-if');
          if (dataRequiredIf) {
            dataRequiredIf$ = formObject.form.find(`[name=${dataRequiredIf}]`)
          }
          if ($val.attr('type') === 'radio') {
            isTypeRadio = true;
          }
          $val.after(`<span class="field-message text-danger">${initMandatoryFields.getError($val)}</span>`);
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
            if (dataRequiredIf$) {
              dataRequiredIf$.removeClass("border border-danger");
              dataRequiredIf$.nextAll('span.field-message').remove();
            }
          });
        });
      }
    });
  },


  formValidated: (formObject) => {
    formObject.emptyFields = [];

    $.each(formObject.fields, (i, val) => {
      var $val = formObject.form.find(val);
      if ($val.attr('type') === 'radio') {
        let isCheckedRadio = false;
        $.each($val.find('input'), (iRadio, valRadio) => {
          let $valRadio = $(valRadio);
          if ($valRadio.is(":checked")) {
            isCheckedRadio = true;
          }
        })
        if (!isCheckedRadio) {
          formObject.emptyFields.push($val);
        }
        return
      }
      if ($val.attr('type') === 'email') {
        let email = $val.val();
        let filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        if (!filter.test(email)) {
          formObject.emptyFields.push($val);
          return;
        }
      }
      if ($val.attr('type') === 'number') {
        if (!initMandatoryFields.isOnlyNumber($val.val())) {
          formObject.emptyFields.push($val);
          return;
        }
      }
      if ($val.val() == "" || $val.val() == undefined) {
        formObject.emptyFields.push($val);
        return;
      }

      if ($val.attr('data-type') === 'phone') {
        if (!initMandatoryFields.formIsValidPhone($val.val())) {
          formObject.emptyFields.push($val);
          return;
        }
      }
      if ($val.attr('data-type-radio')) {
        let type = formObject.form.find(`[name=${$val.attr('data-type-radio')}]:checked`).val()
        if (!type) {
          return;
        }
      if (type === 'id') {
       if (!initMandatoryFields.isValidIsraeliID($val.val())) {
         formObject.emptyFields.push($val);
         return;
       }
      }
        if (type === 'passport') {
          if (!initMandatoryFields.isOnlyNumber($val.val())) {
            formObject.emptyFields.push($val);
            return;
          }
        }
      }
    });

    formObject.emptyFields = formObject.emptyFields.filter(emptyField => {
      const dataRequiredIf = emptyField.attr('data-required-if');
      if (!dataRequiredIf) {
        return true;
      }

      if (!!initMandatoryFields.findEmptyFieldsByName(formObject, dataRequiredIf)) {
        return true;
      }
      return !!emptyField.val();
    })

    const valid = !formObject.emptyFields.length;
    return valid;
  },

  findEmptyFieldsByName: (formObject, name) => {
    return formObject.emptyFields.find(emptyField => emptyField.attr('name') === name);
  },

  getForm: (form) =>  {
    return initMandatoryFields.formsAndFields.find(formAndFields => {
      return formAndFields.form[0] === form[0]
    });
  },

  formIsValidPhone: (val) =>  {
    let phoneArr = (val || '').split('');
    return phoneArr.length === 10 && phoneArr[0] === '0' && phoneArr[1] === '5';
  },
  isOnlyNumber: (val) => {
    return /^\d+$/.test(val || '')
  },

  isValidIsraeliID: (IsraeliID) => {
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
  },

  getError: ($val) => {
    let types = [];

    if ($val.attr('type')) {
      types = [$val.attr('type')];
    }
    if ($val.attr('data-type')) {
      types = [$val.attr('data-type')];
    }

    if ($val.attr('data-type-radio')) {
      let tempType = $(`[name=${$val.attr('data-type-radio')}]:checked`).val();
      if (tempType) {
        types = [tempType];
      }
    }
    let dataRequiredIf = $val.attr('data-required-if');

    if (dataRequiredIf) {
      let dataRequiredIf$ = $val.closest('form').find(`[name=${dataRequiredIf}`);

      if (dataRequiredIf$.attr('type')) {
        types.push(dataRequiredIf$.attr('type'));
      }
      if (dataRequiredIf$.attr('data-type')) {
        types.push(dataRequiredIf$.attr('data-type'));
      }
    }

    let errorsArray = [];
    if ($val.val()) {
      types.forEach(type => {
        switch (type) {
          case 'email': {
            errorsArray.push('Invalid Email Address');
            return;
          }
          case 'phone': {
            errorsArray.push('Invalid phone');
            return;
          }
          case 'id': {
            errorsArray.push('Invalid Israeli ID');
            return;
          }
          case 'number':
          case 'passport': {
            errorsArray.push('only number');
            return;
          }
        }
      })
    }
    if (errorsArray.length) {
      return errorsArray.join(' or ')
    }
    let requiredArray = [];
    types.forEach(type => {
      switch (type) {
        case 'email': {
          requiredArray.push('required Email Address');
          return;
        }
        case 'phone': {
          requiredArray.push('required phone');
          return;
        }
        case 'id': {
          requiredArray.push('required Israeli ID');
          return;
        }
        case 'passport': {
          requiredArray.push('required passport');
          return;
        }
        default: {
          requiredArray.push('שדה חובה');
          return;
        }
      }
    })
    if (!requiredArray.length) {
      requiredArray = ['שדה חובה'];
    }
    return requiredArray.join(' or ');
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

var mobileStreamVideo = (function () {
  var modal;
  var mobileStreamElm;
  var btn;
  var barcodeInput;
  var inputCallback;
  var previewVideoRecordCanvas;
  var previewVideoRecordCanvasContext;
  var previewVideoRecordFile;
  var previewVideoRecordVideo;
  var camera_stream;
  var seconds;
  let isVideoRecord = false;
  var startRecord;
  var stopRecord;
  var setIntervalRecord;
  var media_recorder = null;
  var blobs_recorded = [];
  var setTimeoutVal;

  function initQuagga(stream, modalId) {
    let thisModal = $(`#${modalId}`);
    startRecord = thisModal.find('#start-record');
    startRecord.removeClass('d-none')
    stopRecord = thisModal.find('.secondary-action');
    stopRecord.addClass('d-none')
    seconds = undefined;
    media_recorder = null;
    blobs_recorded = [];
    listenStart();

    previewVideoRecordCanvas = $('#previewVideoRecord')[0];
    previewVideoRecordCanvasContext = $('#previewVideoRecord')[0].getContext('2d');
    previewVideoRecordFile = $('#previewVideoRecordFile');
    previewVideoRecordVideo = $('#previewVideoRecordVideo');
    previewVideoRecordVideo[0].srcObject = stream;
    timerCallback();
  }

  function listenStart() {
    startRecord.on('click',() => {
      isVideoRecord = true;
      startRecord.addClass('d-none');
      stopRecord.removeClass('d-none');
      stopRecord.prop('disabled', true);
      startRecords();
    })
  }
  function startSeconds() {
    seconds = 0;
    setIntervalRecord = setInterval(() => {
      ++seconds;
      if (seconds >= 60) {
        stopRecord.prop('disabled', false);
      }
      if (seconds >= 180) {
        modal.find(".secondary-action").trigger("click");
      }
    }, 1000)
  }
  function stopSeconds() {
    if (!setIntervalRecord) {
      return
    }
    clearInterval(setIntervalRecord);
    clearTimeout(setTimeoutVal);
  }

  function startRecords() {
    startSeconds();
    media_recorder = new MediaRecorder(camera_stream, { mimeType: 'video/webm' });

    // event : new recorded video blob available
    media_recorder.addEventListener('dataavailable', function(e) {
      blobs_recorded.push(e.data);
    });

    // event : recording stopped & all blobs sent
    media_recorder.addEventListener('stop', function() {});

    media_recorder.start(1000);
  }

  function stopRecords() {
    if (media_recorder) {
      media_recorder.stop();
    }
    stopBothVideoAndAudio(camera_stream);
    stopSeconds();
    if (blobs_recorded.length) {
      let file = new File(blobs_recorded, "video.webm", {type: "video/webm", lastModified: new Date().getTime()});
      let container = new DataTransfer();
      container.items.add(file);
      barcodeInput[0].files = container.files;
      inputCallback(container.files);
    }
  }

  function stopBothVideoAndAudio(stream) {
    stream.getTracks().forEach(function(track) {
      if (track.readyState == 'live') {
        track.stop();
      }
    });
  }

  function timerCallback() {
    if (!isVideoRecord) {
      return;
    }
    computeFrame();
    setTimeoutVal = setTimeout(() => {
      timerCallback();
    }, 0);
  }

  function computeFrame() {
    const heightCanvas = previewVideoRecordCanvasContext.canvas.width * previewVideoRecordVideo[0].videoHeight / previewVideoRecordVideo[0].videoWidth;
    if (!heightCanvas) {
      return
    }
    previewVideoRecordCanvasContext.canvas.height = heightCanvas;
    previewVideoRecordCanvasContext.drawImage(
      previewVideoRecordVideo[0], 0, 0,
      previewVideoRecordCanvasContext.canvas.width,
      heightCanvas
    );
    previewVideoRecordCanvasContext.fillStyle = "#ff0000";
    previewVideoRecordCanvasContext.font = "2rem serif";
    previewVideoRecordCanvasContext.fillText(getCurrentTime(), 10, previewVideoRecordCanvasContext.canvas.height - 20);
  }

  function getCurrentTime() {
    if (!seconds) {
      return '';
    }
    let minutes = Math.floor(seconds/60);
    let sec = seconds%60;
    if (minutes < 10) {
      minutes = `0${minutes}`
    }
    if (sec < 10) {
      sec = `0${sec}`
    }
    return `${minutes}:${sec}`
  }

  function initListeners() {
    btn.on("click", async (e) => {
      try {
        isVideoRecord = true;
        camera_stream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
        modal.find('.modal-icon').addClass('d-none');
        alertModal.display({
          modalId: "mobileLiveRecordTestModal",
          onInit: () => initQuagga(camera_stream, 'mobileLiveRecordTestModal'),
          afterInit: () => {},
          secondaryAction: () => {
            isVideoRecord = false;
            stopRecords();
          }
        });
      } catch (err) {
        console.error(err);
        alertModal.display({
          content: "You have blocked access to the camera",
          hideSecondary: true,
          primaryLabel: "הבנתי",
        });
      }
    });
  }
  function _init({ resultInput, openButton, resultInputCallback }) {
    barcodeInput = $(resultInput);
    btn = $(openButton);
    inputCallback = resultInputCallback;
    modal = $("#mobileLiveRecordTestModal")
    mobileStreamElm = $(".mobile-stream")
    initListeners();
  }
  return {
    init: _init,
    refresh: initQuagga,
  };
})();

$(() => {
  initAlertModal()
  initMandatoryFields.init();
  initPrefixFields();
});
