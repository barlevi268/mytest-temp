var impairTestBarcodeField = $('.impair-test-barcode');
var uploadCaddyField = $('.upload-caddy');
var photoPassportBtn = $('[name=photo_passport]');
var addNewUserForm = $('#addNewUser');
var photoPassportFile;
var barCodeValue;

const fakeVisit = {
  fullName: "חיים רפאלי",
  testBarcode: "40132164",
  visitId: "31628"
};

function fakeVisitSuccess() {
  let params = {};
  addNewUserForm.find('[name]').each(function() {
    params[$(this).attr("name")] = $(this).val();
  });
  params = {
    ...params,
    barCodeValue
  }
  alertModal.display({
    modalId: "visitSuccessModal",
    primaryLabel: "סיום",
    secondaryLabel: "הוסף נבדק נוסף",
    icon: "success",
    primaryAction: () => gotoPayment(),
    secondaryAction: () => resetForm(),
    onInit: () => {}
  });
}


function setValueBarCode(value) {
  if (value) {
    barCodeValue = value;
    impairTestBarcodeField.removeClass('d-none')
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

function gotoPayment() {
  Swal.warning('go to Payment') // TODO gotoPayment;
}

function resetForm() {
  if (addNewUserForm && addNewUserForm[0]) {
    addNewUserForm[0].reset();
    setPhotoPassport();
    setValueBarCode();
  }
}

$(() => {
  // webcam.init();
  mobileStream.init({
    resultInput:'[name=barcode]',
    openButton: '.mobile-stream-btn',
    resultInputCallback: (value) => setValueBarCode(value)
  });

  photoPassportBtn.on("change", async event => setPhotoPassport(event));
});
