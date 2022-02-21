var testID;
var btnSubmissionForm = $(".btn-submission-form");
var uploadResultField = $('.upload-result');
var photoResultBtn = $('[name="photo_result"]');
var photoResultFile;

/**
 * It returns the value of the radio button that is selected.
 */
const selectedTestResult = () => $('[name="result"]:checked').val();

/**
 * It takes the file that the user has uploaded and converts it to a base64 string.
 * @param event - The event object that was triggered.
 * @returns The image file that was uploaded.
 */
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

/**
 * The function is called when the page is loaded.
 * It checks if the teskitIdParam is set.
 * If it is, it sets the testID to the value of teskitIdParam.
 * Otherwise, it redirects the page to the root of the site
 * @returns The return value is the result of the function call.
 */
function initTestID() {
  if (teskitIdParam) {
    testID = teskitIdParam;
    return;
  }
  location.href = '/';
}

function handleFormInvalid() {
  alertModal.display({
    modalId: 'alertModal',
    icon: "error",
    content: "נא להעלות את תמונת הבדיקה ולבחור את התוצאה",
    hideSecondary: true,
    primaryLabel: "הבנתי",
  });
}

function handleFormSubmit() {

  /**
   * Given the selectedTestResult, return the corresponding test result
   * @returns The result of the test.
   */
  const getSetectedTestResult = () => {
    if (selectedTestResult() === 'c') {
      return 'negative'
    } else if (selectedTestResult() === 'ct') {
      return 'positive'
    } else {
      return 'defected'
    }
  }

  let formData = new FormData();

  formData.append("image", photoResultBtn[0].files[0]);
  formData.append('display_type', selectedTestResult());
  formData.append('status', getSetectedTestResult());

  var requestOpbject = new RequestObject('POST', formData, false, 'text', false);

  $('.result-input').addClass('d-none')
  btnSubmissionForm.prop('disabled', true).text('שולח תוצאה...');

  request(`/api/test-kit/${teskitIdParam}/upload-result`, requestOpbject)
    .then(res => handleSubmitSuccess())
    .catch((res, ajax, status) => handleSubmitFailure())

}

function handleSubmitSuccess() {
  alertModal.display({
    modalId: 'alertModal',
    icon: "success",
    content: "ביצוע בדיקה נשלח",
    hideSecondary: true,
    primaryLabel: "סיום",
    primaryAction: () => (location.href = '/profile'),
  });
}

function handleSubmitFailure() {
  $('.result-input').removeClass('d-none')
  btnSubmissionForm.prop('disabled', false).text('סיים ושלח');

  alertModal.display({
    modalId: 'alertModal',
    content: "לא ניתן להעלות את תוצאת הבדיקה, אנה נסה שוב",
    hideSecondary: true,
    primaryLabel: "הבנתי",
  });
}

/**
 * If the user has selected a photo and a test result, return true
 * @returns The form is being returned.
 */
const isValidFormResults = () => {
  return photoResultBtn[0].files?.length !== 0 && selectedTestResult() !== undefined;
}

function testSubmissionClickHandler() {

  isValidFormResults() ? handleFormSubmit() : handleFormInvalid();

}


$(() => {
  initTestID();
  photoResultBtn.on("change", async e => setPhotoResult(e));
  btnSubmissionForm.on("click", async e => testSubmissionClickHandler(e));
});
