var uploadCaddyField = $('.upload-caddy');
var photoPassportBtn = $('[name=photo_passport]');
var addNewUserForm = $('#addNewUser');
var birthDateForm = $('[name=birth_date]');
var photoPassportFile;


function prepareFromData() {
  let formData = new FormData();
  addNewUserForm.find('[name]').each(function() {
    switch ($(this).attr('name')) {
      case 'photo_passport':
      case 'id_type':
      case 'DOB_day':
      case 'DOB_month':
      case 'DOB_year':
      {
        return;
      }
    }
    formData.append($(this).attr('name'), $(this).val());
  });

  let IdType = addNewUserForm.find('[name="id_type"]:checked').val();
  let idTypeVal = 0;
  switch (IdType) {
    case 'id': {
      idTypeVal = 1;
      break
    }

    case 'passport': {
      idTypeVal = 2;
      break
    }
  }

  formData.append('birth_date', [
    addNewUserForm.find('[name=DOB_day]').val(),
    addNewUserForm.find('[name=DOB_month]').val(),
    addNewUserForm.find('[name=DOB_year]').val()
  ].join('/'));

  formData.append("id_type", idTypeVal.toString());
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

async function setPhotoPassport(event) {
  if (event && event.target.files && event.target.files.length) {
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


function initListenValidForm() {
  addNewUserForm.find(':input').on('input change',() => {
    if (isValidForm(addNewUserForm)) {
      addNewUserForm.find('[type=submit]').prop('disabled', false);
      return
    }
    addNewUserForm.find('[type=submit]').prop('disabled', true);
  });
}

function handleBirthDateValidator() {
  var monthSelect = $("#DOB_month");
  var daySelect = $("#DOB_day");

  monthSelect.on("change", e => {
    var selectedValue = e.target.value;

    const thirtyDayMonths = ["04", "06", "09", "11"];


    if (thirtyDayMonths.includes(selectedValue)) {
      if (daySelect.val() === '31') {
        daySelect.val("1").trigger('change');
      }
      daySelect.find('[value="31"]').attr("disabled", "disabled");
    } else if (selectedValue === "02") {
      switch (daySelect.val()) {
        case '29':
        case '30':
        case '31':
        {
          daySelect.val("01").trigger('change');
        }
      }
      daySelect.find('[value="29"],[value="30"],[value="31"]').attr("disabled", "disabled");
    } else {
      daySelect.find("option").removeAttr("disabled");
    }
  });
}

$(() => {
  alertModal.init()
  initCities();
  initBirthDate();
  initListenValidForm();
  handleBirthDateValidator();

  photoPassportBtn.on("change", async event => setPhotoPassport(event));
});
