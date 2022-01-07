var testID;
var btnSubmissionForm = $(".btn-submission-form");
var uploadResultField = $('.upload-result');
var photoResultBtn = $('[name=photo_result]');
var photoResultFile;

async function setPhotoResult(event) {
  if (event && event.target.files) {
    photoResultFile = event.target.files[0];
    const photoFileBase64 = await toBase64(photoResultFile);
    if (photoFileBase64) {
      uploadResultField.attr('src', photoFileBase64)
      uploadResultField.removeClass('d-none')
      return
    }
  }
  photoResultFile = undefined;
  uploadResultField.attr('src', undefined);
  uploadResultField.addClass('d-none')
}

function initTestID() {
  const pathname = location.pathname;
  const testIdFromPathName = pathname.replace(/^\//).replace(/\/test/);
  if (testIdFromPathName) {
    testID = testIdFromPathName;
    return;
  }
  location.href = '/';
}

function testSubmissionClickHandler() {
  alertModal.display({
    modalId: 'alertModal',
    icon: "success",
    content: "תוצאה נשלחה בהצלחה",
    hideSecondary: true,
    primaryLabel: "סיום",
    primaryAction: () => (location.href = '/profile'),
  });
}

$(() => {
  initTestID();
  photoResultBtn.on("change", async event => setPhotoResult(event));
  btnSubmissionForm.on("click", async e => testSubmissionClickHandler(e));
});
