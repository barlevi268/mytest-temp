var impairTestBarcodeField = $('.impair-test-barcode');
var uploadCaddyField = $('.upload-caddy');
var photoPassportBtn = $('[name=photo_passport]');
var addNewUserForm = $('#addNewUser');
var birthDateForm = $('[name=birth_date]');
var photoPassportFile;
var barCodeValue;


function prepareFromData() {
  let formData = new FormData();
  addNewUserForm.find('[name]').each(function() {
    $(this).attr('name') != "photo_passport" && formData.append($(this).attr('name'), $(this).val());
  });

  formData.append("serial_number", barCodeValue);
  formData.append("photo_passport", addNewUserForm.find('[name="photo_passport"]')[0].files[0]);

  return formData;
}

function handleSubmitSuccess(res) {
  alertModal.display({
    modalId: 'visitSuccessModal',
    content: "מועבר לתשלום",
    icon: "success",
    hideSecondary: true,
    hidePrimary: true,
  });
  setTimeout(() => {
    if (res.data?.payment_url?.length) {
      location.href = res.data.payment_url
    } else {
      location.href = '/'
    }
  }, 1000)
}

function handleSubmitFailure(res) {
  var errorMessage = res.message;
  var errorData = res.data;

  var formattedError = function() {
    var combinedError = '';
    for (var key in errorData) {
      combinedError += `${errorData[key][0]}</br>`
    }
    return combinedError
  }()

  if (errorMessage == 'Validation failed') {

    alertModal.display({
      modalId: 'alertModal',
      content: formattedError,
      hideSecondary: true,
      primaryLabel: "הבנתי",
    });

  } else if (errorMessage == 'invalid voucher') {
    alertModal.display({
      modalId: 'alertModal',
      content: "קוד קופון לא תקף",
      hideSecondary: true,
      primaryLabel: "הבנתי",
    });
  }
}

addNewUserForm.on('submit',async (e) => {
  e.preventDefault();

  var formData = prepareFromData();

  var requestOpbject = new RequestObject('POST', formData, false,'text', false);
  request('/api/register', requestOpbject)
    .then(res => handleSubmitSuccess(res))
    .catch((res,ajax,status) => handleSubmitFailure(JSON.parse(res)))

})

$('.voucher-toggle').on('click', () => $('#cuponRow').toggleClass('d-none'));


function setValueBarCode(value) {
  if (value) {
    barCodeValue = value;
    impairTestBarcodeField.removeClass('d-none')
    $('#submitButton').prop('disabled', false)
    return;
  }
  barCodeValue = undefined;
  impairTestBarcodeField.addClass('d-none')
}

async function setPhotoPassport(event) {
  if (event && event.target.files) {
    photoPassportFile = event.target.files[0];
    const photoPassportFileBase64 = await toBase64(photoPassportFile);
    if (photoPassportFileBase64) {
      uploadCaddyField.attr('src', photoPassportFileBase64)
      uploadCaddyField.removeClass('d-none')
      return
    }
  }
  photoPassportFile = undefined;
  uploadCaddyField.attr('src', undefined);
  uploadCaddyField.addClass('d-none')
}

function resetForm() {
  if (addNewUserForm && addNewUserForm[0]) {
    addNewUserForm[0].reset();
    setPhotoPassport();
    setValueBarCode();
  }
}

function initCities() {
  $.getJSON("/media/cities.json", data =>
    $.each(data, (i, val) =>
      $('[name="city_code"]').append(
        `<option value="${val.City_Code}">${val.CityName_Hebrew}</option>`
      )
    )
  );
}

function initBirthDate() {
  birthDateForm.daterangepicker({
    singleDatePicker: true,
    showDropdowns: true,
    maxDate: moment().toDate(),
    minDate: '01/01/1900',
    opens: 'left',
    direction: true,
    startDate: '01/01/2000',
    locale: {
      cancelLabel: 'לְבַטֵל',
      applyLabel: "לְיַשֵׂם",
      customRangeLabel: 'טווח תאריכים',
      daysOfWeek: [
        'א\'', 'ב\'', 'ג\'', 'ד\'', 'ה\'', 'ו\'', 'שבת'
      ],
      monthNames: [
        'ינו',
        'פבר',
        'מרץ',
        'אפר',
        'מאי',
        'יוני',
        'יולי',
        'אוג',
        'ספט',
        'אוק',
        'נוב',
        'דצמ',
      ],
    },
  }, (start, end, label) => {
    birthDateForm.val(start.format("DD/MM/YYYY"));
  });
}


$(() => {
  alertModal.init()
  initCities();
  initBirthDate();
  mobileStream.init({
    resultInput:'[name=barcode]',
    openButton: '.mobile-stream-btn',
    resultInputCallback: (value) => setValueBarCode(value)
  });

  photoPassportBtn.on("change", async event => setPhotoPassport(event));
});
